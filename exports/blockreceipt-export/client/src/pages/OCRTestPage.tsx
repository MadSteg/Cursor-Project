import React, { useState } from 'react';

interface OCRResult {
  merchantName: string;
  date: string;
  total: number;
  subtotal: number;
  tax: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
  confidence: number;
  ocrEngine: string;
  category?: string;
  rawText?: string;
}

const OCRTestPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    googleVision?: OCRResult;
    tesseract?: OCRResult;
    combined?: OCRResult;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'combined' | 'googleVision' | 'tesseract'>('combined');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a receipt image to process');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('receiptImage', file);
      formData.append('testAllEngines', 'true');

      const response = await fetch('/api/ocr-test', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process receipt');
      }

      setResults({
        googleVision: data.googleVision,
        tesseract: data.tesseract,
        combined: data.combined,
      });
    } catch (err: any) {
      setError(err.message || 'Error processing the receipt image');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderResultSection = (result: OCRResult | undefined, engine: string) => {
    if (!result) return <p>No results from {engine}</p>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Merchant</h4>
              <p className="text-lg font-semibold">{result.merchantName}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
              <p>{result.date}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
              <p>{result.category || 'Uncategorized'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">OCR Engine</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {result.ocrEngine}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Total</h4>
              <p className="text-lg font-semibold">${result.total.toFixed(2)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Subtotal</h4>
              <p>${result.subtotal.toFixed(2)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Tax</h4>
              <p>${result.tax.toFixed(2)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Confidence</h4>
              <div className="flex items-center">
                <div className="w-full bg-secondary rounded-full h-2.5 mr-2">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                  ></div>
                </div>
                <span className="text-sm">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {result.items && result.items.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Items</h4>
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {result.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {item.category || 'Other'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                        ${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {result.rawText && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Raw Text</h4>
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-xs whitespace-pre-wrap">{result.rawText}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">OCR Test Tool</h1>
      <p className="text-muted-foreground mb-6">
        Test our enhanced multi-engine OCR system for receipt processing
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card shadow-sm rounded-lg p-6 border sticky top-20">
            <h3 className="text-lg font-medium mb-4">Receipt Upload</h3>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="ocr-test-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="ocr-test-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-muted-foreground mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : 'Click to select receipt image'}
                  </p>
                </label>
              </div>
              
              {file && (
                <div className="text-center text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              )}
              
              <button
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                onClick={handleProcess}
                disabled={!file || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  'Process Receipt'
                )}
              </button>
              
              <div className="text-xs text-muted-foreground mt-2">
                <p>This will process the image with:</p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Google Cloud Vision OCR</li>
                  <li>Tesseract.js OCR</li>
                  <li>Combined results with fallback</li>
                </ul>
              </div>
              
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {results ? (
            <>
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'combined'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('combined')}
                >
                  Combined Results
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'googleVision'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('googleVision')}
                >
                  Google Vision
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'tesseract'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('tesseract')}
                >
                  Tesseract
                </button>
              </div>
              
              <div className="bg-card shadow-sm rounded-lg p-6 border">
                {activeTab === 'combined' && renderResultSection(results.combined, 'Combined OCR')}
                {activeTab === 'googleVision' && renderResultSection(results.googleVision, 'Google Vision')}
                {activeTab === 'tesseract' && renderResultSection(results.tesseract, 'Tesseract.js')}
              </div>
            </>
          ) : (
            <div className="bg-card shadow-sm rounded-lg p-6 border h-96 flex flex-col items-center justify-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-muted-foreground/30 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Upload a receipt image and click "Process Receipt" to test our multi-engine OCR system
                with enhanced fallback mechanisms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRTestPage;