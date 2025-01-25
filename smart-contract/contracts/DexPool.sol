// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./DexLiquidityToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DexPool {
    using SafeMath for uint;
    using Math for uint;

    //defining state variable
    address public token1;
    address public token2;

    uint256 public reserve1;
    uint256 public reserve2;

    // AMM gestion of liquidity pool follows x * y = K
    uint256 public constantK;

    //defining liquidity token (type of our other contract)
    DexLiquidityToken public liquidityToken;

    //defining events
    event Swap(
        address indexed sender,
        uint256 amountIn,
        uint256 amountOut,
        address tokenIn,
        address tokenOut
    );
    event LiquidityAdded(
        address indexed provider,
        uint256 amountToken1,
        uint256 amountToken2
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountToken1,
        uint amountToken2
    );

    constructor(
        address _token1,
        address _token2,
        string memory _liquidityTokenName,
        string memory _liquidityTokenSymbol
    ) {
        token1 = _token1;
        token2 = _token2;
        // creating associate liquidity token
        liquidityToken = new DexLiquidityToken(
            _liquidityTokenName,
            _liquidityTokenSymbol
        );
    }

    function addLiquidity(uint amountToken1, uint amountToken2) external {
        //checkings ------------------------------------------------------------------------------------------
        require(
            amountToken1 > 0 && amountToken2 > 0,
            "Error, amount must be greater than 0"
        );

        //create and send liquidityTokens to liquidity provider ----------------------------------------------
        uint256 liquidity;
        uint256 totalSupplyOfToken = liquidityToken.totalSupply();

        //1st liquidity amount sent (amount of liquidity at initializatiion) is different than later ones
        if (totalSupplyOfToken == 0) {
            liquidity = amountToken1.mul(amountToken2).sqrt();
        } else {
            //amount of liquidity token that we will send is proportional to the contribtion regarding
            //existant reserves. Moreover, we sent the minimum between the calculation for both token
            //so issuance of liquidity token is based on the asset with the lower calculated ratio
            liquidity = amountToken1.mul(totalSupplyOfToken).div(reserve1).min(
                amountToken2.mul(totalSupplyOfToken).div(reserve2)
            );
        }
        //mint and send the amount of liquidity tokens
        liquidityToken.mint(msg.sender, liquidity);

        //transfer amountToken1 and amountToken2 in the liquidity pool ---------------------------------------
        require(
            IERC20(token1).transferFrom(
                msg.sender,
                address(this),
                amountToken1
            ),
            "Error, Transfer token1 to pool failed"
        );
        require(
            IERC20(token2).transferFrom(
                msg.sender,
                address(this),
                amountToken2
            ),
            "Error, Transfer token2 to pool failed"
        );

        //update reserve1 and reserve2 -----------------------------------------------------------------------
        reserve1 += amountToken1;
        reserve2 += amountToken2;

        //update the constant formula ------------------------------------------------------------------------
        _updateConstantFormula();

        //emit event -----------------------------------------------------------------------------------------
        emit LiquidityAdded(msg.sender, amountToken1, amountToken2);
    }

    function removeLiquidity(uint amountOfLiquidity) external {
        uint256 totalLiquidityTokenSupply = liquidityToken.totalSupply();

        //checkings -----------------------------------------------------------------------------------------
        require(
            amountOfLiquidity > 0,
            "Amount of liquidity must be greater than 0"
        );
        require(
            amountOfLiquidity <= totalLiquidityTokenSupply,
            "Error, Liquidity asked to remove is more than total supply"
        );

        //burn the amount of liquidityToken asked by the sender ----------------------------------------------
        liquidityToken.burn(msg.sender, amountOfLiquidity);

        //transfer the token1 and token2 to the liquidity provider (msg.sender) ------------------------------
        // calculate amount to transfer
        uint256 amount1 = (reserve1.mul(amountOfLiquidity)).div(
            totalLiquidityTokenSupply
        );
        uint256 amount2 = (reserve2.mul(amountOfLiquidity)).div(
            totalLiquidityTokenSupply
        );

        //transfer back the token1 and token2
        require(
            IERC20(token1).transfer(msg.sender, amount1),
            "Error, transfer of token1 failed"
        );
        require(
            IERC20(token2).transfer(msg.sender, amount2),
            "Error, transfer of token2 failed"
        );

        //update reserve1 and reserve2 -----------------------------------------------------------------------
        reserve1 -= amount1;
        reserve2 -= amount2;

        //update the constant formula ------------------------------------------------------------------------
        _updateConstantFormula();

        //emit event -----------------------------------------------------------------------------------------
        emit LiquidityRemoved(msg.sender, amount1, amount2);
    }

    function swapTokens(
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOut
    ) external {
        //checkings -----------------------------------------------------------------------------------------
        require(
            amountIn > 0 && amountOut > 0,
            "Error, amounts must be greater than 0"
        );
        require(
            (fromToken == token1 && toToken == token2) ||
                (fromToken == token2 && toToken == token1),
            "Error, Tokens need to be pairs of the liquidity pool"
        );
        //checking balances to see if the swap is possible
        //(enough tokenFrom on the sender address AND enough tokenTo on the liquidity pool)
        IERC20 fromTokenContract = IERC20(fromToken);
        IERC20 toTokenContract = IERC20(toToken);
        require(
            fromTokenContract.balanceOf(msg.sender) >= amountIn,
            "Error, insufficient balance of tokenFrom"
        );
        require(
            toTokenContract.balanceOf(address(this)) >= amountOut,
            "Error, insufficient balance of tokenTo"
        );

        //verify that amountOut is less or equal to expected amount after calculation ----------------------
        uint256 expectedAmountOut;
        uint256 effectiveAmountIn = amountIn.mul(997).div(1000); // 0,3% of fee applied on amountIn

        //calculation logic :
        //in case amountIn token1 reserve1 and amountOut token2 reserve2
        //we want to keep this formula true : reserve1 * reserve2 = constantK
        // (reserve1 + amountIn) * (reserve2 - expectedAmountOut) = constantK
        //so expectedAmountOut = reserve2 - constantK/(reserve1 + amountIn)
        if (fromToken == token1 && toToken == token2) {
            expectedAmountOut = reserve2.sub(
                constantK.div(reserve1.add(effectiveAmountIn))
            );
        } else {
            expectedAmountOut = reserve1.sub(
                constantK.div(reserve2.add(effectiveAmountIn))
            );
        }
        //verify amounts out coherence (to check if the promise amount is inferior or equal to real one)
        require(
            amountOut <= expectedAmountOut,
            "Promise out amount is lower than final amountOut"
        );

        //perform the swap : transfer amountIn to pool, transfer amountOut from the pool to sender ----------
        require(
            fromTokenContract.transferFrom(msg.sender, address(this), amountIn),
            "Error, transfer of tokenFrom failed"
        );
        require(
            toTokenContract.transfer(msg.sender, expectedAmountOut),
            "Error, transfer of tokenTo failed"
        );

        //upload reserve1 and reserve2 ----------------------------------------------------------------------
        if (fromToken == token1 && toToken == token2) {
            reserve1 = reserve1.add(amountIn);
            reserve2 = reserve2.sub(expectedAmountOut);
        } else {
            reserve2 = reserve2.add(amountIn);
            reserve1 = reserve1.sub(expectedAmountOut);
        }

        //check that the result is maintaining the constant formula (x*y=K) and update formula---------------
        require(
            reserve1.mul(reserve2) >= constantK, //supposed to be a bit greater after the fees have been added
            "Error, swap does not preserve constant formula"
        );
        _updateConstantFormula();

        //emit events ----------------------------------------------------------------------------------------
        emit Swap(msg.sender, amountIn, expectedAmountOut, fromToken, toToken);
    }

    function _updateConstantFormula() internal {
        constantK = reserve1.mul(reserve2);
        require(constantK > 0, "Error, constant fromula not updated");
    }

    //returning the minimum expectedAmountOut for a swap (used by frontend)
    function getExpectedAmountOut(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) external view returns (uint256) {
        uint256 effectiveAmountIn = amountIn.mul(997).div(1000); // 0,3% of fee applied on amountIn

        if (fromToken == token1 && toToken == token2) {
            return reserve2.sub(constantK.div(reserve1.add(effectiveAmountIn)));
        } else {
            return reserve1.sub(constantK.div(reserve2.add(effectiveAmountIn)));
        }
    }

    //returning reserve values
    function getReserves()
        public
        view
        returns (uint valueReserve1, uint valueReserve2)
    {
        valueReserve1 = IERC20(token1).balanceOf(address(this));
        valueReserve2 = IERC20(token2).balanceOf(address(this));
        return (valueReserve1, valueReserve2);
    }

    function getTokenAddresses()
        public
        view
        returns (address addToken1, address addrToken2)
    {
        return (token1, token2);
    }
}
