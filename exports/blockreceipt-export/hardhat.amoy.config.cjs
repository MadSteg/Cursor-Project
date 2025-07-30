require("dotenv").config();
require("@nomiclabs/hardhat-ethers");   // ethers v5

module.exports = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: process.env.ALCHEMY_RPC || "",
      chainId: 80002,
      accounts: process.env.WALLET_PRIVATE_KEY
        ? [process.env.WALLET_PRIVATE_KEY]
        : [],
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  }
};