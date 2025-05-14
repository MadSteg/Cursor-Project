// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");

async function main() {
  console.log("Deploying Receipt1155 contract to Mumbai...");

  // Get the Contract Factory
  const Receipt1155 = await hre.ethers.getContractFactory("Receipt1155");
  
  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  
  // Deploy the contract with the deployer as the initial owner
  const receipt1155 = await Receipt1155.deploy(deployer.address);
  await receipt1155.deployed();

  console.log(`Receipt1155 contract deployed to: ${receipt1155.address}`);
  console.log("Transaction hash:", receipt1155.deployTransaction.hash);

  // Wait for a few confirmations for good measure
  console.log("Waiting for confirmations...");
  await receipt1155.deployTransaction.wait(5);
  console.log("Deployment confirmed!");

  return receipt1155.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((address) => {
    console.log(`Contract address to save: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });