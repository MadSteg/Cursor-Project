import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import NFTTaskStatus from '@/components/nft/NFTTaskStatus';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';

export default function TaskStatusTestPage() {
  const [taskId, setTaskId] = useState<string>('');
  const [createdTaskId, setCreatedTaskId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { address, isConnected, connect } = useWeb3Wallet();
  
  // Create a test task
  const createTestTask = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      
      try {
        await connect();
        // If connection fails, return early
        if (!isConnected) {
          return;
        }
      } catch (err) {
        console.error("Wallet connection failed:", err);
        return;
      }
    }
    
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/test/test-task', {
        type: 'nft_purchase',
        walletAddress: address
      });
      
      const data = await response.json();
      
      if (data.success && data.task) {
        setCreatedTaskId(data.task.id);
        toast({
          title: "Test Task Created",
          description: `Task ID: ${data.task.id}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error Creating Task",
          description: data.message || "Could not create test task",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating test task:", error);
      toast({
        title: "Error Creating Task",
        description: "Could not connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">BlockReceipt NFT Task Status Test</CardTitle>
          <CardDescription>
            Test the NFT task status component by creating a test task or entering a task ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Create a test task */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Create a Test Task</h3>
              <p className="text-sm text-slate-600">
                Create a test task to simulate an NFT purchase
              </p>
              <Button 
                onClick={createTestTask} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Test Task'}
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">or</span>
              </div>
            </div>
            
            {/* Look up an existing task */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Look Up Existing Task</h3>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter Task ID"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setCreatedTaskId(taskId)}
                  disabled={!taskId}
                >
                  Load
                </Button>
              </div>
            </div>
            
            {/* Task status display */}
            {createdTaskId && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Task Status</h3>
                <NFTTaskStatus 
                  taskId={createdTaskId}
                  walletAddress={address || ''}
                  onComplete={(result) => {
                    toast({
                      title: "Task Completed",
                      description: `NFT purchased successfully: ${result.name}`,
                      variant: "default",
                    });
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}