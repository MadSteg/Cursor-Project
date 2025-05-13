import React, { useState } from "react";
import { Mail, AlertCircle, ExternalLink, ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailScanner from "@/components/receipts/EmailScanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const emailReceipts = [
  {
    id: "1",
    merchant: "Amazon",
    subject: "Your Amazon.com order #113-2883177-2648269",
    date: new Date("2023-05-05T14:23:00"),
    total: "$78.45",
    items: ["Wireless Headphones", "USB Cable"],
    category: "Electronics"
  },
  {
    id: "2",
    merchant: "Uber Eats",
    subject: "Your Uber Eats order has been delivered",
    date: new Date("2023-05-03T19:15:00"),
    total: "$24.99",
    items: ["Chicken Burrito", "Guacamole", "Chips"],
    category: "Dining"
  },
  {
    id: "3",
    merchant: "Netflix",
    subject: "Your Netflix bill",
    date: new Date("2023-05-01T06:10:00"),
    total: "$14.99",
    items: ["Monthly Subscription - Standard Plan"],
    category: "Entertainment"
  }
];

const EmailReceipts: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("all");
  
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-dark">Email Receipts</CardTitle>
          <EmailScanner />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Receipts automatically imported from your connected email accounts
        </p>
      </CardHeader>
      
      <div className="px-6">
        <Tabs defaultValue="all" onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unprocessed">Unprocessed</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <CardContent>
        {emailReceipts.length === 0 ? (
          <div className="text-center py-6 px-4">
            <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700">No email receipts found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mt-1 mb-4">
              Connect your email account to automatically import receipts and order confirmations.
            </p>
            <EmailScanner />
          </div>
        ) : (
          <div className="space-y-4">
            {emailReceipts.map((receipt) => (
              <div 
                key={receipt.id} 
                className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-dark">{receipt.merchant}</h4>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {receipt.subject}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {receipt.date.toLocaleDateString()} at {receipt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="inline-block mx-2 w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-xs font-medium text-gray-600">{receipt.total}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Import</span>
                    </Button>
                  </div>
                </div>
                
                {receipt.items && receipt.items.length > 0 && (
                  <div className="ml-13 pl-13 mt-2">
                    <div className="ml-[52px] pl-px border-l border-dashed border-gray-200">
                      <div className="pl-4 pt-2">
                        <p className="text-xs text-gray-500 mb-1">Items:</p>
                        <ul className="space-y-1">
                          {receipt.items.map((item, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center ml-[52px]">
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="text-xs text-amber-600">Needs verification</span>
                  </div>
                  <Button variant="link" size="sm" className="h-6 p-0">
                    <span className="text-xs">View Original</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Button variant="link" className="text-xs">
                View all email receipts <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailReceipts;