// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BlockReceiptNFT
 * @dev ERC1155 contract for BlockReceipt digital receipts with consent-based data sharing
 */
contract BlockReceiptNFT is ERC1155, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Receipt metadata structure
    struct ReceiptData {
        string merchantName;
        uint256 totalAmount;
        uint256 timestamp;
        string encryptedData; // TACo encrypted receipt details
        address customerWallet;
        bool isShared; // Customer consent for brand access
    }
    
    // Mappings
    mapping(uint256 => ReceiptData) public receipts;
    mapping(address => bool) public authorizedMinters;
    mapping(address => uint256[]) public customerReceipts;
    mapping(uint256 => mapping(address => bool)) public brandAccess;
    
    // Events
    event ReceiptMinted(
        uint256 indexed tokenId,
        address indexed customer,
        string merchantName,
        uint256 amount
    );
    
    event ConsentGranted(
        uint256 indexed tokenId,
        address indexed brand,
        address indexed customer
    );
    
    event ConsentRevoked(
        uint256 indexed tokenId,
        address indexed brand,
        address indexed customer
    );
    
    constructor() ERC1155("https://api.blockreceipt.ai/metadata/{id}") {
        _tokenIdCounter.increment(); // Start at 1
    }
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    /**
     * @dev Mint a new receipt NFT
     */
    function mintReceipt(
        address customer,
        string memory merchantName,
        uint256 totalAmount,
        string memory encryptedData
    ) external onlyAuthorizedMinter nonReentrant returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        receipts[tokenId] = ReceiptData({
            merchantName: merchantName,
            totalAmount: totalAmount,
            timestamp: block.timestamp,
            encryptedData: encryptedData,
            customerWallet: customer,
            isShared: false
        });
        
        customerReceipts[customer].push(tokenId);
        
        _mint(customer, tokenId, 1, "");
        
        emit ReceiptMinted(tokenId, customer, merchantName, totalAmount);
        
        return tokenId;
    }
    
    /**
     * @dev Grant brand access to receipt data
     */
    function grantBrandAccess(uint256 tokenId, address brand) external {
        require(balanceOf(msg.sender, tokenId) > 0, "Not receipt owner");
        require(!brandAccess[tokenId][brand], "Access already granted");
        
        brandAccess[tokenId][brand] = true;
        receipts[tokenId].isShared = true;
        
        emit ConsentGranted(tokenId, brand, msg.sender);
    }
    
    /**
     * @dev Revoke brand access to receipt data
     */
    function revokeBrandAccess(uint256 tokenId, address brand) external {
        require(balanceOf(msg.sender, tokenId) > 0, "Not receipt owner");
        require(brandAccess[tokenId][brand], "Access not granted");
        
        brandAccess[tokenId][brand] = false;
        
        emit ConsentRevoked(tokenId, brand, msg.sender);
    }
    
    /**
     * @dev Get customer's receipt history
     */
    function getCustomerReceipts(address customer) external view returns (uint256[] memory) {
        return customerReceipts[customer];
    }
    
    /**
     * @dev Check if brand has access to receipt
     */
    function hasBrandAccess(uint256 tokenId, address brand) external view returns (bool) {
        return brandAccess[tokenId][brand];
    }
    
    /**
     * @dev Get receipt data (only for authorized parties)
     */
    function getReceiptData(uint256 tokenId) external view returns (ReceiptData memory) {
        require(
            balanceOf(msg.sender, tokenId) > 0 || 
            brandAccess[tokenId][msg.sender] ||
            msg.sender == owner(),
            "No access to receipt data"
        );
        
        return receipts[tokenId];
    }
    
    /**
     * @dev Add authorized minter
     */
    function addMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Remove authorized minter
     */
    function removeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }
    
    /**
     * @dev Get total supply of receipts
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }
    
    /**
     * @dev Override transfer functions to maintain receipt ownership integrity
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        // Update customer receipts mapping
        if (from != to) {
            _removeFromCustomerReceipts(from, id);
            customerReceipts[to].push(id);
            receipts[id].customerWallet = to;
        }
        
        super.safeTransferFrom(from, to, id, amount, data);
    }
    
    function _removeFromCustomerReceipts(address customer, uint256 tokenId) internal {
        uint256[] storage customerTokens = customerReceipts[customer];
        for (uint256 i = 0; i < customerTokens.length; i++) {
            if (customerTokens[i] == tokenId) {
                customerTokens[i] = customerTokens[customerTokens.length - 1];
                customerTokens.pop();
                break;
            }
        }
    }
}