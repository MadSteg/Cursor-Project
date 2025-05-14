import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Receipt, BarChart3, Settings, User, Lock } from "lucide-react";
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
                <span className="text-xs text-gray-500 -mt-1">Blockchain-Verified Receipts</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className={`text-sm font-medium ${currentLocation === "/" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer`}>
                Dashboard
              </span>
            </Link>
            <Link href="/receipts">
              <span className={`text-sm font-medium ${currentLocation === "/receipts" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer`}>
                Receipts
              </span>
            </Link>
            <Link href="/analytics">
              <span className={`text-sm font-medium ${currentLocation === "/analytics" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer`}>
                Analytics
              </span>
            </Link>
            <Link href="/encryption-settings">
              <span className={`text-sm font-medium ${currentLocation === "/encryption-settings" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer`}>
                Encryption
              </span>
            </Link>
            <Link href="/settings">
              <span className={`text-sm font-medium ${currentLocation === "/settings" ? "text-primary" : "text-dark hover:text-primary"} cursor-pointer`}>
                Settings
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
                  <Link href="/">
                    <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                      <Menu className="h-5 w-5" /> Dashboard
                    </span>
                  </Link>
                  <Link href="/receipts">
                    <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                      <Receipt className="h-5 w-5" /> Receipts
                    </span>
                  </Link>
                  <Link href="/analytics">
                    <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                      <BarChart3 className="h-5 w-5" /> Analytics
                    </span>
                  </Link>
                  <Link href="/encryption-settings">
                    <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                      <Lock className="h-5 w-5" /> Encryption
                    </span>
                  </Link>
                  <Link href="/settings">
                    <span className="flex items-center gap-2 text-base font-medium cursor-pointer">
                      <Settings className="h-5 w-5" /> Settings
                    </span>
                  </Link>
                  <div className="mt-4">
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
