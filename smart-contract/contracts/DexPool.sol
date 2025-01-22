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

    //defining liquidity token
    DexLiquidityToken public liquidityToken;

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
        constantK = reserve1.mul(reserve2);
        require(constantK > 0, "Error, Constant fromula not updated");
    }
}
