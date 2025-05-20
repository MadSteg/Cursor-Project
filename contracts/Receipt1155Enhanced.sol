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
    
    // Receipt hash mapping
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
    
    // Next token ID counter
    uint256 private _nextTokenId = 1;
    
    // Events
    event ReceiptMinted(address indexed to, uint256 indexed tokenId, bytes32 receiptHash, string uri, string stampUri, uint8 receiptType);
    event ReceiptRevoked(uint256 indexed tokenId, string reason);
    event ReceiptBurned(uint256 indexed tokenId, address indexed burner);
    event StampUpdated(uint256 indexed tokenId, string stampUri);
    event EncryptionStatusSet(uint256 indexed tokenId, bool encrypted);
    event PolicyIdSet(uint256 indexed tokenId, string policyId);
    event BaseURISet(string baseURI);

    /**
     * @dev Receipt types
     */
    uint8 public constant RECEIPT_TYPE_STANDARD = 1;
    uint8 public constant RECEIPT_TYPE_PREMIUM = 2;
    uint8 public constant RECEIPT_TYPE_LUXURY = 3;

    /**
     * @dev Constructor initializes the contract with roles
     * @param initialAdmin The initial admin address
     */
    constructor(address initialAdmin) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
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
    ) external whenNotPaused onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        require(receiptType >= RECEIPT_TYPE_STANDARD && receiptType <= RECEIPT_TYPE_LUXURY, "Invalid receipt type");
        
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _stampURIs[tokenId] = stampUri_;
        _encryptedStatus[tokenId] = encrypted;
        _policyIds[tokenId] = policyId;
        _receiptTypes[tokenId] = receiptType;
        _timestamps[tokenId] = block.timestamp;
        _revokedStatus[tokenId] = false;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(to, tokenId, receiptHash, uri_, stampUri_, receiptType);
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
     * @param receiptType Type of receipt (1=standard, 2=premium, 3=luxury)
     * @param encrypted Whether the metadata is encrypted
     * @param policyId The encryption policy ID (optional)
     * @return The new token ID
     */
    function mintNewReceipt(
        address to,
        bytes32 receiptHash,
        string calldata uri_,
        string calldata stampUri_,
        uint8 receiptType,
        bool encrypted,
        string calldata policyId
    ) external whenNotPaused onlyRole(MINTER_ROLE) returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(receiptType >= RECEIPT_TYPE_STANDARD && receiptType <= RECEIPT_TYPE_LUXURY, "Invalid receipt type");
        
        uint256 tokenId = _nextTokenId++;
        
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _stampURIs[tokenId] = stampUri_;
        _encryptedStatus[tokenId] = encrypted;
        _policyIds[tokenId] = policyId;
        _receiptTypes[tokenId] = receiptType;
        _timestamps[tokenId] = block.timestamp;
        _revokedStatus[tokenId] = false;
        
        _mint(to, tokenId, 1, "");
        
        emit ReceiptMinted(to, tokenId, receiptHash, uri_, stampUri_, receiptType);
        emit EncryptionStatusSet(tokenId, encrypted);
        
        if (bytes(policyId).length > 0) {
            emit PolicyIdSet(tokenId, policyId);
        }
        
        return tokenId;
    }

    /**
     * @dev Batch mint multiple receipts at once for gas efficiency
     * @param to Recipient address
     * @param receiptHashes Array of receipt hashes
     * @param uris Array of metadata URIs
     * @param stampUris Array of passport stamp URIs
     * @param receiptTypes Array of receipt types
     * @param encryptedFlags Array of encryption status flags
     * @param policyIds Array of policy IDs
     * @return Array of minted token IDs
     */
    function batchMintReceipts(
        address to,
        bytes32[] calldata receiptHashes,
        string[] calldata uris,
        string[] calldata stampUris,
        uint8[] calldata receiptTypes,
        bool[] calldata encryptedFlags,
        string[] calldata policyIds
    ) external whenNotPaused onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        require(to != address(0), "Cannot mint to zero address");
        require(
            receiptHashes.length == uris.length &&
            uris.length == stampUris.length &&
            stampUris.length == receiptTypes.length &&
            receiptTypes.length == encryptedFlags.length &&
            encryptedFlags.length == policyIds.length,
            "Array length mismatch"
        );
        
        uint256[] memory tokenIds = new uint256[](receiptHashes.length);
        
        for (uint256 i = 0; i < receiptHashes.length; i++) {
            require(receiptTypes[i] >= RECEIPT_TYPE_STANDARD && receiptTypes[i] <= RECEIPT_TYPE_LUXURY, "Invalid receipt type");
            
            uint256 tokenId = _nextTokenId++;
            tokenIds[i] = tokenId;
            
            _tokenURIs[tokenId] = uris[i];
            _receiptHashes[tokenId] = receiptHashes[i];
            _stampURIs[tokenId] = stampUris[i];
            _encryptedStatus[tokenId] = encryptedFlags[i];
            _policyIds[tokenId] = policyIds[i];
            _receiptTypes[tokenId] = receiptTypes[i];
            _timestamps[tokenId] = block.timestamp;
            _revokedStatus[tokenId] = false;
            
            emit ReceiptMinted(to, tokenId, receiptHashes[i], uris[i], stampUris[i], receiptTypes[i]);
            emit EncryptionStatusSet(tokenId, encryptedFlags[i]);
            
            if (bytes(policyIds[i]).length > 0) {
                emit PolicyIdSet(tokenId, policyIds[i]);
            }
        }
        
        _mintBatch(to, tokenIds, _createOnesArray(tokenIds.length), "");
        
        return tokenIds;
    }

    /**
     * @dev Helper function to create an array of ones for batch minting
     */
    function _createOnesArray(uint256 length) private pure returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            amounts[i] = 1;
        }
        return amounts;
    }

    /**
     * @dev Revoke a receipt NFT (mark as invalid)
     * @param tokenId The token ID to revoke
     * @param reason The reason for revocation
     */
    function revokeReceipt(uint256 tokenId, string calldata reason) 
        external 
        onlyRole(ADMIN_ROLE) 
        tokenExists(tokenId) 
    {
        require(!_revokedStatus[tokenId], "Receipt already revoked");
        _revokedStatus[tokenId] = true;
        emit ReceiptRevoked(tokenId, reason);
    }

    /**
     * @dev Burn a receipt NFT (permanent removal)
     * @param tokenId The token ID to burn
     */
    function burnReceipt(uint256 tokenId) 
        external 
        tokenExists(tokenId) 
    {
        require(
            hasRole(ADMIN_ROLE, _msgSender()) || 
            balanceOf(_msgSender(), tokenId) > 0, 
            "Caller must be admin or token owner"
        );
        
        _burn(_msgSender(), tokenId, 1);
        emit ReceiptBurned(tokenId, _msgSender());
    }

    /**
     * @dev Update the passport stamp URI for a token
     * @param tokenId The token ID to update
     * @param stampUri_ The new passport stamp URI
     */
    function updateStampUri(uint256 tokenId, string calldata stampUri_) 
        external 
        onlyRole(MINTER_ROLE) 
        tokenExists(tokenId) 
        notRevoked(tokenId) 
    {
        _stampURIs[tokenId] = stampUri_;
        emit StampUpdated(tokenId, stampUri_);
    }

    /**
     * @dev Update the encryption policy ID for a token
     * @param tokenId The token ID to update
     * @param policyId The new encryption policy ID
     */
    function updatePolicyId(uint256 tokenId, string calldata policyId) 
        external 
        onlyRole(ADMIN_ROLE) 
        tokenExists(tokenId) 
        notRevoked(tokenId) 
    {
        _policyIds[tokenId] = policyId;
        emit PolicyIdSet(tokenId, policyId);
    }

    /**
     * @dev Set the encryption status for a token
     * @param tokenId The token ID to update
     * @param encrypted The new encryption status
     */
    function setEncryptionStatus(uint256 tokenId, bool encrypted) 
        external 
        onlyRole(ADMIN_ROLE) 
        tokenExists(tokenId) 
        notRevoked(tokenId) 
    {
        _encryptedStatus[tokenId] = encrypted;
        emit EncryptionStatusSet(tokenId, encrypted);
    }

    /**
     * @dev Get token URI
     * @param tokenId The token ID to query
     * @return The token's metadata URI
     */
    function uri(uint256 tokenId) public view override tokenExists(tokenId) returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Get passport stamp URI
     * @param tokenId The token ID to query
     * @return The token's passport stamp URI
     */
    function stampUri(uint256 tokenId) public view tokenExists(tokenId) returns (string memory) {
        return _stampURIs[tokenId];
    }

    /**
     * @dev Get receipt hash
     * @param tokenId The token ID to query
     * @return The token's receipt hash
     */
    function getReceiptHash(uint256 tokenId) public view tokenExists(tokenId) returns (bytes32) {
        return _receiptHashes[tokenId];
    }

    /**
     * @dev Verify a receipt hash
     * @param tokenId The token ID to verify
     * @param hash The hash to verify against
     * @return Whether the hash matches the stored hash
     */
    function verifyReceiptHash(uint256 tokenId, bytes32 hash) public view tokenExists(tokenId) returns (bool) {
        return _receiptHashes[tokenId] == hash;
    }

    /**
     * @dev Check if a receipt is revoked
     * @param tokenId The token ID to check
     * @return Whether the receipt is revoked
     */
    function isRevoked(uint256 tokenId) public view tokenExists(tokenId) returns (bool) {
        return _revokedStatus[tokenId];
    }

    /**
     * @dev Get receipt timestamp
     * @param tokenId The token ID to query
     * @return The token's creation timestamp
     */
    function getTimestamp(uint256 tokenId) public view tokenExists(tokenId) returns (uint256) {
        return _timestamps[tokenId];
    }

    /**
     * @dev Get receipt type
     * @param tokenId The token ID to query
     * @return The token's receipt type
     */
    function getReceiptType(uint256 tokenId) public view tokenExists(tokenId) returns (uint8) {
        return _receiptTypes[tokenId];
    }

    /**
     * @dev Get encryption status
     * @param tokenId The token ID to query
     * @return Whether the token's metadata is encrypted
     */
    function isEncrypted(uint256 tokenId) public view tokenExists(tokenId) returns (bool) {
        return _encryptedStatus[tokenId];
    }

    /**
     * @dev Get policy ID
     * @param tokenId The token ID to query
     * @return The token's encryption policy ID
     */
    function getPolicyId(uint256 tokenId) public view tokenExists(tokenId) returns (string memory) {
        return _policyIds[tokenId];
    }

    /**
     * @dev Get full token data for frontend display
     * @param tokenId The token ID to query
     * @return Token URI, stamp URI, receipt type, encrypted status, policy ID, revoked status, and timestamp
     */
    function getTokenData(uint256 tokenId) public view tokenExists(tokenId) returns (
        string memory tokenUri,
        string memory stampUri_,
        uint8 receiptType,
        bool encrypted,
        string memory policyId,
        bool revoked,
        uint256 timestamp
    ) {
        return (
            _tokenURIs[tokenId],
            _stampURIs[tokenId],
            _receiptTypes[tokenId],
            _encryptedStatus[tokenId],
            _policyIds[tokenId],
            _revokedStatus[tokenId],
            _timestamps[tokenId]
        );
    }

    /**
     * @dev Override for ERC1155 _beforeTokenTransfer with pausable functionality
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
     * @dev Override supportsInterface to include AccessControl and ERC1155
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
