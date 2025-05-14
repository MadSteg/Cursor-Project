import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Network,
  AlertCircle,
  RefreshCw,
  Layers,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useState } from "react";

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
  const [expanded, setExpanded] = useState(false);
  const [preferredNetwork, setPreferredNetwork] = useState<string | null>(null);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/blockchain/multi-status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleManualRefresh = () => {
    refetch();
  };

  const handleSetPreferredNetwork = (network: string) => {
    setPreferredNetwork(network);
    // In a real implementation, this would call an API to update the preferred network
  };

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
        <CardFooter>
          <Button 
            variant="outline" 
            className="text-red-800 border-red-300 hover:bg-red-50"
            onClick={handleManualRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const statusData: BlockchainStatusResponseProps = data;
  
  // Check if both networks are in mock mode
  const allMockMode = statusData?.networks?.mumbai?.mockMode && 
                      statusData?.networks?.amoy?.mockMode;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Blockchain Network Status
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleManualRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <CardDescription>
          Last updated: {new Date(statusData?.timestamp || Date.now()).toLocaleString()}
        </CardDescription>
        
        {allMockMode && (
          <div className="mt-2 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800 border border-yellow-200">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="font-medium">All networks are in mock mode</span>
            </div>
            <p className="mt-1 text-xs">
              Blockchain operations are being simulated. Setup your RPC providers to connect to real networks.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Network Status Cards in a responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Mumbai Status */}
            {statusData?.networks?.mumbai && (
              <NetworkStatusCard
                title="Polygon Mumbai"
                data={statusData.networks.mumbai}
                isPreferred={preferredNetwork === 'mumbai'}
                onSetPreferred={() => handleSetPreferredNetwork('mumbai')}
                expanded={expanded}
              />
            )}

            {/* Amoy Status */}
            {statusData?.networks?.amoy && (
              <NetworkStatusCard
                title="Polygon Amoy"
                data={statusData.networks.amoy}
                isPreferred={preferredNetwork === 'amoy'}
                onSetPreferred={() => handleSetPreferredNetwork('amoy')}
                expanded={expanded}
              />
            )}
          </div>

          {/* Crypto Payment Status - Full Width */}
          {statusData?.cryptoPayment && (
            <div className="rounded-md border p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  Crypto Payment Service
                </h3>
                <StatusBadge status={statusData.cryptoPayment.status} />
              </div>
              
              {statusData.cryptoPayment.availableCurrencies && (
                <div className="mt-3">
                  <div className="text-sm text-gray-500 mb-2">Available Currencies:</div>
                  <div className="flex flex-wrap gap-2">
                    {statusData.cryptoPayment.availableCurrencies.map((currency) => (
                      <Badge key={currency} variant="outline" className="px-2 py-1">
                        {currency}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {statusData.cryptoPayment.error && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  <p className="font-medium">Error:</p>
                  <p>{statusData.cryptoPayment.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More Details"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const NetworkStatusCard = ({ 
  title, 
  data,
  isPreferred = false,
  onSetPreferred,
  expanded = false
}: { 
  title: string; 
  data: NetworkStatusProps;
  isPreferred?: boolean;
  onSetPreferred: () => void;
  expanded?: boolean;
}) => {
  return (
    <div className={`rounded-md border p-4 ${isPreferred ? 'border-primary border-2' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          {isPreferred && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Award className="h-4 w-4 ml-2 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preferred Network</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <StatusBadge status={data.status} />
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
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
        
        {expanded && data.blockHeight && (
          <div>
            <span className="text-gray-500">Block Height:</span> {data.blockHeight.toLocaleString()}
          </div>
        )}
        
        {expanded && data.contractAddress && (
          <div className="col-span-2">
            <span className="text-gray-500">Contract:</span>
            <span className="font-mono text-xs ml-1 break-all">
              {data.contractAddress}
            </span>
          </div>
        )}
        
        {expanded && data.availableProviders && (
          <div>
            <span className="text-gray-500">RPC Providers:</span> {data.availableProviders}
          </div>
        )}
        
        {expanded && data.activeProvider !== undefined && (
          <div>
            <span className="text-gray-500">Active Provider:</span> {data.activeProvider + 1}
          </div>
        )}
        
        {data.mockMode && (
          <div className="col-span-2 mt-1">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
              Mock Mode
            </Badge>
            <span className="ml-2 text-yellow-600 text-xs">
              Blockchain operations are being simulated
            </span>
          </div>
        )}
        
        {data.error && (
          <div className="col-span-2 mt-1 text-red-600 text-xs">
            Error: {data.error}
          </div>
        )}
      </div>
      
      {!isPreferred && (
        <div className="mt-3 text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSetPreferred}
            className="text-xs"
          >
            Set as Preferred
          </Button>
        </div>
      )}
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