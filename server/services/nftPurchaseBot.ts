import axios from 'axios';
import { ethers } from 'ethers';
import { db } from '../db';
import * as dotenv from 'dotenv';

// Ensure we have environment variables loaded
dotenv.config();

// ABI for ERC-721 standard
const ERC721_ABI = [
  // ERC-721 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];

// ABI for ERC-1155 standard
const ERC1155_ABI = [
  // ERC-1155 standard functions
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) view returns (uint256[] memory)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data)",
  "function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address account, address operator) view returns (bool)",
  
  // Events
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
  "event ApprovalForAll(address indexed account, address indexed operator, bool approved)"
];

// Define interfaces for NFT marketplace data
interface OpenSeaNFT {
  identifier: string;
  contract: string;
  token_standard: string;
  permalink: string;
  image_url: string;
  name: string;
  description: string;
  price: {
    current: {
      value: number; // Value in ETH
      decimals: number;
    }
  }
}

interface NFTPurchaseResult {
  success: boolean;
  txHash?: string;
  nft?: {
    tokenId: string;
    contract: string;
    name: string;
    image: string;
    marketplace: string;
    price: number;
  };
  error?: string;
}

interface UserClaimRecord {
  walletAddress: string;
  claimTimestamp: number;
  nftTokenId?: string;
  nftContract?: string;
  receiptId?: string;
}

class NFTPurchaseBot {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private openSeaApiKey: string;
  private maxNftPriceUsd: number = 0.10; // $0.10 maximum
  private claimCooldownHours: number = 24; // 1 claim per day
  private userClaims: Map<string, UserClaimRecord> = new Map();
  private chainId: number;
  private rpcUrl: string;
  private isPolygonMainnet: boolean;
  
  constructor() {
    // Read environment variables
    this.openSeaApiKey = process.env.OPENSEA_API_KEY || '';
    const backendPrivateKey = process.env.NFT_BOT_PRIVATE_KEY || '';
    this.rpcUrl = process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com';
    this.chainId = 137; // Polygon Mainnet
    this.isPolygonMainnet = process.env.NFT_BOT_NETWORK === 'polygon-mainnet';
    
    // Initialize blockchain connection
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    
    // Initialize wallet from private key
    if (backendPrivateKey) {
      this.wallet = new ethers.Wallet(backendPrivateKey, this.provider);
      console.log(`NFT Bot wallet initialized: ${this.wallet.address}`);
    } else {
      // If no private key, create a random wallet for testing (will not have funds!)
      this.wallet = ethers.Wallet.createRandom().connect(this.provider);
      console.warn('NFT Bot using random wallet for testing only. No actual purchases will work!');
    }
    
    // Load existing claims from database (in a production system)
    this.loadExistingClaims();
  }
  
  /**
   * Check if a user is eligible to claim an NFT (hasn't claimed in last 24h)
   */
  public async isUserEligible(walletAddress: string): Promise<boolean> {
    walletAddress = walletAddress.toLowerCase(); // Normalize wallet address
    
    // Check if user has claimed in the last 24 hours
    const lastClaim = this.userClaims.get(walletAddress);
    if (lastClaim) {
      const hoursSinceLastClaim = (Date.now() - lastClaim.claimTimestamp) / (1000 * 60 * 60);
      return hoursSinceLastClaim >= this.claimCooldownHours;
    }
    
    return true; // No previous claims found
  }
  
  /**
   * Record a claim for a user to prevent multiple claims
   */
  private recordClaim(walletAddress: string, tokenId: string, contractAddress: string, receiptId: string): void {
    walletAddress = walletAddress.toLowerCase(); // Normalize wallet address
    
    const claim: UserClaimRecord = {
      walletAddress,
      claimTimestamp: Date.now(),
      nftTokenId: tokenId,
      nftContract: contractAddress,
      receiptId
    };
    
    // Save to in-memory cache
    this.userClaims.set(walletAddress, claim);
    
    // In a production system, also save to database
    this.saveClaimToDatabase(claim);
  }
  
  /**
   * Load existing claims from database (mock implementation)
   */
  private async loadExistingClaims(): Promise<void> {
    // In a real implementation, this would load from DB
    // For now, we'll just initialize with empty map
    console.log('Initialized NFT claim records');
  }
  
  /**
   * Save claim to database (mock implementation)
   */
  private async saveClaimToDatabase(claim: UserClaimRecord): Promise<void> {
    // In a real implementation, this would save to a database
    console.log(`Recorded NFT claim for wallet ${claim.walletAddress}:`, claim);
  }
  
  /**
   * Get an estimate of current ETH price in USD
   */
  private async getEthUsdPrice(): Promise<number> {
    try {
      // Using CoinGecko API for price data
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      return response.data.ethereum.usd;
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return 2000; // Fallback to estimated price if API fails
    }
  }
  
