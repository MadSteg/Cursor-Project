// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LoyaltyCard - Universal BlockReceipt Loyalty System
 * @notice One loyalty card NFT per user that works across all participating merchants
 * @dev Stamps accumulate from purchases at any participating merchant
 */
contract LoyaltyCard is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public nextTokenId;
    
    // Core loyalty tracking
    mapping(uint256 => uint256) public stampCount;
    mapping(uint256 => mapping(address => uint256)) public merchantStamps; // cardId => merchant => stamps
    
    // User management
    mapping(address => uint256) public userToCard; // user => cardId
    mapping(uint256 => address) public cardToUser; // cardId => user
    
    // Merchant management
    mapping(address => bool) public authorizedMerchants;
    mapping(address => string) public merchantNames;
    mapping(address => uint256) public merchantRedemptionThreshold; // stamps needed for reward
    
    // Events
    event CardMinted(address indexed user, uint256 cardId, string uri);
    event StampIncremented(uint256 indexed cardId, address indexed merchant, uint256 amount, uint256 newTotal);
    event RewardRedeemed(uint256 indexed cardId, address indexed merchant, uint256 stampsUsed);
    event MerchantAuthorized(address indexed merchant, string name, uint256 redemptionThreshold);
    
    constructor() ERC721("BlockReceipt Loyalty Card", "BRCARD") {}
    
    /**
     * @notice Mint a new universal loyalty card for a user
     * @param to User address to receive the card
     * @param uri Initial metadata URI for the card
     * @return tokenId The ID of the newly minted card
     */
    function mintCard(address to, string memory uri) external onlyOwner returns (uint256) {
        require(userToCard[to] == 0, "User already has a loyalty card");
        
        uint256 tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        userToCard[to] = tokenId;
        cardToUser[tokenId] = to;
        
        emit CardMinted(to, tokenId, uri);
        return tokenId;
    }
    
    /**
     * @notice Add stamps to a user's loyalty card from a merchant purchase
     * @param userAddress The user who made the purchase
     * @param merchant The merchant address awarding the stamps
     * @param amount Number of stamps to add
     */
    function incrementStamps(
        address userAddress, 
        address merchant, 
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(authorizedMerchants[merchant], "Merchant not authorized");
        require(amount > 0, "Amount must be positive");
        
        uint256 cardId = userToCard[userAddress];
        require(cardId > 0, "User has no loyalty card");
        
        stampCount[cardId] += amount;
        merchantStamps[cardId][merchant] += amount;
        
        emit StampIncremented(cardId, merchant, amount, stampCount[cardId]);
    }
    
    /**
     * @notice Redeem stamps for a reward from a specific merchant
     * @param userAddress The user redeeming the reward
     * @param merchant The merchant providing the reward
     */
    function redeemReward(
        address userAddress,
        address merchant
    ) external onlyOwner nonReentrant {
        require(authorizedMerchants[merchant], "Merchant not authorized");
        
        uint256 cardId = userToCard[userAddress];
        require(cardId > 0, "User has no loyalty card");
        
        uint256 requiredStamps = merchantRedemptionThreshold[merchant];
        require(requiredStamps > 0, "Merchant redemption not configured");
        require(stampCount[cardId] >= requiredStamps, "Insufficient stamps");
        
        stampCount[cardId] -= requiredStamps;
        
        emit RewardRedeemed(cardId, merchant, requiredStamps);
    }
    
    /**
     * @notice Authorize a merchant to participate in the loyalty program
     * @param merchant Merchant address
     * @param name Merchant display name
     * @param redemptionThreshold Number of stamps needed for a reward
     */
    function authorizeMerchant(
        address merchant,
        string memory name,
        uint256 redemptionThreshold
    ) external onlyOwner {
        authorizedMerchants[merchant] = true;
        merchantNames[merchant] = name;
        merchantRedemptionThreshold[merchant] = redemptionThreshold;
        
        emit MerchantAuthorized(merchant, name, redemptionThreshold);
    }
    
    /**
     * @notice Update the metadata URI for a loyalty card
     * @param cardId The card to update
     * @param newUri New metadata URI
     */
    function updateTokenURI(uint256 cardId, string memory newUri) external onlyOwner {
        require(_exists(cardId), "Card does not exist");
        _setTokenURI(cardId, newUri);
    }
    
    /**
     * @notice Get a user's loyalty card ID
     * @param user User address
     * @return cardId The user's card ID (0 if no card)
     */
    function getUserCard(address user) external view returns (uint256) {
        return userToCard[user];
    }
    
    /**
     * @notice Get stamp counts for a card across all merchants
     * @param cardId The loyalty card ID
     * @return totalStamps Total stamps across all merchants
     */
    function getCardStamps(uint256 cardId) external view returns (uint256 totalStamps) {
        return stampCount[cardId];
    }
    
    /**
     * @notice Get stamp count from a specific merchant for a card
     * @param cardId The loyalty card ID
     * @param merchant The merchant address
     * @return stamps Number of stamps from this merchant
     */
    function getMerchantStamps(uint256 cardId, address merchant) external view returns (uint256) {
        return merchantStamps[cardId][merchant];
    }
    
    /**
     * @notice Check if user can redeem a reward from a merchant
     * @param userAddress User address
     * @param merchant Merchant address
     * @return canRedeem Whether user has enough stamps
     * @return currentStamps User's current stamp count
     * @return requiredStamps Stamps needed for reward
     */
    function canUserRedeem(
        address userAddress,
        address merchant
    ) external view returns (bool canRedeem, uint256 currentStamps, uint256 requiredStamps) {
        uint256 cardId = userToCard[userAddress];
        if (cardId == 0) return (false, 0, 0);
        
        currentStamps = stampCount[cardId];
        requiredStamps = merchantRedemptionThreshold[merchant];
        canRedeem = currentStamps >= requiredStamps && requiredStamps > 0;
    }
}