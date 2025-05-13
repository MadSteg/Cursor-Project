import React from "react";
import { Link } from "wouter";
import { Receipt, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Receipt className="text-white h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-dark">BlockReceipt</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Transforming everyday purchases into blockchain-secured digital receipts. Never lose a receipt again.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-dark mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Features</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">How It Works</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-dark mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} BlockReceipt. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-primary">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
