import React from "react";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";

interface BlockchainInfoProps {
  txHash?: string;
  blockNumber?: number;
  verified: boolean;
  nftTokenId?: string;
  timestamp: Date;
}

const BlockchainInfo: React.FC<BlockchainInfoProps> = ({
  txHash = "Processing...",
  blockNumber,
  verified,
  nftTokenId,
  timestamp,
}) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <h5 className="text-sm font-medium text-dark mb-2">Blockchain Information</h5>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Transaction Hash:</span>
          <span className="font-mono">{txHash.length > 10 ? `${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}` : txHash}</span>
        </div>
        {blockNumber && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Block Number:</span>
            <span>{blockNumber.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Timestamp:</span>
          <span>{format(new Date(timestamp), "MMMM d, yyyy HH:mm:ss 'UTC'")}</span>
        </div>
        {nftTokenId && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">NFT Token ID:</span>
            <span className="font-mono">{nftTokenId}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Verification Status:</span>
          <span className="text-success font-medium flex items-center">
            {verified ? (
              <>
                Verified <CheckCircle className="ml-1 h-3 w-3" />
              </>
            ) : (
              "Processing..."
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlockchainInfo;
