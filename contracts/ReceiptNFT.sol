// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ReceiptNFT
 * @dev Implementation of BlockReceipt.ai NFT collection using ERC-1155 standard
 *      with additional functionality for handling receipt data and encryption.
 */
contract ReceiptNFT is ERC1155, Ownable, ERC1155Supply, ReentrancyGuard {
    // Counter for token IDs
    uint256 private _currentTokenId = 1;
    
    // Receipt tier mapping (token ID => tier)
    mapping(uint256 => string) private _receiptTiers;
    
    // Encryption data mapping (token ID => encryption data)
    mapping(uint256 => EncryptionData) private _encryptionData;
    
    // Metadata URI mapping (token ID => URI)
    mapping(uint256 => string) private _tokenURIs;
    
    // Structure for storing encryption data
    struct EncryptionData {
        string capsule;
        string ciphertext;
        bool encrypted;
    }
    
    // Events
    event ReceiptMinted(address indexed to, uint256 tokenId, string uri);
    event EncryptedData(uint256 indexed tokenId, string capsule, string ciphertext);
    
    /**
     * @dev Constructor for the ReceiptNFT contract
     * @param uri base URI for the tokens
     */
    constructor(string memory uri) ERC1155(uri) {}
    
    /**
     * @dev Mint a new receipt NFT
     * @param to recipient address
     * @param uri metadata URI
     * @param tier receipt tier (bronze, silver, gold, platinum)
     * @return token ID of the minted receipt
     */
    function mintReceipt(
        address to,
        string calldata uri,
        string calldata tier
    ) external returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        
        // Get token ID
        uint256 tokenId = _currentTokenId;
        _currentTokenId += 1;
        
        // Mint token
        _mint(to, tokenId, 1, "");
        
        // Store metadata URI and tier
        _tokenURIs[tokenId] = uri;
        _receiptTiers[tokenId] = tier;
        
        // Emit event
        emit ReceiptMinted(to, tokenId, uri);
        
        return tokenId;
    }
    
    /**
     * @dev Log encryption data for a token
     * @param tokenId token ID
     * @param capsule encryption capsule
     * @param ciphertext encrypted data
     */
    function logEncryptionData(
        uint256 tokenId,
        string calldata capsule,
        string calldata ciphertext
    ) external {
        require(exists(tokenId), "Token does not exist");
        
        // Store encryption data
        _encryptionData[tokenId] = EncryptionData({
            capsule: capsule,
            ciphertext: ciphertext,
            encrypted: true
        });
        
        // Emit event
        emit EncryptedData(tokenId, capsule, ciphertext);
    }
    
    /**
     * @dev Get the URI for a token
     * @param tokenId token ID
     * @return URI string
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
    
    /**
     * @dev Get the tier for a receipt
     * @param tokenId token ID
     * @return tier string
     */
    function getReceiptTier(uint256 tokenId) external view returns (string memory) {
        require(exists(tokenId), "Tier query for nonexistent token");
        return _receiptTiers[tokenId];
    }
    
    /**
     * @dev Get current token ID counter
     * @return current token ID
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _currentTokenId;
    }
    
    /**
     * @dev Check if a token is encrypted
     * @param tokenId token ID
     * @return encryption status
     */
    function isEncrypted(uint256 tokenId) external view returns (bool) {
        require(exists(tokenId), "Query for nonexistent token");
        return _encryptionData[tokenId].encrypted;
    }
    
    /**
     * @dev Get encryption data for a token
     * @param tokenId token ID
     * @return capsule and ciphertext
     */
    function getEncryptionData(uint256 tokenId) external view returns (string memory, string memory) {
        require(exists(tokenId), "Query for nonexistent token");
        require(_encryptionData[tokenId].encrypted, "Token is not encrypted");
        
        return (_encryptionData[tokenId].capsule, _encryptionData[tokenId].ciphertext);
    }
    
    /**
     * @dev Override for ERC1155 _beforeTokenTransfer hook
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}