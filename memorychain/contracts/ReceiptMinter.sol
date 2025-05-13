// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ReceiptMinter
 * @dev ERC1155 token contract for minting digital receipts as NFTs
 */
contract ReceiptMinter is ERC1155, AccessControl {
    using Counters for Counters.Counter;
    
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Counter for token IDs
    Counters.Counter private _tokenIdCounter;
    
    // Receipt data structure
    struct ReceiptData {
        bytes32 truncatedPanHash;   // first 6 + last 4 of card, sha-256 hashed
        bytes32 metadataCid;        // IPFS CID of the encrypted JSON blob
        address recipient;          // Address of the receipt recipient
        uint256 timestamp;          // Timestamp when receipt was minted
    }
    
    // Mapping from token ID to receipt data
    mapping(uint256 => ReceiptData) private _receipts;
    
    // Event emitted when a new receipt is minted
    event ReceiptMinted(uint256 indexed id, address indexed to, bytes32 cid);
    
    /**
     * @dev Constructor
     * @param uri_ Base URI for token metadata
     */
    constructor(string memory uri_) ERC1155(uri_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint a new receipt token
     * @param to Recipient address
     * @param panHash Hashed truncated PAN (first 6 + last 4 digits)
     * @param cid IPFS CID of the encrypted receipt data
     * @return tokenId The ID of the newly minted token
     */
    function mintReceipt(
        address to,
        bytes32 panHash,
        bytes32 cid
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        // Increment and get the new token ID
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Store receipt data
        _receipts[tokenId] = ReceiptData({
            truncatedPanHash: panHash,
            metadataCid: cid,
            recipient: to,
            timestamp: block.timestamp
        });
        
        // Mint the token to the recipient (always mint 1 as it's a unique receipt)
        _mint(to, tokenId, 1, "");
        
        // Emit event
        emit ReceiptMinted(tokenId, to, cid);
        
        return tokenId;
    }
    
    /**
     * @dev Get receipt data for a specific token ID
     * @param id Token ID
     * @return Receipt data (truncatedPanHash, metadataCid)
     */
    function getReceiptData(uint256 id) external view returns (bytes32, bytes32) {
        require(_exists(id), "ReceiptMinter: Receipt does not exist");
        ReceiptData memory receipt = _receipts[id];
        return (receipt.truncatedPanHash, receipt.metadataCid);
    }
    
    /**
     * @dev Get full receipt data for a specific token ID
     * @param id Token ID
     * @return Full receipt data structure
     */
    function getFullReceiptData(uint256 id) external view returns (ReceiptData memory) {
        require(_exists(id), "ReceiptMinter: Receipt does not exist");
        return _receipts[id];
    }
    
    /**
     * @dev Check if a token exists
     * @param id Token ID
     * @return bool True if the token exists
     */
    function _exists(uint256 id) internal view returns (bool) {
        return _receipts[id].recipient != address(0);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}