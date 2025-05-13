import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const ALCHEMY_RPC = process.env.ALCHEMY_RPC || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 84531,
    },
    base: {
      url: ALCHEMY_RPC || "https://mainnet.base.org",
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 8453,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "./typechain-types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      // Base etherscan API key
      base: process.env.ETHERSCAN_API_KEY || "",
      baseGoerli: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
    ],
  },
};

export default config;