// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Receipt1155Enhanced
 * @dev Enhanced ERC-1155 contract for BlockReceipt.ai with role-based access control,
 * pausable functionality, and comprehensive receipt management features
 */
contract Receipt1155Enhanced is ERC1155, AccessControl, Pausable {
    using Strings for uint256;
    
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Token URI mapping
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bytes32) private _receiptHashes;
    
    // Passport stamp URI mapping
    mapping(uint256 => string) private _stampURIs;
    
    // Metadata encryption status mapping
    mapping(uint256 => bool) private _encryptedStatus;
    
    // Metadata access control policy ID mapping
    mapping(uint256 => string) private _policyIds;
    
    // Receipt revocation status mapping
    mapping(uint256 => bool) private _revokedStatus;
    
    // Receipt timestamp mapping
    mapping(uint256 => uint256) private _timestamps;
    
    // Receipt type mapping (standard, premium, luxury)
    mapping(uint256 => uint8) private _receiptTypes;
    
    // Base URI for OpenSea compatibility
    string private _baseContractURI;
    
    // Counter for auto-incrementing token IDs
    uint256 private _nextTokenId = 1;

    // Events
    event ReceiptMinted(uint256 indexed tokenId, address indexed to, bytes32 indexed receiptHash, uint8 receiptType);
    event ReceiptRevoked(uint256 indexed tokenId, address indexed revoker, string reason);
    event ReceiptBurned(uint256 indexed tokenId, address indexed burner);
    event BaseURISet(string newBaseURI);

    /**
     * @dev Constructor that sets up roles and initializes the contract
     * @param baseURI Initial base URI for token metadata
     */
    constructor(string memory baseURI) ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _baseContractURI = baseURI;
    }

    /**
     * @dev Modifier to check if a token exists
     */
    modifier tokenExists(uint256 tokenId) {
        require(bytes(_tokenURIs[tokenId]).length > 0, "Token does not exist");
        _;
    }

    /**
     * @dev Modifier to check if a token is not revoked
     */
    modifier notRevoked(uint256 tokenId) {
        require(!_revokedStatus[tokenId], "Receipt has been revoked");
        _;
    }

    /**
     * @dev Pause contract functionality
     * @notice Only callable by admin
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract functionality
     * @notice Only callable by admin
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Set the base contract URI for OpenSea compatibility
     * @param baseURI The base URI for contract metadata
     */
    function setContractURI(string calldata baseURI) external onlyRole(ADMIN_ROLE) {
        _baseContractURI = baseURI;
        emit BaseURISet(baseURI);
    }

    /**
     * @dev Get the contract URI for OpenSea compatibility
     * @return The contract URI
     */
    function contractURI() public view returns (string memory) {
        return _baseContractURI;
    }

    /**
     * @dev Mint a receipt NFT with a specific token ID
     * @param to Recipient address
     * @param tokenId Specific token ID to mint
     * @param receiptHash Hash of the receipt data for verification
     * @param uri_ Metadata URI for the token
     * @param stampUri_ Passport stamp URI for the token (optional)
     * @param receiptType Type of receipt (1=standard, 2=premium, 3=luxury)
     * @param encrypted Whether the metadata is encrypted
     * @param policyId The encryption policy ID (optional)
     */
    function mintReceipt(
        address to,
        uint256 tokenId,
        bytes32 receiptHash,
        string calldata uri_,
        string calldata stampUri_,
        uint8 receiptType,
        bool encrypted,
        string calldata policyId
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(bytes(_tokenURIs[tokenId]).length == 0, "Token already exists");
        require(receiptType >= 1 && receiptType <= 3, "Invalid receipt type");
        
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _stampURIs[tokenId] = stampUri_;
        _receiptTypes[tokenId] = receiptType;
        _encryptedStatus[tokenId] = encrypted;
        _policyIds[tokenId] = policyId;
        _timestamps[tokenId] = block.timestamp;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(tokenId, to, receiptHash, receiptType);
    }

    /**
     * @dev Mint new receipt with auto-incrementing ID
     * @param to Recipient address
     * @param receiptHash Hash of the receipt data for verification
     * @param uri_ Metadata URI for the token
     * @param stampUri_ Passport stamp URI for the token (optional)
     * @param receiptType Type of receipt (1=standard, 2=premium, 3=luxury)
     * @param encrypted Whether the metadata is encrypted
     * @param policyId The encryption policy ID (optional)
     * @return The newly minted token ID
     */
    function mintNewReceipt(
        address to,
        bytes32 receiptHash,
        string calldata uri_,
        string calldata stampUri_,
        uint8 receiptType,
        bool encrypted,
        string calldata policyId
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(receiptType >= 1 && receiptType <= 3, "Invalid receipt type");
        
        uint256 tokenId = _nextTokenId++;
        
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _stampURIs[tokenId] = stampUri_;
        _receiptTypes[tokenId] = receiptType;
        _encryptedStatus[tokenId] = encrypted;
        _policyIds[tokenId] = policyId;
        _timestamps[tokenId] = block.timestamp;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(tokenId, to, receiptHash, receiptType);
        
        return tokenId;
    }

    /**
     * @dev Revoke a receipt (mark as invalid but don't burn)
     * @param tokenId Token ID to revoke
     * @param reason Reason for revocation
     */
    function revokeReceipt(uint256 tokenId, string calldata reason) 
        external 
        onlyRole(ADMIN_ROLE) 
        tokenExists(tokenId) 
    {
        _revokedStatus[tokenId] = true;
        emit ReceiptRevoked(tokenId, msg.sender, reason);
    }

    /**
     * @dev Burn a receipt token
     * @param account Token holder address
     * @param tokenId Token ID to burn
     */
    function burnReceipt(address account, uint256 tokenId) 
        external 
        onlyRole(ADMIN_ROLE) 
        tokenExists(tokenId) 
    {
        require(balanceOf(account, tokenId) > 0, "Account does not own this token");
        
        _burn(account, tokenId, 1);
        
        // Clear metadata
        delete _tokenURIs[tokenId];
        delete _receiptHashes[tokenId];
        delete _stampURIs[tokenId];
        delete _receiptTypes[tokenId];
        delete _encryptedStatus[tokenId];
        delete _policyIds[tokenId];
        delete _timestamps[tokenId];
        delete _revokedStatus[tokenId];
        
        emit ReceiptBurned(tokenId, msg.sender);
    }

    /**
     * @dev Get token URI for a specific token
     * @param tokenId Token ID
     * @return Token URI
     */
    function uri(uint256 tokenId) public view override tokenExists(tokenId) returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Get receipt hash for verification
     * @param tokenId Token ID
     * @return Receipt hash
     */
    function getReceiptHash(uint256 tokenId) public view tokenExists(tokenId) returns (bytes32) {
        return _receiptHashes[tokenId];
    }

    /**
     * @dev Get passport stamp URI
     * @param tokenId Token ID
     * @return Stamp URI
     */
    function getStampURI(uint256 tokenId) public view tokenExists(tokenId) returns (string memory) {
        return _stampURIs[tokenId];
    }

    /**
     * @dev Check if receipt is revoked
     * @param tokenId Token ID
     * @return True if revoked
     */
    function isRevoked(uint256 tokenId) public view tokenExists(tokenId) returns (bool) {
        return _revokedStatus[tokenId];
    }

    /**
     * @dev Get receipt timestamp
     * @param tokenId Token ID
     * @return Timestamp
     */
    function getTimestamp(uint256 tokenId) public view tokenExists(tokenId) returns (uint256) {
        return _timestamps[tokenId];
    }

    /**
     * @dev Get receipt type
     * @param tokenId Token ID
     * @return Receipt type (1=standard, 2=premium, 3=luxury)
     */
    function getReceiptType(uint256 tokenId) public view tokenExists(tokenId) returns (uint8) {
        return _receiptTypes[tokenId];
    }

    /**
     * @dev Check if metadata is encrypted
     * @param tokenId Token ID
     * @return True if encrypted
     */
    function isEncrypted(uint256 tokenId) public view tokenExists(tokenId) returns (bool) {
        return _encryptedStatus[tokenId];
    }

    /**
     * @dev Get encryption policy ID
     * @param tokenId Token ID
     * @return Policy ID
     */
    function getPolicyId(uint256 tokenId) public view tokenExists(tokenId) returns (string memory) {
        return _policyIds[tokenId];
    }

    /**
     * @dev Get the next token ID that will be minted
     * @return Next token ID
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC1155, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}