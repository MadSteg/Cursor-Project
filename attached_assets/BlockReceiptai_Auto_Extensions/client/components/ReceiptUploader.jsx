import React, { useState } from 'react';

export default function ReceiptUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await fetch('/api/upload-receipt', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-4">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Receipt</button>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
