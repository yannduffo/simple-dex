// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DexLiquidityToken is ERC20, AccessControl {
    /**
     * @notice Constructor to initialize the LP token
     * @param _name The name of the LP token
     * @param _symbol The symbol of the LP token
     * @dev Grants the `DEFAULT_ADMIN_ROLE` to the deployer (expected to be the DexPool contract)
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        //set admin role to constructer caller (here sender is DexPool)
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Allows the DexPool contract to mint new LP tokens
     * @param to The address to receive the minted tokens
     * @param amount The amount of tokens to mint
     * @dev Only accessible by addresses with the `DEFAULT_ADMIN_ROLE`
     */
    function mint(
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(to, amount);
    }

    /**
     * @notice Allows the DexPool contract to burn liquidity tokens
     * @param to The address whose tokens will be burned
     * @param amount The amount of tokens to burn
     * @dev Only accessible by addresses with the `DEFAULT_ADMIN_ROLE`
     */
    function burn(
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _burn(to, amount);
    }
}
