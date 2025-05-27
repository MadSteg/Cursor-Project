require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/your-api-key";
const AMOY_RPC_URL = process.env.RPC_URL || "https://polygon-amoy.g.alchemy.com/v2/your-api-key";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    // Add other networks as needed
  },
};