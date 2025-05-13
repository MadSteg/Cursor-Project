// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ReceiptNFT
 * @dev This contract implements an ERC1155 NFT for digital receipts.
 * Each receipt is a unique token with encrypted data stored on-chain.
 */
contract ReceiptNFT is ERC1155, Ownable, ERC1155Supply {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to receipt data
    mapping(uint256 => string) private _receiptData;
    
    // Mapping from token ID to metadata
    mapping(uint256 => TokenMetadata) private _tokenMetadata;
    
    // Mapping from address to their tokens
    mapping(address => uint256[]) private _userTokens;
    
    struct TokenMetadata {
        uint256 mintTimestamp;
        address minter;
        string encryptedData;
    }
    
    event ReceiptMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 timestamp
    );

    constructor() ERC1155("ipfs://QmRoF8Hgje8Z9SZbZgS2jZfVzWLSLMKDnPuDpkYSLVpWjU/{id}") {
        // Starting at token ID 1 (rather than 0)
        _tokenIdCounter.increment();
    }

    /**
     * @dev Mints a new receipt NFT.
     * @param to The address that will own the minted NFT
     * @param encryptedData The encrypted receipt data
     * @return The ID of the newly minted token
     */
    function mint(address to, string memory encryptedData) 
        external 
        onlyOwner 
        returns (uint256) 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _mint(to, tokenId, 1, "");
        
        // Store receipt data and metadata
        _receiptData[tokenId] = encryptedData;
        _tokenMetadata[tokenId] = TokenMetadata({
            mintTimestamp: block.timestamp,
            minter: to,
            encryptedData: encryptedData
        });
        
        // Add to user tokens
        _userTokens[to].push(tokenId);
        
        emit ReceiptMinted(to, tokenId, block.timestamp);
        
        return tokenId;
    }
    
    /**
     * @dev Returns the receipt data for a specific token
     * @param tokenId The ID of the token to query
     * @return The receipt data
     */
    function getReceiptData(uint256 tokenId) 
        external 
        view 
        returns (string memory) 
    {
        require(exists(tokenId), "ReceiptNFT: Query for nonexistent token");
        return _receiptData[tokenId];
    }
    
    /**
     * @dev Returns metadata about a token
     * @param tokenId The ID of the token to query
     * @return mintTimestamp The timestamp when the token was minted
     * @return minter The address that minted the token
     * @return encryptedData The encrypted receipt data
     */
    function getTokenMetadata(uint256 tokenId) 
        external 
        view 
        returns (uint256 mintTimestamp, address minter, string memory encryptedData) 
    {
        require(exists(tokenId), "ReceiptNFT: Query for nonexistent token");
        TokenMetadata memory metadata = _tokenMetadata[tokenId];
        return (metadata.mintTimestamp, metadata.minter, metadata.encryptedData);
    }
    
    /**
     * @dev Returns all tokens owned by an address
     * @param addr The owner address to query
     * @return Array of token IDs owned by the address
     */
    function getTokensForAddress(address addr) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return _userTokens[addr];
    }
    
    /**
     * @dev See {ERC1155-_beforeTokenTransfer}.
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