const hre = require('hardhat');

async function main() {
  const Receipt = await hre.ethers.getContractFactory('Receipt1155');
  const receipt = await Receipt.deploy();
  await receipt.waitForDeployment();
  console.log('Receipt1155 deployed to:', await receipt.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
