import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/your-api-key";

const config: HardhatUserConfig = {
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

export default config;