// contracts/SimpleStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract SimpleStorage {
    uint256 private storedValue;

    //func to set the value
    function set(uint256 _value) public {
        storedValue = _value;
    }

    //func to read the value stored
    function get() public view returns (uint256) {
        return storedValue;
    }
}
