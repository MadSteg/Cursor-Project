const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Receipt1155Enhanced", function () {
  let Receipt1155Enhanced;
  let receipt;
  let owner;
  let minter;
  let partner;
  let customer;
  let ADMIN_ROLE, MINTER_ROLE;
  
  const baseURI = "ipfs://";
  const tokenId = 1;
  const amount = 1;
  const tokenURI = "QmHash123/metadata.json";
  const receiptType = "premium";

  beforeEach(async function () {
    // Get signers for testing
    [owner, minter, partner, customer] = await ethers.getSigners();
    
    // Deploy contract
    Receipt1155Enhanced = await ethers.getContractFactory("Receipt1155Enhanced");
    receipt = await Receipt1155Enhanced.deploy(baseURI);
    await receipt.deployed();
    
    // Get role constants
    ADMIN_ROLE = await receipt.ADMIN_ROLE();
    MINTER_ROLE = await receipt.MINTER_ROLE();
    
    // Grant minter role to the minter
    await receipt.grantRole(MINTER_ROLE, minter.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner as admin", async function () {
      expect(await receipt.hasRole(ADMIN_ROLE, owner.address)).to.equal(true);
    });
    
    it("Should set the right owner as minter", async function () {
      expect(await receipt.hasRole(MINTER_ROLE, owner.address)).to.equal(true);
    });
    
    it("Should set the base URI correctly", async function () {
      // Mint a receipt to test URI
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      
      // Check if URI is constructed correctly
      expect(await receipt.uri(tokenId)).to.equal(baseURI + tokenURI);
    });
  });
  
  describe("Role Management", function () {
    it("Should allow admin to grant minter role", async function () {
      await receipt.grantRole(MINTER_ROLE, partner.address);
      expect(await receipt.hasRole(MINTER_ROLE, partner.address)).to.equal(true);
    });
    
    it("Should prevent non-admin from granting roles", async function () {
      await expect(
        receipt.connect(partner).grantRole(MINTER_ROLE, partner.address)
      ).to.be.reverted;
    });
    
    it("Should allow admin to revoke minter role", async function () {
      await receipt.grantRole(MINTER_ROLE, partner.address);
      await receipt.revokeRole(MINTER_ROLE, partner.address);
      expect(await receipt.hasRole(MINTER_ROLE, partner.address)).to.equal(false);
    });
  });
  
  describe("Minting", function () {
    it("Should allow minter to mint receipts", async function () {
      await receipt.connect(minter).mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      expect(await receipt.balanceOf(customer.address, tokenId)).to.equal(amount);
    });
    
    it("Should prevent non-minters from minting", async function () {
      await expect(
        receipt.connect(partner).mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType)
      ).to.be.reverted;
    });
    
    it("Should emit ReceiptMinted event on mint", async function () {
      await expect(receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType))
        .to.emit(receipt, "ReceiptMinted")
        .withArgs(customer.address, tokenId, tokenURI, receiptType);
    });
    
    it("Should prevent minting duplicate receipt IDs", async function () {
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      await expect(
        receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType)
      ).to.be.revertedWith("Receipt already exists");
    });
    
    it("Should store receipt metadata correctly", async function () {
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      const metadata = await receipt.getReceiptMetadata(tokenId);
      expect(metadata.receiptType).to.equal(receiptType);
      expect(metadata.revoked).to.equal(false);
    });
  });
  
  describe("Batch Minting", function () {
    it("Should allow batch minting of receipts", async function () {
      const tokenIds = [1, 2, 3];
      const amounts = [1, 1, 1];
      const tokenURIs = ["uri1", "uri2", "uri3"];
      const receiptTypes = ["standard", "premium", "luxury"];
      
      await receipt.batchMintReceipts(
        customer.address,
        tokenIds,
        amounts,
        tokenURIs,
        receiptTypes
      );
      
      expect(await receipt.balanceOf(customer.address, tokenIds[0])).to.equal(amounts[0]);
      expect(await receipt.balanceOf(customer.address, tokenIds[1])).to.equal(amounts[1]);
      expect(await receipt.balanceOf(customer.address, tokenIds[2])).to.equal(amounts[2]);
    });
    
    it("Should revert batch mint with mismatched array lengths", async function () {
      const tokenIds = [1, 2, 3];
      const amounts = [1, 1];
      const tokenURIs = ["uri1", "uri2", "uri3"];
      const receiptTypes = ["standard", "premium", "luxury"];
      
      await expect(
        receipt.batchMintReceipts(
          customer.address,
          tokenIds,
          amounts,
          tokenURIs,
          receiptTypes
        )
      ).to.be.revertedWith("Input arrays must have same length");
    });
  });
  
  describe("Burning", function () {
    beforeEach(async function () {
      // Mint a receipt for the customer
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
    });
    
    it("Should allow owner to burn their receipt", async function () {
      await receipt.connect(customer).burn(customer.address, tokenId, amount);
      expect(await receipt.balanceOf(customer.address, tokenId)).to.equal(0);
    });
    
    it("Should allow admin to burn any receipt", async function () {
      await receipt.connect(owner).burn(customer.address, tokenId, amount);
      expect(await receipt.balanceOf(customer.address, tokenId)).to.equal(0);
    });
    
    it("Should prevent non-owner and non-admin from burning", async function () {
      await expect(
        receipt.connect(partner).burn(customer.address, tokenId, amount)
      ).to.be.revertedWith("Caller must be owner or admin");
    });
    
    it("Should emit ReceiptBurned event", async function () {
      await expect(receipt.burn(customer.address, tokenId, amount))
        .to.emit(receipt, "ReceiptBurned")
        .withArgs(customer.address, tokenId, amount);
    });
  });
  
  describe("Revocation", function () {
    beforeEach(async function () {
      // Mint a receipt for the customer
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
    });
    
    it("Should allow admin to revoke receipts", async function () {
      await receipt.revokeReceipt(tokenId);
      const metadata = await receipt.getReceiptMetadata(tokenId);
      expect(metadata.revoked).to.equal(true);
    });
    
    it("Should prevent non-admin from revoking receipts", async function () {
      await expect(
        receipt.connect(customer).revokeReceipt(tokenId)
      ).to.be.reverted;
    });
    
    it("Should emit ReceiptRevoked event", async function () {
      await expect(receipt.revokeReceipt(tokenId))
        .to.emit(receipt, "ReceiptRevoked")
        .withArgs(tokenId);
    });
    
    it("Should mark receipt as invalid after revocation", async function () {
      await receipt.revokeReceipt(tokenId);
      expect(await receipt.isValidReceipt(tokenId)).to.equal(false);
    });
    
    it("Should prevent revoking non-existent receipts", async function () {
      await expect(
        receipt.revokeReceipt(999)
      ).to.be.revertedWith("Receipt does not exist");
    });
    
    it("Should prevent revoking already revoked receipts", async function () {
      await receipt.revokeReceipt(tokenId);
      await expect(
        receipt.revokeReceipt(tokenId)
      ).to.be.revertedWith("Receipt already revoked");
    });
  });
  
  describe("Pausable", function () {
    it("Should allow admin to pause the contract", async function () {
      await receipt.pause();
      await expect(
        receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType)
      ).to.be.reverted;
    });
    
    it("Should allow admin to unpause the contract", async function () {
      await receipt.pause();
      await receipt.unpause();
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      expect(await receipt.balanceOf(customer.address, tokenId)).to.equal(amount);
    });
    
    it("Should prevent non-admin from pausing", async function () {
      await expect(
        receipt.connect(partner).pause()
      ).to.be.reverted;
    });
    
    it("Should prevent transfers when paused", async function () {
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      await receipt.pause();
      await expect(
        receipt.connect(customer).safeTransferFrom(
          customer.address,
          partner.address,
          tokenId,
          amount,
          "0x"
        )
      ).to.be.reverted;
    });
  });
  
  describe("URI Management", function () {
    it("Should allow admin to set base URI", async function () {
      const newBaseURI = "https://example.com/";
      await receipt.setBaseURI(newBaseURI);
      
      // Mint a receipt to test URI
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      expect(await receipt.uri(tokenId)).to.equal(newBaseURI + tokenURI);
    });
    
    it("Should emit BaseURISet event", async function () {
      const newBaseURI = "https://example.com/";
      await expect(receipt.setBaseURI(newBaseURI))
        .to.emit(receipt, "BaseURISet")
        .withArgs(newBaseURI);
    });
    
    it("Should prevent non-admin from setting base URI", async function () {
      await expect(
        receipt.connect(partner).setBaseURI("https://example.com/")
      ).to.be.reverted;
    });
    
    it("Should handle token URI with empty base URI", async function () {
      await receipt.setBaseURI("");
      await receipt.mintReceipt(customer.address, tokenId, amount, tokenURI, receiptType);
      expect(await receipt.uri(tokenId)).to.equal(tokenURI);
    });
    
    it("Should provide contractURI for marketplaces", async function () {
      expect(await receipt.contractURI()).to.equal(baseURI + "contract");
    });
  });
});