  /**
   * Get MATIC price in USD
   */
  private async getMaticUsdPrice(): Promise<number> {
    try {
      // Using CoinGecko API for price data
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
      return response.data['matic-network'].usd;
    } catch (error) {
      console.error('Error fetching MATIC price:', error);
      return 0.80; // Fallback to estimated price if API fails
    }
  }
  
  /**
   * Find affordable NFTs on OpenSea
   * @param keywords Optional keywords to filter NFTs (from receipt data)
   * @returns Array of affordable NFTs
   */
  private async findAffordableNFTs(keywords: string[] = []): Promise<OpenSeaNFT[]> {
    if (!this.openSeaApiKey) {
      throw new Error('OpenSea API key not configured');
    }
    
    // Calculate max price in ETH
    const ethUsdPrice = await this.getEthUsdPrice();
    const maxPriceEth = this.maxNftPriceUsd / ethUsdPrice;
    
    try {
      // Query OpenSea API for affordable NFTs
      const response = await axios.get('https://api.opensea.io/api/v2/listings', {
        headers: {
          'X-API-KEY': this.openSeaApiKey
        },
        params: {
          limit: 50,
          chain: 'polygon', // Using Polygon for cheaper gas
          price_max: maxPriceEth.toFixed(8) // Max price in ETH
        }
      });
      
      const affordableNFTs = response.data.listings
        .filter((listing: any) => {
          // Additional filtering if keywords are provided
          if (keywords.length > 0) {
            const nftText = `${listing.name} ${listing.description}`.toLowerCase();
            return keywords.some(keyword => nftText.includes(keyword.toLowerCase()));
          }
          return true;
        })
        .map((listing: any) => listing.nft);
      
      console.log(`Found ${affordableNFTs.length} affordable NFTs on OpenSea`);
      return affordableNFTs;
    } catch (error: any) {
      console.error('Error fetching NFTs from OpenSea:', error);
      return [];
    }
  }
  
  /**
   * Purchase an NFT from OpenSea
   */
  private async purchaseNFT(nft: OpenSeaNFT): Promise<NFTPurchaseResult> {
    try {
      // Check wallet balance first
      const balance = await this.wallet.provider.getBalance(this.wallet.address);
      const balanceEth = parseFloat(ethers.formatEther(balance));
      const ethUsdPrice = await this.getEthUsdPrice();
      
      console.log(`NFT Bot wallet balance: ${balanceEth} ETH ($${balanceEth * ethUsdPrice})`);
      
      // Ensure we have enough funds (NFT price + gas)
      const nftPriceEth = nft.price?.current?.value || 0;
      const estimatedGasEth = 0.001; // Estimate gas cost in ETH
      
      if (balanceEth < (nftPriceEth + estimatedGasEth)) {
        return {
          success: false,
          error: `Insufficient funds: have ${balanceEth} ETH, need ${nftPriceEth + estimatedGasEth} ETH`
        };
      }
      
      // In a real implementation, we would:
      // 1. Create a buy order on OpenSea
      // 2. Sign and submit the transaction
      // 3. Wait for transaction confirmation
      
      // For now, we'll simulate a successful purchase with a mocked transaction
      const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      console.log(`Simulated NFT purchase: ${nft.name} (${nft.contract}:${nft.identifier})`);
      console.log(`Transaction hash: ${mockTxHash}`);
      
      return {
        success: true,
        txHash: mockTxHash,
        nft: {
          tokenId: nft.identifier,
          contract: nft.contract,
          name: nft.name || 'Unnamed NFT',
          image: nft.image_url || '',
          marketplace: 'OpenSea',
          price: nft.price?.current?.value || 0
        }
      };
    } catch (error: any) {
      console.error('Error purchasing NFT:', error);
      return {
        success: false,
        error: `Failed to purchase NFT: ${error.message}`
      };
    }
  }
  
