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
  Upload
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

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
            
            {/* Security (formerly Settings) */}
            <Link href="/encryption-settings">
              <span className={`text-sm font-medium ${currentLocation === "/encryption-settings" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <Shield className="h-4 w-4 mr-1.5" /> Security
              </span>
            </Link>
            
            {/* Removed Hot Wallet link from here - moved to right side */}
            
            {/* Mint BlockReceipt - Primary Feature */}
            <Link href="/upload-receipt">
              <span className={`text-sm font-medium ${currentLocation === "/upload-receipt" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                <FileImage className="h-4 w-4 mr-1.5" /> Mint BlockReceipt
              </span>
            </Link>
            
            {/* BlockReceipts - Only visible when authenticated */}
            {isAuthenticated && (
              <Link href="/receipt-gallery">
                <span className={`text-sm font-medium ${currentLocation === "/receipt-gallery" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer flex items-center`}>
                  <Receipt className="h-4 w-4 mr-1.5" /> BlockReceipts
                </span>
              </Link>
            )}
            
          </div>
          
          <div className="flex items-center space-x-3">
            
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="flex items-center">
                <Wallet className="h-4 w-4 mr-1.5" /> 
                <span>Login/Signup</span>
              </Button>
            </Link>
            
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
                    <Link href="/encryption-settings">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <Shield className="h-5 w-5" /> Security
                      </span>
                    </Link>
                    <Link href="/upload-receipt">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <FileImage className="h-5 w-5" /> Mint BlockReceipt
                      </span>
                    </Link>
                    {/* BlockReceipts - Only visible when authenticated */}
                    {isAuthenticated && (
                      <Link href="/receipt-gallery">
                        <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                          <Receipt className="h-5 w-5" /> BlockReceipts
                        </span>
                      </Link>
                    )}
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
                    <Link href="/sign-in">
                      <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <User className="h-5 w-5" /> Login/Signup
                      </span>
                    </Link>
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
