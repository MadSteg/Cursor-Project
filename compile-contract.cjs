#!/usr/bin/env node

const hardhat = require("hardhat");
const path = require("path");

async function main() {
  try {
    await hardhat.run("compile");
    console.log("Contracts compiled successfully!");
  } catch (error) {
    console.error("Error compiling contracts:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });