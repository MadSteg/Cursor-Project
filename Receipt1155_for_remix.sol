// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Receipt1155 is ERC1155, Ownable {
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bytes32) private _receiptHashes;
    uint256 private _nextTokenId = 1;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function mintReceipt(
        address to,
        uint256 tokenId,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner {
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _mint(to, tokenId, 1, "");
    }

    function mintNewReceipt(
        address to,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _mint(to, tokenId, 1, "");
        return tokenId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getReceiptHash(uint256 tokenId) public view returns (bytes32) {
        return _receiptHashes[tokenId];
    }

    function verifyReceiptHash(uint256 tokenId, bytes32 hash) public view returns (bool) {
        return _receiptHashes[tokenId] == hash;
    }
}