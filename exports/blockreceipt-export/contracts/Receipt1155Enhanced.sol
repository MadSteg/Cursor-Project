// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IProxyReEncryption {
  function reencrypt(bytes calldata capsule, address delegatee) external returns (bytes memory);
}

contract Receipt1155Enhanced is ERC1155, Ownable {
    // Threshold PRE integration
    IProxyReEncryption public immutable preModule;
    mapping(uint256 => bytes) public encryptedReceipts;
    mapping(uint256 => bytes) public receiptCapsules;
    mapping(uint256 => mapping(address => bytes)) public reCapsules;
    
    // Original Receipt1155 functionality
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bytes32) private _receiptHashes;
    uint256 private _nextTokenId = 1;
    
    // Events
    event EncryptedReceiptMinted(uint256 indexed tokenId, address indexed to, bytes32 indexed receiptHash);
    event AccessGranted(uint256 indexed tokenId, address indexed delegatee);
    event AccessRevoked(uint256 indexed tokenId, address indexed delegatee);

    constructor(
        string memory uri_,
        address _preModule,
        address initialOwner
    ) ERC1155(uri_) Ownable(initialOwner) {
        preModule = IProxyReEncryption(_preModule);
    }

    // Enhanced mint function with encryption support
    function mintEncrypted(
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner {
        (bytes memory cipherText, bytes memory capsule) = abi.decode(data, (bytes, bytes));
        
        encryptedReceipts[id] = cipherText;
        receiptCapsules[id] = capsule;
        _receiptHashes[id] = receiptHash;
        _tokenURIs[id] = uri_;
        
        _mint(to, id, amount, "");
        
        emit EncryptedReceiptMinted(id, to, receiptHash);
    }

    // Original mint function for backwards compatibility
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

    // Mint new receipt with auto-incrementing ID
    function mintNewEncryptedReceipt(
        address to,
        bytes calldata data,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        (bytes memory cipherText, bytes memory capsule) = abi.decode(data, (bytes, bytes));
        
        encryptedReceipts[tokenId] = cipherText;
        receiptCapsules[tokenId] = capsule;
        _receiptHashes[tokenId] = receiptHash;
        _tokenURIs[tokenId] = uri_;
        
        _mint(to, tokenId, 1, "");
        
        emit EncryptedReceiptMinted(tokenId, to, receiptHash);
        return tokenId;
    }

    // Access control methods
    function grantAccess(uint256 id, address delegatee) external onlyOwner {
        bytes memory capsule = receiptCapsules[id];
        require(capsule.length != 0, "No encrypted receipt found");
        
        reCapsules[id][delegatee] = preModule.reencrypt(capsule, delegatee);
        
        emit AccessGranted(id, delegatee);
    }

    function revokeAccess(uint256 id, address delegatee) external onlyOwner {
        delete reCapsules[id][delegatee];
        
        emit AccessRevoked(id, delegatee);
    }

    // View functions
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getReceiptHash(uint256 tokenId) public view returns (bytes32) {
        return _receiptHashes[tokenId];
    }

    function verifyReceiptHash(uint256 tokenId, bytes32 hash) public view returns (bool) {
        return _receiptHashes[tokenId] == hash;
    }
    
    function hasAccess(uint256 tokenId, address user) public view returns (bool) {
        return reCapsules[tokenId][user].length > 0;
    }
    
    function getEncryptedReceipt(uint256 tokenId) public view returns (bytes memory) {
        return encryptedReceipts[tokenId];
    }
    
    function getReCapsule(uint256 tokenId, address user) public view returns (bytes memory) {
        return reCapsules[tokenId][user];
    }
}