// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockReceiptCollection is ERC1155, Ownable {
    constructor(string memory baseURI) ERC1155(baseURI) {}
    
    function mint(address to, uint256 id) external onlyOwner {
        _mint(to, id, 1, "");
    }
}