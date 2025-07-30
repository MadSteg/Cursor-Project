import React from 'react';

const Wallet: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="bg-card shadow-sm rounded-lg p-6 border sticky top-20">
            <h3 className="text-lg font-medium mb-4">Wallet Info</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Connected Address</p>
                <p className="font-mono text-sm break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                  <span>Polygon Amoy</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-bold">2.45 MATIC</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Receipt NFTs</p>
                <p className="font-bold">12</p>
              </div>
              
              <button className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-8">
          <div className="bg-card shadow-sm rounded-lg p-6 border mb-8">
            <h3 className="text-lg font-medium mb-4">Receipt NFT Gallery</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-muted/40 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-muted-foreground/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 10c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z"
                      />
                    </svg>
                  </div>
                  <div className="p-3">
                    <p className="font-medium truncate">Receipt #{i + 1}</p>
                    <p className="text-sm text-muted-foreground">{`May ${15 - i}, 2025`}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-bold">${(Math.random() * 200 + 50).toFixed(2)}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        {i % 3 === 0 ? 'Bronze' : i % 3 === 1 ? 'Silver' : 'Gold'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card shadow-sm rounded-lg p-6 border">
            <h3 className="text-lg font-medium mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">May 15, 2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Mint</td>
                    <td className="px-4 py-3 text-sm">Receipt NFT #12</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">May 12, 2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Mint</td>
                    <td className="px-4 py-3 text-sm">Receipt NFT #11</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">May 8, 2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Mint</td>
                    <td className="px-4 py-3 text-sm">Receipt NFT #10</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;