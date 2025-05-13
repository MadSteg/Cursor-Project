// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Receipt1155 is ERC1155, Ownable {
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bytes32) private _receiptHashes;
    mapping(uint256 => address) private _receiptOwners;
    
    uint256 private _tokenIdCounter = 1;

    event ReceiptMinted(uint256 tokenId, address owner, string uri, bytes32 receiptHash);

    constructor() ERC1155("") {}

    function mint(
        address to,
        string calldata uri_,
        bytes32 receiptHash
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _receiptOwners[tokenId] = to;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(tokenId, to, uri_, receiptHash);
        
        return tokenId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    function verifyReceipt(uint256 tokenId, bytes32 receiptHash) public view returns (bool) {
        return _receiptHashes[tokenId] == receiptHash;
    }
    
    function getReceiptHash(uint256 tokenId) public view returns (bytes32) {
        return _receiptHashes[tokenId];
    }
    
    function getReceiptOwner(uint256 tokenId) public view returns (address) {
        return _receiptOwners[tokenId];
    }
}