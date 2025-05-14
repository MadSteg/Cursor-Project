import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Network,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type NetworkStatusProps = {
  status: string;
  network?: string;
  chainId?: number;
  mockMode: boolean;
  blockHeight?: number;
  contractAddress?: string;
  availableProviders?: number;
  activeProvider?: number;
  error?: string;
};

type BlockchainStatusResponseProps = {
  timestamp: string;
  networks: {
    mumbai?: NetworkStatusProps;
    amoy?: NetworkStatusProps;
  };
  cryptoPayment?: {
    status: string;
    availableCurrencies?: string[];
    error?: string;
  };
};

export const BlockchainStatus = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blockchain/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            Blockchain Status Unavailable
          </CardTitle>
          <CardDescription className="text-red-600">
            Unable to fetch network status information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-100 p-4 text-red-800">
            <p className="font-medium">Error connecting to blockchain services</p>
            <p className="mt-1 text-sm">
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusData: BlockchainStatusResponseProps = data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Blockchain Network Status
        </CardTitle>
        <CardDescription>
          Last updated: {new Date(statusData?.timestamp || Date.now()).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Mumbai Status */}
          {statusData?.networks?.mumbai && (
            <NetworkStatusCard
              title="Polygon Mumbai"
              data={statusData.networks.mumbai}
            />
          )}

          {/* Amoy Status */}
          {statusData?.networks?.amoy && (
            <NetworkStatusCard
              title="Polygon Amoy"
              data={statusData.networks.amoy}
            />
          )}

          {/* Crypto Payment Status */}
          {statusData?.cryptoPayment && (
            <div className="rounded-md border p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">Crypto Payment Service</h3>
                <StatusBadge status={statusData.cryptoPayment.status} />
              </div>
              
              {statusData.cryptoPayment.availableCurrencies && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {statusData.cryptoPayment.availableCurrencies.map((currency) => (
                    <Badge key={currency} variant="outline">
                      {currency}
                    </Badge>
                  ))}
                </div>
              )}
              
              {statusData.cryptoPayment.error && (
                <p className="mt-1 text-sm text-red-600">
                  {statusData.cryptoPayment.error}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const NetworkStatusCard = ({ 
  title, 
  data 
}: { 
  title: string; 
  data: NetworkStatusProps 
}) => {
  return (
    <div className="rounded-md border p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <StatusBadge status={data.status} />
      </div>
      
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {data.network && (
          <div>
            <span className="text-gray-500">Network:</span> {data.network}
          </div>
        )}
        
        {data.chainId && (
          <div>
            <span className="text-gray-500">Chain ID:</span> {data.chainId}
          </div>
        )}
        
        {data.blockHeight && (
          <div>
            <span className="text-gray-500">Block Height:</span> {data.blockHeight.toLocaleString()}
          </div>
        )}
        
        {data.contractAddress && (
          <div className="col-span-2">
            <span className="text-gray-500">Contract:</span>
            <span className="font-mono text-xs ml-1 break-all">
              {data.contractAddress}
            </span>
          </div>
        )}
        
        {data.availableProviders && (
          <div>
            <span className="text-gray-500">Available RPC Providers:</span> {data.availableProviders}
          </div>
        )}
        
        {data.activeProvider !== undefined && (
          <div>
            <span className="text-gray-500">Active Provider:</span> {data.activeProvider + 1}
          </div>
        )}
        
        {data.mockMode && (
          <div className="col-span-2 mt-1">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
              Mock Mode
            </Badge>
            <span className="ml-2 text-yellow-600">
              Blockchain operations are being simulated
            </span>
          </div>
        )}
        
        {data.error && (
          <div className="col-span-2 mt-1 text-red-600">
            Error: {data.error}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case 'connected':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="mr-1 h-3 w-3" /> Connected
        </Badge>
      );
    case 'error':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300">
          <XCircle className="mr-1 h-3 w-3" /> Error
        </Badge>
      );
    case 'mock mode':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <AlertTriangle className="mr-1 h-3 w-3" /> Mock Mode
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

export default BlockchainStatus;