// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Receipt1155 is ERC1155, Ownable {
    using Strings for uint256;
    
    // Mapping from token ID to receipt hash
    mapping(uint256 => bytes32) private _receiptHashes;
    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner) 
        ERC1155("") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Mints a new receipt token.
     * @param to The address that will receive the minted token
     * @param tokenId The token ID
     * @param receiptHash The hash of the receipt data
     * @param uri_ The URI for the token metadata
     */
    function mintReceipt(
        address to,
        uint256 tokenId,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner {
        require(_receiptHashes[tokenId] == bytes32(0), "Receipt already exists");
        
        _receiptHashes[tokenId] = receiptHash;
        _tokenURIs[tokenId] = uri_;
        _mint(to, tokenId, 1, "");
    }

    /**
     * @dev Returns the URI for a given token ID.
     * @param tokenId The token ID
     * @return The URI for the token metadata
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Verifies if a receipt hash matches the stored hash.
     * @param tokenId The token ID
     * @param hash The hash to verify
     * @return Whether the hash matches
     */
    function verifyReceiptHash(uint256 tokenId, bytes32 hash) external view returns (bool) {
        require(_exists(tokenId), "Receipt does not exist");
        return _receiptHashes[tokenId] == hash;
    }

    /**
     * @dev Gets the receipt hash for a token ID.
     * @param tokenId The token ID
     * @return The receipt hash
     */
    function getReceiptHash(uint256 tokenId) external view returns (bytes32) {
        require(_exists(tokenId), "Receipt does not exist");
        return _receiptHashes[tokenId];
    }

    /**
     * @dev Checks if a token ID exists.
     * @param tokenId The token ID
     * @return Whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _receiptHashes[tokenId] != bytes32(0);
    }
}