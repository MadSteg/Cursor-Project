// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log("Deploying Receipt1155 contract...");

  // Deploy the contract
  const Receipt1155 = await hre.ethers.getContractFactory("Receipt1155");
  const receipt = await Receipt1155.deploy();

  await receipt.deployed();

  console.log(`Receipt1155 deployed to: ${receipt.address}`);
  console.log(`RECEIPT_NFT_CONTRACT_ADDRESS=${receipt.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });