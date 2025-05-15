import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, AlertCircle, RefreshCw, Gift } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface NFTTaskStatusProps {
  taskId?: string;
  walletAddress: string;
  receiptId?: string;
  onComplete?: (nftData: any) => void;
}

interface TaskStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: string;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NFTTaskStatus({ taskId, walletAddress, receiptId, onComplete }: NFTTaskStatusProps) {
  const [task, setTask] = useState<TaskStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();
  
  // Load task status
  const fetchTaskStatus = async () => {
    if (!taskId && !receiptId) return;
    
    setLoading(true);
    try {
      // Query by task ID if available, otherwise by receipt ID
      const endpoint = taskId 
        ? `/api/tasks/${taskId}`
        : `/api/tasks/receipt/${receiptId}`;
      
      const response = await apiRequest('GET', endpoint);
      const data = await response.json();
      
      if (data.success && data.task) {
        setTask(data.task);
        
        // Set progress based on status
        switch (data.task.status) {
          case 'pending':
            setProgress(25);
            break;
          case 'processing':
            setProgress(50);
            break;
          case 'completed':
            setProgress(100);
            // Call the onComplete callback if provided
            if (onComplete && data.task.result) {
              onComplete(data.task.result);
            }
            break;
          case 'failed':
            setProgress(100);
            break;
          default:
            setProgress(0);
        }
      } else {
        toast({
          title: "Error fetching task",
          description: data.message || "Could not retrieve task status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching task status:", error);
      toast({
        title: "Error fetching task",
        description: "Could not connect to the server to check task status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Set up polling for task status
  useEffect(() => {
    fetchTaskStatus();
    
    // Poll every 5 seconds for updates if task is pending or processing
    const interval = setInterval(() => {
      if (task && (task.status === 'pending' || task.status === 'processing')) {
        fetchTaskStatus();
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [taskId, receiptId, task?.status]);
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 text-white"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };
  
  // No task to show
  if (!task) {
    return (
      <Card className="mb-4 border-dashed border-slate-300">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Gift className="mr-2 text-indigo-500" />
            NFT Task Status
          </CardTitle>
          <CardDescription>
            No active NFT task found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">
            No NFT gift processing information available for this receipt.
          </p>
        </CardContent>
        <CardFooter className="pb-4">
          <Button variant="outline" onClick={fetchTaskStatus} disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Show task status
  return (
    <Card className="mb-4 border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Gift className="mr-2 text-indigo-500" />
            NFT Gift Status
          </CardTitle>
          <StatusBadge status={task.status} />
        </div>
        <CardDescription>
          Task #{task.id} • {new Date(task.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {task.status === 'pending' && (
          <p className="text-slate-600 text-sm">
            Your NFT gift is in the queue and will be processed shortly.
          </p>
        )}
        
        {task.status === 'processing' && (
          <p className="text-slate-600 text-sm">
            We're currently processing your NFT gift. This may take a few minutes.
          </p>
        )}
        
        {task.status === 'completed' && task.result && (
          <div className="space-y-3">
            <p className="text-green-600 text-sm font-medium">
              Your NFT gift has been successfully purchased and transferred to your wallet!
            </p>
            {task.result.name && (
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">NFT:</span> {task.result.name}
              </p>
            )}
            {task.result.tokenId && (
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Token ID:</span> {task.result.tokenId}
              </p>
            )}
            {task.result.txHash && (
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Transaction:</span>{' '}
                <a 
                  href={`https://mumbai.polygonscan.com/tx/${task.result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate"
                >
                  {task.result.txHash.substring(0, 10)}...
                </a>
              </p>
            )}
          </div>
        )}
        
        {task.status === 'failed' && (
          <div className="space-y-2">
            <p className="text-red-600 text-sm font-medium">
              We encountered an issue while processing your NFT gift.
            </p>
            {task.error && (
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Error:</span> {task.error}
              </p>
            )}
            <Button variant="outline" size="sm" onClick={fetchTaskStatus} className="mt-2">
              Retry
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="pb-4">
        <div className="flex justify-between w-full">
          <span className="text-xs text-slate-500">
            Last updated: {new Date(task.updatedAt).toLocaleString()}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchTaskStatus} 
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}