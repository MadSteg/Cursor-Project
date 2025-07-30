import React, { useState } from 'react';

interface ReceiptUploaderProps {
  walletAddress: string;
}

const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ walletAddress }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('receiptImage', file);
      formData.append('walletAddress', walletAddress);

      const response = await fetch('/api/upload-and-mint', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process receipt');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Receipt</h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Drag & drop or click to upload</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Support for JPG, PNG, GIF, PDF up to 10MB
                </p>
              </div>
              <input
                type="file"
                id="receipt-upload"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,application/pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="receipt-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
              >
                Select Receipt
              </label>
            </div>

            {file && (
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-destructive hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive"
                  onClick={() => setFile(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Upload & Mint Receipt NFT'
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="border-t p-6 bg-secondary/30">
            <h3 className="font-semibold mb-3">Receipt Information</h3>
            <div className="bg-card p-4 rounded border">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Merchant</p>
                    <p className="font-medium">{result.data.merchantName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{result.data.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-medium">${result.data.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <p className="font-medium">${result.data.subtotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tax</p>
                    <p className="font-medium">${result.data.tax.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tier</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {result.tier}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">OCR Engine</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {result.data.ocrEngine || 'Unknown'}
                  </div>
                </div>
                {result.data.confidence && (
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${result.data.confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">
                      {(result.data.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
                {result.data.items && result.data.items.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Items</p>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Item
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                          {result.data.items.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground">
                                {item.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground text-right">
                                {item.quantity}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground text-right">
                                ${item.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUploader;