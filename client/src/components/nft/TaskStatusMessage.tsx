import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { queryClient } from '@/lib/queryClient';

interface TaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
}

interface TaskStatusMessageProps {
  taskId: string;
  pollingInterval?: number;
}

/**
 * TaskStatusMessage Component
 * 
 * Displays the current status of a background task with appropriate visuals
 * and automatically polls for updates.
 */
const TaskStatusMessage: React.FC<TaskStatusMessageProps> = ({ 
  taskId, 
  pollingInterval = 3000 
}) => {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [polling, setPolling] = useState<boolean>(true);
  
  // Effect to poll for task status
  useEffect(() => {
    if (!taskId || !polling) return;
    
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/task/${taskId}/status`);
        const data = await response.json();
        
        if (data.success) {
          setStatus({
            status: data.status,
            progress: data.progress,
            result: data.result,
            error: data.error
          });
          
          // Stop polling if task is completed or failed
          if (data.status === 'completed' || data.status === 'failed') {
            setPolling(false);
          }
        } else {
          console.error('Error fetching task status:', data.message);
          setStatus({
            status: 'failed',
            error: data.message || 'Failed to fetch task status'
          });
          setPolling(false);
        }
      } catch (error) {
        console.error('Error polling task status:', error);
        setStatus({
          status: 'failed',
          error: 'Network error while checking task status'
        });
        // Continue polling in case of network errors
      }
    };
    
    // Poll immediately
    pollStatus();
    
    // Setup polling interval
    const interval = setInterval(pollStatus, pollingInterval);
    
    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [taskId, polling, pollingInterval]);
  
  // Manually refresh status
  const refreshStatus = () => {
    // Invalidate cache for this task
    queryClient.invalidateQueries({ queryKey: [`/api/task/${taskId}/status`] });
    setPolling(true);
  };
  
  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
        <h4 className="font-medium">Checking status...</h4>
        <p className="text-sm text-gray-500">
          Connecting to task processor
        </p>
      </div>
    );
  }
  
  // Determine display based on status
  switch (status.status) {
    case 'pending':
      return (
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <h4 className="font-medium">Pending</h4>
          <p className="text-sm text-gray-500">
            Your receipt NFT is waiting to be processed
          </p>
          <Progress value={0} className="w-full h-2 mt-2" />
        </div>
      );
      
    case 'processing':
      return (
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
          <h4 className="font-medium">Processing</h4>
          <p className="text-sm text-gray-500">
            Creating your NFT receipt on the blockchain
          </p>
          <Progress 
            value={status.progress || 50} 
            className="w-full h-2 mt-2" 
          />
        </div>
      );
      
    case 'completed':
      return (
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-medium">Complete</h4>
          <p className="text-sm text-gray-500">
            Your NFT receipt has been created successfully
          </p>
          <div className="text-xs text-gray-500 mt-2 w-full overflow-hidden">
            {status.result?.transactionHash && (
              <div className="truncate">
                <span className="font-medium">Tx:</span> {status.result.transactionHash}
              </div>
            )}
            {status.result?.tokenId && (
              <div>
                <span className="font-medium">Token ID:</span> {status.result.tokenId}
              </div>
            )}
          </div>
        </div>
      );
      
    case 'failed':
      return (
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h4 className="font-medium">Failed</h4>
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {status.error || 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
          <button 
            onClick={refreshStatus}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            Retry
          </button>
        </div>
      );
      
    default:
      return (
        <div className="flex flex-col items-center justify-center p-4 gap-3">
          <div className="bg-gray-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-gray-600" />
          </div>
          <h4 className="font-medium">Unknown Status</h4>
          <p className="text-sm text-gray-500">
            The status of your NFT receipt is unknown
          </p>
          <button 
            onClick={refreshStatus}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            Check Again
          </button>
        </div>
      );
  }
};

export default TaskStatusMessage;