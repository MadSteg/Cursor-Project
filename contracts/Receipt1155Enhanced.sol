// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Receipt1155Enhanced
 * @dev ERC1155 token representing digital receipts with enhanced features
 * - Role-based access control instead of simple ownership
 * - Events for better on-chain traceability
 * - Pausable for emergency stops
 * - Burn functionality for revocation
 * - Improved URI handling
 */
contract Receipt1155Enhanced is ERC1155, AccessControl, Pausable {
    using Strings for uint256;
    
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Token URI management
    mapping(uint256 => string) private _tokenURIs;
    string private _baseURI;
    
    // Token metadata - store additional information about each receipt
    struct ReceiptMetadata {
        uint256 timestamp;
        bool revoked;
        string receiptType; // standard, premium, luxury
    }
    mapping(uint256 => ReceiptMetadata) private _receiptMetadata;
    
    // Events
    event ReceiptMinted(address indexed to, uint256 indexed tokenId, string uri, string receiptType);
    event ReceiptRevoked(uint256 indexed tokenId);
    event ReceiptBurned(address indexed owner, uint256 indexed tokenId, uint256 amount);
    event BaseURISet(string newBaseURI);
    
    /**
     * @dev Constructor
     * @param baseURI Base URI for all tokens
     */
    constructor(string memory baseURI) ERC1155("") {
        _baseURI = baseURI;
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        emit BaseURISet(baseURI);
    }
    
    /**
     * @dev Mint a new receipt token
     * @param to Address receiving the receipt
     * @param tokenId The token/receipt identifier - made system-generated instead of user-provided
     * @param amount Amount of tokens to mint (usually 1)
     * @param tokenURI URI for the token's metadata
     * @param receiptType Type of receipt (standard, premium, luxury)
     */
    function mintReceipt(
        address to,
        uint256 tokenId,
        uint256 amount,
        string calldata tokenURI,
        string calldata receiptType
    ) external whenNotPaused onlyRole(MINTER_ROLE) {
        require(bytes(_receiptMetadata[tokenId].receiptType).length == 0, "Receipt already exists");
        
        _tokenURIs[tokenId] = tokenURI;
        _receiptMetadata[tokenId] = ReceiptMetadata({
            timestamp: block.timestamp,
            revoked: false,
            receiptType: receiptType
        });
        
        _mint(to, tokenId, amount, "");
        
        emit ReceiptMinted(to, tokenId, tokenURI, receiptType);
    }
    
    /**
     * @dev Batch mint multiple receipts at once
     * @param to Address receiving the receipts
     * @param tokenIds Array of token IDs
     * @param amounts Array of amounts
     * @param tokenURIs Array of token URIs
     * @param receiptTypes Array of receipt types
     */
    function batchMintReceipts(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        string[] calldata tokenURIs,
        string[] calldata receiptTypes
    ) external whenNotPaused onlyRole(MINTER_ROLE) {
        require(
            tokenIds.length == amounts.length &&
            tokenIds.length == tokenURIs.length &&
            tokenIds.length == receiptTypes.length,
            "Input arrays must have same length"
        );
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(bytes(_receiptMetadata[tokenIds[i]].receiptType).length == 0, "Receipt already exists");
            
            _tokenURIs[tokenIds[i]] = tokenURIs[i];
            _receiptMetadata[tokenIds[i]] = ReceiptMetadata({
                timestamp: block.timestamp,
                revoked: false,
                receiptType: receiptTypes[i]
            });
            
            emit ReceiptMinted(to, tokenIds[i], tokenURIs[i], receiptTypes[i]);
        }
        
        _mintBatch(to, tokenIds, amounts, "");
    }
    
    /**
     * @dev Burn tokens - can be called by token owners or admins
     * @param from Address that owns the tokens
     * @param tokenId Token ID to burn
     * @param amount Amount to burn
     */
    function burn(
        address from,
        uint256 tokenId,
        uint256 amount
    ) external {
        require(
            from == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "Caller must be owner or admin"
        );
        
        _burn(from, tokenId, amount);
        
        emit ReceiptBurned(from, tokenId, amount);
    }
    
    /**
     * @dev Revoke a receipt (mark as invalid without burning)
     * @param tokenId The token ID to revoke
     */
    function revokeReceipt(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
        require(bytes(_receiptMetadata[tokenId].receiptType).length > 0, "Receipt does not exist");
        require(!_receiptMetadata[tokenId].revoked, "Receipt already revoked");
        
        _receiptMetadata[tokenId].revoked = true;
        
        emit ReceiptRevoked(tokenId);
    }
    
    /**
     * @dev Set the base URI for all token IDs
     * @param newBaseURI New base URI
     */
    function setBaseURI(string calldata newBaseURI) external onlyRole(ADMIN_ROLE) {
        _baseURI = newBaseURI;
        
        emit BaseURISet(newBaseURI);
    }
    
    /**
     * @dev Get the URI for a token
     * @param tokenId Token ID to get URI for
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];
        
        // If there's no token-specific URI, use the baseURI + tokenId
        if (bytes(tokenURI).length == 0) {
            return string(abi.encodePacked(_baseURI, tokenId.toString()));
        }
        
        // If we have a baseURI and a token-specific URI, concatenate them
        if (bytes(_baseURI).length > 0) {
            return string(abi.encodePacked(_baseURI, tokenURI));
        }
        
        return tokenURI;
    }
    
    /**
     * @dev Get receipt metadata
     * @param tokenId Token ID to get metadata for
     */
    function getReceiptMetadata(uint256 tokenId) external view returns (
        uint256 timestamp,
        bool revoked,
        string memory receiptType
    ) {
        require(bytes(_receiptMetadata[tokenId].receiptType).length > 0, "Receipt does not exist");
        
        ReceiptMetadata memory metadata = _receiptMetadata[tokenId];
        return (metadata.timestamp, metadata.revoked, metadata.receiptType);
    }
    
    /**
     * @dev Check if a receipt is valid (exists and not revoked)
     * @param tokenId Token ID to check
     */
    function isValidReceipt(uint256 tokenId) public view returns (bool) {
        return bytes(_receiptMetadata[tokenId].receiptType).length > 0 && 
               !_receiptMetadata[tokenId].revoked;
    }
    
    /**
     * @dev Pause all token transfers and minting
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers and minting
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Override _beforeTokenTransfer to check for paused state
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    
    /**
     * @dev Required override from AccessControl
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Contract URI for marketplace metadata
     */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(_baseURI, "contract"));
    }
}