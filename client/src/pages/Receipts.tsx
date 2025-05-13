import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter,
  Calendar,
  Tag
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card
} from "@/components/ui/card";
import { 
  Input 
} from "@/components/ui/input";
import ReceiptCard from "@/components/dashboard/ReceiptCard";
import ScanReceipt from "@/components/receipts/ScanReceipt";
import EmailScanner from "@/components/receipts/EmailScanner";
import { type FullReceipt } from "@shared/schema";

const Receipts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get all receipts
  const { data: receipts, isLoading } = useQuery<FullReceipt[]>({
    queryKey: ['/api/receipts/recent?limit=100'],
  });

  // Get categories for filter
  const { data: categories } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  // Filter receipts based on search term and category
  const filteredReceipts = receipts?.filter(receipt => {
    const matchesSearch = searchTerm === "" || 
      receipt.merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || 
      receipt.category.name.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-grow">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">Receipts</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage your blockchain receipts</p>
          </div>
          <div className="mt-4 md:mt-0">
            <EmailScanner />
          </div>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search receipts or items..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-full md:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <Tag className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name.toLowerCase()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <Select>
                  <SelectTrigger className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-40">
                <Select>
                  <SelectTrigger className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Highest Amount</SelectItem>
                    <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-10">Loading receipts...</div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {filteredReceipts?.length} receipts found
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReceipts?.map((receipt) => (
                <ReceiptCard key={receipt.id} receipt={receipt} />
              ))}
              
              {filteredReceipts?.length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No receipts found.</p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
      
      <ScanReceipt />
    </main>
  );
};

export default Receipts;
