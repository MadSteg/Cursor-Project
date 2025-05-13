// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ReceiptNFT
 * @dev ERC1155 contract for storing encrypted receipt data on-chain
 */
contract ReceiptNFT is ERC1155, Ownable, ERC1155Supply {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Struct to store receipt metadata
    struct ReceiptMetadata {
        string cid;           // IPFS Content ID or other identifier for encrypted receipt data
        string merchantName;  // Name of the merchant (plaintext)
        uint256 timestamp;    // Timestamp of the transaction
        uint256 totalAmount;  // Total amount of the transaction (stored in pennies/cents)
        address minter;       // Address of the minter
    }
    
    // Maps tokenId to metadata
    mapping(uint256 => ReceiptMetadata) private _receiptMetadata;
    
    // Event emitted when a new receipt is minted
    event ReceiptMinted(
        uint256 indexed tokenId,
        string cid,
        string merchantName,
        uint256 timestamp,
        uint256 totalAmount,
        address indexed minter
    );

    constructor() ERC1155("") {
        // URI will be set per token
    }
    
    /**
     * @dev Mints a new receipt NFT
     * @param to Address to mint the receipt to
     * @param cid Content identifier for the encrypted receipt data
     * @param merchantName Name of the merchant
     * @param timestamp Timestamp of the transaction
     * @param totalAmount Total amount of the transaction (in pennies/cents)
     * @param uri URI for the token metadata
     * @return The new token ID
     */
    function mintReceipt(
        address to,
        string memory cid,
        string memory merchantName,
        uint256 timestamp,
        uint256 totalAmount,
        string memory uri
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(to, newItemId, 1, "");
        
        // Store receipt metadata
        _receiptMetadata[newItemId] = ReceiptMetadata({
            cid: cid,
            merchantName: merchantName,
            timestamp: timestamp,
            totalAmount: totalAmount,
            minter: msg.sender
        });
        
        // Set URI for this token
        _setURI(newItemId, uri);
        
        // Emit event
        emit ReceiptMinted(
            newItemId,
            cid,
            merchantName,
            timestamp,
            totalAmount,
            msg.sender
        );
        
        return newItemId;
    }
    
    /**
     * @dev Get receipt metadata for a token
     * @param tokenId The token ID
     * @return The receipt metadata
     */
    function getReceiptMetadata(uint256 tokenId) public view returns (
        string memory cid,
        string memory merchantName,
        uint256 timestamp,
        uint256 totalAmount,
        address minter
    ) {
        require(exists(tokenId), "ReceiptNFT: Receipt query for nonexistent token");
        
        ReceiptMetadata memory metadata = _receiptMetadata[tokenId];
        return (
            metadata.cid,
            metadata.merchantName,
            metadata.timestamp,
            metadata.totalAmount,
            metadata.minter
        );
    }

    /**
     * @dev Sets the URI for a specific token ID
     * @param tokenId The token ID
     * @param newuri The new URI
     */
    function setURI(uint256 tokenId, string memory newuri) public onlyOwner {
        require(exists(tokenId), "ReceiptNFT: URI set of nonexistent token");
        _setURI(tokenId, newuri);
    }

    /**
     * @dev Sets the token URI for a token ID
     */
    function _setURI(uint256 tokenId, string memory newuri) internal virtual {
        // This stores the token URI in contract storage
        _receiptMetadata[tokenId].cid = newuri;
    }

    /**
     * @dev Get the URI for a token ID
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(exists(tokenId), "ReceiptNFT: URI query for nonexistent token");
        return _receiptMetadata[tokenId].cid;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}