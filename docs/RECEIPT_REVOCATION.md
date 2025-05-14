# Receipt Revocation Documentation

## Overview

BlockReceipt.ai supports two mechanisms for invalidating receipts:

1. **Revocation**: Marking a receipt as invalid in the contract's metadata without burning the token
2. **Burning**: Permanently destroying the receipt token

This document explains when and how to use each method, the governance process around revocation, and how users can verify a receipt's status.

## Revocation vs. Burning

### Revocation

**When to use revocation:**
- For temporary invalidation (e.g., during a dispute)
- When you want to maintain the receipt history
- When the receipt might need to be reinstated later
- For receipts that are invalid but need to be preserved for record-keeping

**Technical implementation:**
- Calls the `revokeReceipt(uint256 tokenId)` function
- Sets the `revoked` flag to `true` in the receipt's metadata
- Emits a `ReceiptRevoked` event
- The token still exists but will return `false` when `isValidReceipt()` is called

### Burning

**When to use burning:**
- For permanent invalidation
- When the receipt needs to be completely removed
- For privacy reasons (user requested deletion)
- For receipts that were created in error

**Technical implementation:**
- Calls the `burn(address from, uint256 tokenId, uint256 amount)` function
- Permanently destroys the token
- Emits a `ReceiptBurned` event
- The token no longer exists and cannot be retrieved

## Governance Process

### Who Can Revoke Receipts

Only accounts with the `ADMIN_ROLE` can revoke receipts. This restricted access ensures that receipts can only be revoked through proper channels.

### Revocation Request Flow

1. **Request Submission**: A merchant or customer can submit a revocation request through:
   - Customer support portal
   - Merchant dashboard
   - Legal/compliance request

2. **Review Process**:
   - The BlockReceipt.ai compliance team reviews the request
   - Required documentation is collected (reason for revocation, proof, etc.)
   - If the request is approved, it moves to the execution phase

3. **Execution**:
   - An authorized admin calls the `revokeReceipt()` function
   - A record of the revocation is stored off-chain with the reason
   - All parties are notified of the revocation

4. **Appeal Process**:
   - If a revocation is disputed, parties can submit an appeal
   - Appeals are reviewed by a different member of the compliance team
   - If approved, a receipt can be un-revoked (this requires a contract upgrade)

## Verification Process

### How Users Can Verify Receipt Status

1. **Through BlockReceipt.ai Interface**:
   - The receipt detail page shows a clear "Valid" or "Revoked" status
   - Revoked receipts display a banner explaining their status

2. **Blockchain Verification**:
   - Users can use the "Verify on Blockchain" feature to check status directly from the contract
   - BlockExplorer links are provided for independent verification

3. **Programmatic Verification**:
   - Developers can call `isValidReceipt(tokenId)` to check validity
   - The `getReceiptMetadata(tokenId)` function returns detailed status information

### Visual Indicators

- **Valid Receipts**: Display a green "Valid" badge
- **Revoked Receipts**: Display a red "Revoked" badge with a timestamp
- **Burned Receipts**: Return a "Receipt does not exist" message

## Notification System

When a receipt is revoked:

1. Email notifications are sent to:
   - The receipt owner
   - The issuing merchant
   - Any other parties with registered interest

2. The notification includes:
   - Receipt ID
   - Revocation date and time
   - General reason for revocation
   - Steps for appeal (if applicable)

## Security Considerations

- All revocation actions are logged with multi-factor authentication
- Audit trail is maintained for all revocation decisions
- Regular review of admin role-holders is conducted
- Key rotation is implemented for admin accounts

## Reinstatement Process

In rare cases where a receipt needs to be reinstated after revocation:

1. A contract upgrade would be required to implement un-revocation functionality
2. This would require governance approval
3. Thorough documentation would be maintained for any reinstated receipts

## Technical Implementation Details

```solidity
// Revoke a receipt
function revokeReceipt(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
    require(bytes(_receiptMetadata[tokenId].receiptType).length > 0, "Receipt does not exist");
    require(!_receiptMetadata[tokenId].revoked, "Receipt already revoked");
    
    _receiptMetadata[tokenId].revoked = true;
    
    emit ReceiptRevoked(tokenId);
}

// Check if a receipt is valid
function isValidReceipt(uint256 tokenId) public view returns (bool) {
    return bytes(_receiptMetadata[tokenId].receiptType).length > 0 && 
           !_receiptMetadata[tokenId].revoked;
}
```