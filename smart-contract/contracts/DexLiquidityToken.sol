// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DexLiquidityToken is ERC20, AccessControl {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        //set admin role to constructer caller (here sender is DexPool)
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    //creating external mint func calling the internal ERC20 one (only accesible by DexPool contract)
    function mint(
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(to, amount);
    }
}
