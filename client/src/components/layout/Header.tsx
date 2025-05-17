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
  FileImage,
  Upload,
  CheckCircle,
  XCircle,
  Key,
  Image,
  Images,
  Gift,
  Ticket
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWeb3 } from "@/contexts/Web3Context";

const Header: React.FC = () => {
  // Use a single call to useLocation to avoid hook order issues
  const [currentLocation, setLocation] = useLocation();
  // Always call useAuth after useLocation
  const { isAuthenticated, isLoading, logout } = useAuth();
  // Get wallet connection status
  const { active, account, isCorrectNetwork, connect, switchToPolygonAmoy } = useWeb3();

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
            {/* Core Navigation - Simplified as requested */}
            <Link href="/about">
              <span className={`text-sm font-medium ${currentLocation === "/about" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <FileCheck className="h-4 w-4 mr-1.5" /> About
              </span>
            </Link>
            
            {/* NFT Gallery - Main feature as requested */}
            <Link href="/nft-catalog">
              <span className={`text-sm font-medium ${currentLocation === "/nft-catalog" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Images className="h-4 w-4 mr-1.5" /> NFT Gallery
              </span>
            </Link>
            
            {/* Offers & Coupons */}
            <Link href="/offers">
              <span className={`text-sm font-medium ${currentLocation === "/offers" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Gift className="h-4 w-4 mr-1.5" /> Offers & Coupons
              </span>
            </Link>
            
            {/* Access Control has been integrated into the Offers page */}
            
            {/* Mint BlockReceipt - Primary Feature */}
            <Link href="/mint-blockreceipt">
              <span className={`text-sm font-medium ${currentLocation === "/mint-blockreceipt" || currentLocation === "/upload-receipt" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <FileImage className="h-4 w-4 mr-1.5" /> Mint a BlockReceipt
              </span>
            </Link>
            
            {/* BlockReceipts - Only visible when authenticated */}
            {isAuthenticated && (
              <Link href="/nft-wallet">
                <span className={`text-sm font-medium ${currentLocation === "/nft-wallet" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                  <Wallet className="h-4 w-4 mr-1.5" /> My NFT Wallet
                </span>
              </Link>
            )}
            
            {/* Testing Menu */}
            <Link href="/test/nft">
              <span className={`text-sm font-medium ${currentLocation.startsWith("/test/") ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Package className="h-4 w-4 mr-1.5" /> Testing
              </span>
            </Link>
            
          </div>
          
          <div className="flex items-center space-x-3">
            
            {/* Show wallet status only when wallet is connected */}
            {active && (
              <div className="flex items-center">
                {/* Wallet indicator with address and network status */}
                <div className="flex items-center px-3 py-1.5 border rounded-md bg-gray-50 mr-2">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium">
                    {account && `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                  </span>
                </div>
                
                {/* Network switch button if on wrong network */}
                {!isCorrectNetwork && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-yellow-600"
                    onClick={switchToPolygonAmoy}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 38 33" fill="none">
                      <path d="M19 0L38 33H0L19 0Z" fill="currentColor" />
                    </svg>
                    Switch
                  </Button>
                )}
              </div>
            )}
            
            {/* Show sign out button if authenticated */}
            {isAuthenticated && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => logout()}
              >
                <User className="h-4 w-4 mr-1.5" /> 
                <span>Sign Out</span>
              </Button>
            )}
            
            {/* Show login/signup if not authenticated and no wallet connected */}
            {!isAuthenticated && !active && (
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-1.5" /> 
                  <span>Login/Signup</span>
                </Button>
              </Link>
            )}
            
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
                    <Link href="/about">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <FileCheck className="h-5 w-5" /> About
                      </span>
                    </Link>
                    <Link href="/nft-catalog">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <Images className="h-5 w-5" /> NFT Gallery
                      </span>
                    </Link>
                    <Link href="/offers">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <Gift className="h-5 w-5" /> Offers & Coupons
                      </span>
                    </Link>
                    {/* Access Control integrated into Offers page */}
                    <Link href="/mint-blockreceipt">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <FileImage className="h-5 w-5" /> Mint a BlockReceipt
                      </span>
                    </Link>
                    {/* BlockReceipts - Only visible when authenticated */}
                    {isAuthenticated && (
                      <Link href="/nft-wallet">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Wallet className="h-5 w-5" /> My NFT Wallet
                        </span>
                      </Link>
                    )}
                  </div>
                  
                  {/* Test Pages */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Testing</p>
                    <div className="space-y-4">
                      <Link href="/test/nft">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Package className="h-5 w-5" /> Test NFT Minting
                        </span>
                      </Link>
                      <Link href="/test/task-status">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Activity className="h-5 w-5" /> Task Queue Test
                        </span>
                      </Link>
                      <Link href="/test/auto-process">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Scan className="h-5 w-5" /> Auto-Process Test
                        </span>
                      </Link>
                      <Link href="/test/taco">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Lock className="h-5 w-5" /> TACo Encryption Test
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Other */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Admin</p>
                    <div className="space-y-4">
                      <Link href="/admin">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Activity className="h-5 w-5" /> Admin Dashboard
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Wallet Connection Status - Only show when connected */}
                    {active && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Wallet</p>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-sm font-medium flex-1 truncate">
                            {account && `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                          </span>
                          {!isCorrectNetwork && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2 text-yellow-600"
                              onClick={switchToPolygonAmoy}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 38 33" fill="none">
                                <path d="M19 0L38 33H0L19 0Z" fill="currentColor" />
                              </svg>
                              Switch Network
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Login/Logout */}
                    {isAuthenticated ? (
                      <div 
                        className="flex items-center gap-2 text-base font-medium cursor-pointer"
                        onClick={() => logout()}
                      >
                        <User className="h-5 w-5" /> Sign Out
                      </div>
                    ) : !active && (
                      <Link href="/sign-in">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <User className="h-5 w-5" /> Login/Signup
                        </span>
                      </Link>
                    )}
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