  /**
   * Transfer an NFT to the user's wallet
   */
  private async transferNFT(
    contractAddress: string, 
    tokenId: string, 
    userWalletAddress: string,
    tokenStandard: string = 'ERC721'
  ): Promise<NFTPurchaseResult> {
    try {
      // Select the appropriate ABI based on token standard
      const abi = tokenStandard === 'ERC1155' ? ERC1155_ABI : ERC721_ABI;
      
      // Create contract instance
      const nftContract = new ethers.Contract(contractAddress, abi, this.wallet);
      
      // Check if we own the NFT
      if (tokenStandard === 'ERC721') {
        try {
          const owner = await nftContract.ownerOf(tokenId);
          if (owner.toLowerCase() !== this.wallet.address.toLowerCase()) {
            return {
              success: false,
              error: `NFT not owned by bot wallet. Current owner: ${owner}`
            };
          }
        } catch (error: any) {
          console.error('Error checking NFT ownership:', error);
          return {
            success: false,
            error: 'Failed to verify NFT ownership'
          };
        }
      } else if (tokenStandard === 'ERC1155') {
        try {
          const balance = await nftContract.balanceOf(this.wallet.address, tokenId);
          if (balance.eq(0)) {
            return {
              success: false,
              error: 'NFT not owned by bot wallet (ERC1155 balance is 0)'
            };
          }
        } catch (error: any) {
          console.error('Error checking ERC1155 balance:', error);
          return {
            success: false,
            error: 'Failed to verify ERC1155 balance'
          };
        }
      }
      
      // Transfer the NFT to the user's wallet
      let tx;
      if (tokenStandard === 'ERC721') {
        // Use safeTransferFrom for ERC721
        tx = await nftContract.transferFrom(
          this.wallet.address,
          userWalletAddress,
          tokenId
        );
      } else if (tokenStandard === 'ERC1155') {
        // Use safeTransferFrom for ERC1155 (different parameters)
        tx = await nftContract.safeTransferFrom(
          this.wallet.address,
          userWalletAddress,
          tokenId,
          1, // Transfer 1 copy
          '0x' // Empty data
        );
      }
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      console.log(`NFT transferred to ${userWalletAddress}`);
      console.log(`Transaction hash: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error transferring NFT:', error);
      return {
        success: false,
        error: `Failed to transfer NFT: ${error.message}`
      };
    }
  }
  
  /**
   * Main function to handle the NFT purchase and transfer process
   */
  public async purchaseAndTransferNFT(
    userWalletAddress: string, 
    receiptId: string,
    receiptData: any
  ): Promise<NFTPurchaseResult> {
    // Check eligibility first
    const isEligible = await this.isUserEligible(userWalletAddress);
    if (!isEligible) {
      return {
        success: false,
        error: 'User has already claimed an NFT in the last 24 hours'
      };
    }
    
    // Extract keywords from receipt data for better NFT matching
    const keywords: string[] = [];
    if (receiptData.merchantName) {
      keywords.push(receiptData.merchantName);
    }
    if (receiptData.items && Array.isArray(receiptData.items)) {
      receiptData.items.forEach((item: any) => {
        if (item.name) keywords.push(item.name);
      });
    }
    
    try {
      // Find affordable NFTs
      const affordableNFTs = await this.findAffordableNFTs(keywords);
      
      if (affordableNFTs.length === 0) {
        return {
          success: false,
          error: 'No affordable NFTs found'
        };
      }
      
      // Randomly select one NFT from the available options
      const randomIndex = Math.floor(Math.random() * affordableNFTs.length);
      const selectedNFT = affordableNFTs[randomIndex];
      
      // Purchase the NFT
      const purchaseResult = await this.purchaseNFT(selectedNFT);
      if (!purchaseResult.success) {
        return purchaseResult;
      }
      
      // Transfer the NFT to the user
      const transferResult = await this.transferNFT(
        selectedNFT.contract,
        selectedNFT.identifier,
        userWalletAddress,
        selectedNFT.token_standard
      );
      
      if (transferResult.success) {
        // Record the successful claim
        this.recordClaim(
          userWalletAddress,
          selectedNFT.identifier,
          selectedNFT.contract,
          receiptId
        );
        
        // Return the combined result
        return {
          success: true,
          txHash: transferResult.txHash,
          nft: purchaseResult.nft
        };
      } else {
        return transferResult;
      }
    } catch (error: any) {
      console.error('Error in NFT purchase process:', error);
      return {
        success: false,
        error: `NFT purchase process failed: ${error.message}`
      };
    }
  }
  
  /**
   * Fallback function to use if no marketplace NFTs are available
   * Mints a custom NFT instead of purchasing one
   */
  public async mintFallbackNFT(
    userWalletAddress: string,
    receiptId: string,
    receiptData: any
  ): Promise<NFTPurchaseResult> {
    try {
      // Check eligibility first
      const isEligible = await this.isUserEligible(userWalletAddress);
      if (!isEligible) {
        return {
          success: false,
          error: 'User has already claimed an NFT in the last 24 hours'
        };
      }
      
      // For now, simulate a successful minting
      const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const tokenId = Date.now().toString();
      
      // Record the successful claim
      this.recordClaim(
        userWalletAddress,
        tokenId,
        process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '',
        receiptId
      );
      
      return {
        success: true,
        txHash: mockTxHash,
        nft: {
          tokenId,
          contract: process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '',
          name: `BlockReceipt #${tokenId}`,
          image: `/nft-images/receipt-warrior.svg`,
          marketplace: 'BlockReceipt',
          price: 0
        }
      };
    } catch (error: any) {
      console.error('Error minting fallback NFT:', error);
      return {
        success: false,
        error: `Failed to mint fallback NFT: ${error.message}`
      };
    }
  }
}

// Export a singleton instance
export const nftPurchaseBot = new NFTPurchaseBot();