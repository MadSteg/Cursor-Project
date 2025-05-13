import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const BlockchainVisualization: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-dark">Blockchain Receipts</h2>
            <p className="text-sm text-gray-500 mt-1">Your purchase receipts are securely stored on the blockchain</p>
          </div>
          <Button className="mt-4 md:mt-0">
            Learn How It Works
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-medium text-dark mb-2">Immutable Records</h3>
                <p className="text-sm text-gray-600">Your receipts are tamper-proof and can't be altered after creation, providing a verifiable history of your purchases.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-medium text-dark mb-2">Easy Retrieval</h3>
                <p className="text-sm text-gray-600">Access your receipts anytime without having to keep paper copies or search through email archives.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-medium text-dark mb-2">Simplified Returns & Warranties</h3>
                <p className="text-sm text-gray-600">Provide cryptographic proof of purchase when making returns or claiming warranties with just a click.</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <svg 
              className="w-full rounded-xl" 
              viewBox="0 0 800 600" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="800" height="600" rx="20" fill="#3B82F6" fillOpacity="0.1" />
              
              {/* Blockchain representation */}
              <g className="blockchain-connection">
                <rect x="150" y="150" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.8" />
                <rect x="340" y="150" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.8" />
                <rect x="530" y="150" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.8" />
                
                <rect x="150" y="270" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.7" />
                <rect x="340" y="270" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.7" />
                <rect x="530" y="270" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.7" />
                
                <rect x="150" y="390" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.6" />
                <rect x="340" y="390" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.6" />
                <rect x="530" y="390" width="120" height="80" rx="10" fill="#3B82F6" fillOpacity="0.6" />
                
                {/* Connecting lines */}
                <path d="M270 190 L340 190" stroke="#3B82F6" strokeWidth="2" />
                <path d="M460 190 L530 190" stroke="#3B82F6" strokeWidth="2" />
                
                <path d="M270 310 L340 310" stroke="#3B82F6" strokeWidth="2" />
                <path d="M460 310 L530 310" stroke="#3B82F6" strokeWidth="2" />
                
                <path d="M270 430 L340 430" stroke="#3B82F6" strokeWidth="2" />
                <path d="M460 430 L530 430" stroke="#3B82F6" strokeWidth="2" />
                
                {/* Vertical connections */}
                <path d="M210 230 L210 270" stroke="#3B82F6" strokeWidth="2" />
                <path d="M400 230 L400 270" stroke="#3B82F6" strokeWidth="2" />
                <path d="M590 230 L590 270" stroke="#3B82F6" strokeWidth="2" />
                
                <path d="M210 350 L210 390" stroke="#3B82F6" strokeWidth="2" />
                <path d="M400 350 L400 390" stroke="#3B82F6" strokeWidth="2" />
                <path d="M590 350 L590 390" stroke="#3B82F6" strokeWidth="2" />
                
                {/* Receipt icons */}
                <text x="175" y="195" fontSize="12" fill="white">Receipt #1</text>
                <text x="365" y="195" fontSize="12" fill="white">Receipt #2</text>
                <text x="555" y="195" fontSize="12" fill="white">Receipt #3</text>
                
                <text x="175" y="315" fontSize="12" fill="white">Receipt #4</text>
                <text x="365" y="315" fontSize="12" fill="white">Receipt #5</text>
                <text x="555" y="315" fontSize="12" fill="white">Receipt #6</text>
                
                <text x="175" y="435" fontSize="12" fill="white">Receipt #7</text>
                <text x="365" y="435" fontSize="12" fill="white">Receipt #8</text>
                <text x="555" y="435" fontSize="12" fill="white">Receipt #9</text>
              </g>
            </svg>
            
            <div className="mt-4 flex items-center">
              <div className="flex-grow bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className="blockchain-connection bg-blue-400 h-full w-3/4"></div>
              </div>
              <div className="ml-3 px-3 py-1 bg-blue-100 text-primary text-xs rounded-full">
                Connected to Blockchain
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainVisualization;
