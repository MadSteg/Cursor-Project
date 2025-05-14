import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Receipt, 
  BarChart3, 
  Settings, 
  User, 
  Lock, 
  Package, 
  Activity, 
  ShoppingCart, 
  Shield, 
  Scan, 
  Wallet, 
  Store, 
  FileCheck,
  FileImage
} from "lucide-react";
import ConnectWalletButton from "@/components/blockchain/ConnectWalletButton";

const Header: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentLocation] = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Receipt className="text-white" size={20} />
            </div>
            <Link href="/">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-dark cursor-pointer">BlockReceipt<span className="text-blue-600">.ai</span></h1>
                <span className="text-xs text-gray-500 -mt-1">Verifiable Digital Receipts</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {/* Core Navigation */}
            <Link href="/">
              <span className={`text-sm font-medium ${currentLocation === "/" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Menu className="h-4 w-4 mr-1.5" /> Dashboard
              </span>
            </Link>
            
            <Link href="/about">
              <span className={`text-sm font-medium ${currentLocation === "/about" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <FileCheck className="h-4 w-4 mr-1.5" /> About
              </span>
            </Link>
            
            {/* NFT Receipts - Primary Feature */}
            <Link href="/nft-wallet">
              <span className={`text-sm font-medium ${currentLocation === "/nft-wallet" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Wallet className="h-4 w-4 mr-1.5" /> NFT Wallet
              </span>
            </Link>
            
            <Link href="/scan-receipt">
              <span className={`text-sm font-medium ${currentLocation === "/scan-receipt" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Scan className="h-4 w-4 mr-1.5" /> Scan Receipt
              </span>
            </Link>
            
            <Link href="/verify-receipt">
              <span className={`text-sm font-medium ${currentLocation === "/verify-receipt" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <FileCheck className="h-4 w-4 mr-1.5" /> Verify Receipt
              </span>
            </Link>
            
            {/* E-commerce & Merchant Features */}
            <Link href="/products">
              <span className={`text-sm font-medium ${currentLocation === "/products" || currentLocation.startsWith("/product/") ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <ShoppingCart className="h-4 w-4 mr-1.5" /> Products
              </span>
            </Link>
            
            <Link href="/merchant-dashboard">
              <span className={`text-sm font-medium ${currentLocation === "/merchant-dashboard" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Store className="h-4 w-4 mr-1.5" /> Merchant
              </span>
            </Link>
            
            {/* Settings */}
            <Link href="/encryption-settings">
              <span className={`text-sm font-medium ${currentLocation === "/encryption-settings" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Settings className="h-4 w-4 mr-1.5" /> Settings
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <ConnectWalletButton size="sm" />
            </div>
            
            <div className="w-9 h-9 bg-light rounded-full flex items-center justify-center cursor-pointer">
              <User className="text-dark h-5 w-5" />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 mt-6">
                  {/* Core Navigation */}
                  <div className="space-y-4">
                    <Link href="/">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <Menu className="h-5 w-5" /> Dashboard
                      </span>
                    </Link>
                  </div>
                  
                  {/* NFT Receipt Features */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">NFT Receipts</p>
                    <div className="space-y-4">
                      <Link href="/nft-wallet">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Wallet className="h-5 w-5" /> NFT Wallet
                        </span>
                      </Link>
                      <Link href="/scan-receipt">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Scan className="h-5 w-5" /> Scan Receipt
                        </span>
                      </Link>
                      <Link href="/verify-receipt">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <FileCheck className="h-5 w-5" /> Verify Receipt
                        </span>
                      </Link>
  
                    </div>
                  </div>
                  
                  {/* E-commerce & Merchant */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Merchant Tools</p>
                    <div className="space-y-4">
                      <Link href="/merchant-dashboard">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Store className="h-5 w-5" /> Merchant Dashboard
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Other */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Settings</p>
                    <div className="space-y-4">
                      <Link href="/encryption-settings">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Settings className="h-5 w-5" /> Encryption Settings
                        </span>
                      </Link>
                      <Link href="/admin">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Activity className="h-5 w-5" /> Admin
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ConnectWalletButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
