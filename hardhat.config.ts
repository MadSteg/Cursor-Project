import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

// Load environment variables with fallbacks
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || process.env.BLOCKCHAIN_PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/your-api-key";
const AMOY_RPC_URL = process.env.ALCHEMY_RPC || "https://polygon-amoy.g.alchemy.com/v2/your-api-key";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Polygon Mumbai testnet
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    // Polygon Amoy testnet
    amoy: {
      url: AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
    // Add other networks as needed
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  },
};

export default config;
