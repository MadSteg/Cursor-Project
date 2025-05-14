import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProductCategory, NFTReceiptTier } from "@shared/products";

export default function ProductCatalog() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState("");

  // Query products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', selectedCategory, selectedMerchant, searchTerm],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (selectedCategory) queryParams.append("category", selectedCategory);
      if (selectedMerchant) queryParams.append("merchant", selectedMerchant);
      if (searchTerm) queryParams.append("search", searchTerm);
      
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });

  // Query categories
  const { data: categories } = useQuery({
    queryKey: ['/api/products/categories'],
    queryFn: async () => {
      const response = await fetch('/api/products/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });

  // Query merchants
  const { data: merchants } = useQuery({
    queryKey: ['/api/merchants'],
    queryFn: async () => {
      const response = await fetch('/api/merchants');
      if (!response.ok) {
        throw new Error('Failed to fetch merchants');
      }
      return response.json();
    }
  });

  // Handle product selection
  const handleProductClick = (productId: string) => {
    setLocation(`/product/${productId}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to the dependencies
  };

  return (
    <main className="container py-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Product Catalog
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Filters */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search
                </label>
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(ProductCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="merchant" className="text-sm font-medium">
                  Merchant
                </label>
                <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Merchants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Merchants</SelectItem>
                    {merchants?.map((merchant: any) => (
                      <SelectItem key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </form>
          </div>
          
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">NFT Receipt Tiers</h2>
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <h3 className="font-medium">Standard - $0.99</h3>
                <p className="text-sm text-muted-foreground">Basic digital receipt with proof of purchase</p>
              </div>
              <div className="p-3 border rounded-md bg-muted/30">
                <h3 className="font-medium">Premium - $2.99</h3>
                <p className="text-sm text-muted-foreground">Enhanced visuals with extended metadata</p>
              </div>
              <div className="p-3 border rounded-md bg-muted/50">
                <h3 className="font-medium">Luxury - $5.00</h3>
                <p className="text-sm text-muted-foreground">Animated receipt with exclusive features</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="md:col-span-3">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 h-80 bg-muted"></div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products && products.map((product: any) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Product';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                    <CardDescription className="truncate">{product.metadata.manufacturer || 'Unknown'}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          product.nftReceipt.defaultTier === NFTReceiptTier.LUXURY 
                            ? "border-purple-500 text-purple-500" 
                            : product.nftReceipt.defaultTier === NFTReceiptTier.PREMIUM
                              ? "border-blue-500 text-blue-500"
                              : "border-green-500 text-green-500"
                        }
                      >
                        {product.nftReceipt.defaultTier}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}