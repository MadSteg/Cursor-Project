import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptionService } from "@/lib/encryptionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function SharedAccessManager() {
  const { toast } = useToast();
  
  // Query to fetch receipts shared with me
  const { data: sharedWithMe, isLoading: loadingSharedWithMe } = useQuery({
    queryKey: ["/api/shared-with-me"],
    queryFn: encryptionService.getSharedWithMe,
  });

  // Query to fetch receipts I've shared
  const { data: sharedByMe, isLoading: loadingSharedByMe } = useQuery({
    queryKey: ["/api/shared-by-me"],
    queryFn: encryptionService.getSharedByMe,
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Shared Access</h2>

      <Tabs defaultValue="shared-with-me">
        <TabsList className="mb-4">
          <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
          <TabsTrigger value="shared-by-me">Shared by Me</TabsTrigger>
        </TabsList>

        <TabsContent value="shared-with-me">
          <h3 className="text-lg font-semibold mb-4">Receipts Shared with Me</h3>
          
          {loadingSharedWithMe ? (
            <div className="text-center py-8">Loading shared receipts...</div>
          ) : sharedWithMe && sharedWithMe.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedWithMe.map((receipt) => (
                <SharedReceiptCard 
                  key={receipt.id} 
                  receipt={receipt} 
                  type="shared-with-me"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p>No receipts have been shared with you yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared-by-me">
          <h3 className="text-lg font-semibold mb-4">Receipts You've Shared</h3>
          
          {loadingSharedByMe ? (
            <div className="text-center py-8">Loading shared receipts...</div>
          ) : sharedByMe && sharedByMe.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedByMe.map((receipt) => (
                <SharedReceiptCard 
                  key={receipt.id} 
                  receipt={receipt} 
                  type="shared-by-me"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p>You haven't shared any receipts yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Share your encrypted receipts by selecting a receipt and clicking "Share".
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SharedReceiptCard({ receipt, type }: { receipt: any; type: "shared-with-me" | "shared-by-me" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {receipt.merchant?.name || "Unnamed Merchant"}
          </CardTitle>
          <Badge variant={type === "shared-with-me" ? "secondary" : "outline"}>
            {type === "shared-with-me" ? "Shared with me" : "Shared by me"}
          </Badge>
        </div>
        <CardDescription>
          {new Date(receipt.date).toLocaleDateString()} - ${parseFloat(receipt.total).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Items:</span>
            <span>{receipt.items?.length || 0} items</span>
          </div>
          {type === "shared-with-me" && (
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Shared by:</span>
              <span>User #{receipt.sharedBy}</span>
            </div>
          )}
          {type === "shared-by-me" && (
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Shared with:</span>
              <span>User #{receipt.sharedWith}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold">Shared on:</span>
            <span>{new Date(receipt.sharedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {receipt.blockchainVerified && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center text-xs text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Blockchain Verified
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}