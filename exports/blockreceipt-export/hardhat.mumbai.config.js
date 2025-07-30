/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

const { POLYGON_MUMBAI_RPC_URL, BLOCKCHAIN_PRIVATE_KEY } = process.env;

// Ensure the private key is available
if (!BLOCKCHAIN_PRIVATE_KEY) {
  throw new Error("Missing BLOCKCHAIN_PRIVATE_KEY in environment variables");
}

// Ensure the RPC URL is available
if (!POLYGON_MUMBAI_RPC_URL) {
  throw new Error("Missing POLYGON_MUMBAI_RPC_URL in environment variables");
}

module.exports = {
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
    hardhat: {
      chainId: 31337
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: [`0x${BLOCKCHAIN_PRIVATE_KEY}`],
      chainId: 80001,
      gasPrice: 35000000000, // 35 gwei
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache-mumbai",
    artifacts: "./artifacts-mumbai"
  }
};