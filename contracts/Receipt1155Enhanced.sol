// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Receipt1155Enhanced
 * @dev Enhanced ERC-1155 contract for BlockReceipt.ai with passport stamp support
 */
contract Receipt1155Enhanced is ERC1155, Ownable {
    using Strings for uint256;
    
    // Token URI mapping
    mapping(uint256 => string) private _tokenURIs;
    
    // Receipt hash mapping
    mapping(uint256 => bytes32) private _receiptHashes;
    
    // Passport stamp URI mapping
    mapping(uint256 => string) private _stampURIs;
    
    // Metadata encryption status mapping
    mapping(uint256 => bool) private _encryptedStatus;
    
    // Metadata access control policy ID mapping
    mapping(uint256 => string) private _policyIds;
    
    // Next token ID counter
    uint256 private _nextTokenId = 1;
    
    // Events
    event ReceiptMinted(address indexed to, uint256 indexed tokenId, bytes32 receiptHash, string uri, string stampUri);
    event StampUpdated(uint256 indexed tokenId, string stampUri);
    event EncryptionStatusSet(uint256 indexed tokenId, bool encrypted);
    event PolicyIdSet(uint256 indexed tokenId, string policyId);

    /**
     * @dev Constructor initializes the contract with an owner
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    /**
     * @dev Mint a receipt NFT with a specific token ID
     * @param to Recipient address
     * @param tokenId Specific token ID to mint
     * @param receiptHash Hash of the receipt data for verification
     * @param uri_ Metadata URI for the token
     * @param stampUri_ Passport stamp URI for the token (optional)
     * @param encrypted Whether the metadata is encrypted
     * @param policyId The encryption policy ID (optional)
     */
    function mintReceipt(
        address to,
        uint256 tokenId,
        bytes32 receiptHash,
        string calldata uri_,
        string calldata stampUri_,
        bool encrypted,
        string calldata policyId
    ) external onlyOwner {
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _stampURIs[tokenId] = stampUri_;
        _encryptedStatus[tokenId] = encrypted;
        _policyIds[tokenId] = policyId;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(to, tokenId, receiptHash, uri_, stampUri_);
        emit EncryptionStatusSet(tokenId, encrypted);
        
        if (bytes(policyId).length > 0) {
            emit PolicyIdSet(tokenId, policyId);
        }
    }

    /**
     * @dev Mint a new receipt NFT with an auto-generated token ID
     * @param to Recipient address
     * @param receiptHash Hash of the receipt data for verification
     * @param uri_ Metadata URI for the token
     * @param stampUri_ Passport stamp URI for the token (optional)
     * @param encrypted Whether the metadata is encrypted
     * @param policyId The encryption policy ID (optional)
     * @return The new token ID
     */
    function mintNewReceipt(
        address to,
        bytes32 receiptHash,
        string calldata uri_,
        string calldata stampUri_,
        bool encrypted,
        string calldata policyId
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _stampURIs[tokenId] = stampUri_;
        _encryptedStatus[tokenId] = encrypted;
        _policyIds[tokenId] = policyId;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(to, tokenId, receiptHash, uri_, stampUri_);
        emit EncryptionStatusSet(tokenId, encrypted);
        
        if (bytes(policyId).length > 0) {
            emit PolicyIdSet(tokenId, policyId);
        }
        
        return tokenId;
    }

    /**
     * @dev Update the passport stamp URI for a token
     * @param tokenId The token ID to update
     * @param stampUri_ The new passport stamp URI
     */
    function updateStampUri(uint256 tokenId, string calldata stampUri_) external onlyOwner {
        require(bytes(_tokenURIs[tokenId]).length > 0, "Token does not exist");
        _stampURIs[tokenId] = stampUri_;
        emit StampUpdated(tokenId, stampUri_);
    }

    /**
     * @dev Update the encryption policy ID for a token
     * @param tokenId The token ID to update
     * @param policyId The new encryption policy ID
     */
    function updatePolicyId(uint256 tokenId, string calldata policyId) external onlyOwner {
        require(bytes(_tokenURIs[tokenId]).length > 0, "Token does not exist");
        _policyIds[tokenId] = policyId;
        emit PolicyIdSet(tokenId, policyId);
    }

    /**
     * @dev Set the encryption status for a token
     * @param tokenId The token ID to update
     * @param encrypted The new encryption status
     */
    function setEncryptionStatus(uint256 tokenId, bool encrypted) external onlyOwner {
        require(bytes(_tokenURIs[tokenId]).length > 0, "Token does not exist");
        _encryptedStatus[tokenId] = encrypted;
        emit EncryptionStatusSet(tokenId, encrypted);
    }

    /**
     * @dev Get token URI
     * @param tokenId The token ID to query
     * @return The token's metadata URI
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Get passport stamp URI
     * @param tokenId The token ID to query
     * @return The token's passport stamp URI
     */
    function stampUri(uint256 tokenId) public view returns (string memory) {
        return _stampURIs[tokenId];
    }

    /**
     * @dev Get receipt hash
     * @param tokenId The token ID to query
     * @return The token's receipt hash
     */
    function getReceiptHash(uint256 tokenId) public view returns (bytes32) {
        return _receiptHashes[tokenId];
    }

    /**
     * @dev Verify a receipt hash
     * @param tokenId The token ID to verify
     * @param hash The hash to verify against
     * @return Whether the hash matches the stored hash
     */
    function verifyReceiptHash(uint256 tokenId, bytes32 hash) public view returns (bool) {
        return _receiptHashes[tokenId] == hash;
    }

    /**
     * @dev Get encryption status
     * @param tokenId The token ID to query
     * @return Whether the token's metadata is encrypted
     */
    function isEncrypted(uint256 tokenId) public view returns (bool) {
        return _encryptedStatus[tokenId];
    }

    /**
     * @dev Get policy ID
     * @param tokenId The token ID to query
     * @return The token's encryption policy ID
     */
    function getPolicyId(uint256 tokenId) public view returns (string memory) {
        return _policyIds[tokenId];
    }

    /**
     * @dev Get full token data for frontend display
     * @param tokenId The token ID to query
     * @return Token URI, stamp URI, encrypted status, and policy ID
     */
    function getTokenData(uint256 tokenId) public view returns (
        string memory tokenUri,
        string memory stampUri_,
        bool encrypted,
        string memory policyId
    ) {
        require(bytes(_tokenURIs[tokenId]).length > 0, "Token does not exist");
        return (
            _tokenURIs[tokenId],
            _stampURIs[tokenId],
            _encryptedStatus[tokenId],
            _policyIds[tokenId]
        );
    }
}