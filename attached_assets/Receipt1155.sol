// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Receipt1155 is ERC1155, Ownable {
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC1155("") {}

    function mint(
        address to,
        uint256 skuId,
        uint256 amount,
        string calldata uri_
    ) external onlyOwner {
        _tokenURIs[skuId] = uri_;
        _mint(to, skuId, amount, "");
    }

    function uri(uint256 skuId) public view override returns (string memory) {
        return _tokenURIs[skuId];
    }
}
