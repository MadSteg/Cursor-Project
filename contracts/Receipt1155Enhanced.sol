// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Receipt1155Enhanced - Advanced ERC1155 Receipt NFT Contract
/// @author BlockReceipt.ai
/// @notice This contract is used to mint and manage digital receipts as NFTs
/// @dev ERC1155 token representing digital receipts with enhanced features including role management, events, and security features
/// @custom:security-contact security@blockreceipt.ai
contract Receipt1155Enhanced is ERC1155, AccessControl, Pausable {
    using Strings for uint256;
    
    /// @notice Role that grants admin privileges (pausing, revoking receipts, etc.)
    /// @dev keccak256 hash of "ADMIN_ROLE"
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    /// @notice Role that grants minting privileges
    /// @dev keccak256 hash of "MINTER_ROLE"
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    /// @notice Maps token IDs to their specific URI
    /// @dev This overrides the base ERC1155 URI behavior
    mapping(uint256 => string) private _tokenURIs;
    
    /// @notice Base URI for all token metadata
    /// @dev Used as a prefix for all token URIs
    string private _baseURI;
    
    /// @notice Metadata structure for each receipt
    /// @dev Stores on-chain receipt information
    struct ReceiptMetadata {
        /// @notice Timestamp when the receipt was created
        uint256 timestamp;
        
        /// @notice Whether the receipt has been revoked
        bool revoked;
        
        /// @notice Type of receipt (standard, premium, luxury)
        string receiptType;
    }
    
    /// @notice Maps token IDs to their metadata
    /// @dev Provides access to on-chain receipt information
    mapping(uint256 => ReceiptMetadata) private _receiptMetadata;
    
    /// @notice Emitted when a new receipt is minted
    /// @param to The address that received the receipt
    /// @param tokenId The token ID of the minted receipt
    /// @param uri The token URI for the receipt metadata
    /// @param receiptType The type of receipt minted (standard, premium, luxury)
    event ReceiptMinted(address indexed to, uint256 indexed tokenId, string uri, string receiptType);
    
    /// @notice Emitted when a receipt is revoked (without burning)
    /// @param tokenId The token ID of the revoked receipt
    event ReceiptRevoked(uint256 indexed tokenId);
    
    /// @notice Emitted when a receipt is burned
    /// @param owner The address that owned the receipt
    /// @param tokenId The token ID of the burned receipt
    /// @param amount The amount of tokens burned
    event ReceiptBurned(address indexed owner, uint256 indexed tokenId, uint256 amount);
    
    /// @notice Emitted when the base URI is updated
    /// @param newBaseURI The new base URI for all tokens
    event BaseURISet(string newBaseURI);
    
    /// @notice Initializes the contract with a base URI and sets up roles
    /// @dev Sets the deployer as admin and minter
    /// @param baseURI Base URI for all token metadata
    constructor(string memory baseURI) ERC1155("") {
        _baseURI = baseURI;
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        emit BaseURISet(baseURI);
    }
    
    /// @notice Mints a new receipt token
    /// @dev Can only be called by accounts with the MINTER_ROLE
    /// @param to Address receiving the receipt
    /// @param tokenId The token/receipt identifier - must be unique
    /// @param amount Amount of tokens to mint (usually 1)
    /// @param tokenURI URI for the token's metadata
    /// @param receiptType Type of receipt (standard, premium, luxury)
    /// @custom:event Emits a ReceiptMinted event
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
    
    /// @notice Batch mints multiple receipts in a single transaction
    /// @dev Efficiently mints multiple receipts, validates that all input arrays have the same length
    /// @param to Address receiving the receipts
    /// @param tokenIds Array of token IDs
    /// @param amounts Array of amounts
    /// @param tokenURIs Array of token URIs
    /// @param receiptTypes Array of receipt types
    /// @custom:event Emits multiple ReceiptMinted events
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
    
    /// @notice Burns receipt tokens
    /// @dev Can be called by token owners or admins
    /// @param from Address that owns the tokens
    /// @param tokenId Token ID to burn
    /// @param amount Amount to burn
    /// @custom:event Emits a ReceiptBurned event
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
    
    /// @notice Revokes a receipt (marks as invalid without burning)
    /// @dev Only callable by ADMIN_ROLE
    /// @param tokenId The token ID to revoke
    /// @custom:event Emits a ReceiptRevoked event
    function revokeReceipt(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
        require(bytes(_receiptMetadata[tokenId].receiptType).length > 0, "Receipt does not exist");
        require(!_receiptMetadata[tokenId].revoked, "Receipt already revoked");
        
        _receiptMetadata[tokenId].revoked = true;
        
        emit ReceiptRevoked(tokenId);
    }
    
    /// @notice Sets the base URI for all token metadata
    /// @dev Only callable by ADMIN_ROLE
    /// @param newBaseURI New base URI
    /// @custom:event Emits a BaseURISet event
    function setBaseURI(string calldata newBaseURI) external onlyRole(ADMIN_ROLE) {
        _baseURI = newBaseURI;
        
        emit BaseURISet(newBaseURI);
    }
    
    /// @notice Gets the full URI for a specific token
    /// @dev Overrides ERC1155 uri function
    /// @param tokenId Token ID to get URI for
    /// @return Complete URI string for the token metadata
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
    
    /// @notice Gets the on-chain metadata for a receipt
    /// @dev Returns the timestamp, revocation status, and receipt type
    /// @param tokenId Token ID to get metadata for
    /// @return timestamp When the receipt was created
    /// @return revoked Whether the receipt has been revoked
    /// @return receiptType The type of receipt (standard, premium, luxury)
    function getReceiptMetadata(uint256 tokenId) external view returns (
        uint256 timestamp,
        bool revoked,
        string memory receiptType
    ) {
        require(bytes(_receiptMetadata[tokenId].receiptType).length > 0, "Receipt does not exist");
        
        ReceiptMetadata memory metadata = _receiptMetadata[tokenId];
        return (metadata.timestamp, metadata.revoked, metadata.receiptType);
    }
    
    /// @notice Checks if a receipt exists and is not revoked
    /// @dev Returns false if the receipt doesn't exist or has been revoked
    /// @param tokenId Token ID to check
    /// @return True if receipt exists and is valid, false otherwise
    function isValidReceipt(uint256 tokenId) public view returns (bool) {
        return bytes(_receiptMetadata[tokenId].receiptType).length > 0 && 
               !_receiptMetadata[tokenId].revoked;
    }
    
    /// @notice Pauses all token transfers and minting
    /// @dev Only callable by ADMIN_ROLE
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /// @notice Unpauses token transfers and minting
    /// @dev Only callable by ADMIN_ROLE
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /// @notice Hook that is called before any token transfer
    /// @dev Ensures transfers cannot occur when contract is paused
    /// @param operator Address performing the transfer
    /// @param from Address tokens are transferred from
    /// @param to Address tokens are transferred to 
    /// @param ids Token IDs being transferred
    /// @param amounts Amounts of tokens being transferred
    /// @param data Additional data with no specified format
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
    
    /// @notice Determines which interfaces the contract supports
    /// @dev Required override to resolve inheritance conflict
    /// @param interfaceId Interface ID to check
    /// @return True if the interface is supported
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /// @notice Gets the contract-level metadata URI for marketplaces
    /// @dev Used by OpenSea and other marketplaces to display collection info
    /// @return URI string pointing to the collection metadata
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(_baseURI, "contract"));
    }
}