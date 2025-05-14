/**
 * OCR Testing Routes
 * 
 * This file provides endpoints to test the OCR system directly
 * without going through the full receipt scanning flow.
 */

import { Router } from "express";
import multer from "multer";
import { extractReceiptData } from "../services/ocrService";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

// Create the router
const router = Router();

/**
 * Test the OCR system with an image upload
 * POST /api/ocr-test/upload
 */
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Convert the buffer to base64
    const imageBase64 = req.file.buffer.toString("base64");
    
    // Process the image with our OCR service
    const result = await extractReceiptData(imageBase64);
    
    if (!result) {
      return res.status(500).json({ error: "Failed to extract receipt data" });
    }
    
    // Return the OCR results
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("OCR test error:", error);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

/**
 * Test the OCR system with a base64 image
 * POST /api/ocr-test/process
 */
router.post("/process", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }
    
    // Process the image with our OCR service
    const result = await extractReceiptData(imageBase64);
    
    if (!result) {
      return res.status(500).json({ error: "Failed to extract receipt data" });
    }
    
    // Return the OCR results
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("OCR test error:", error);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

/**
 * Simple HTML form to test the OCR upload
 * GET /api/ocr-test
 */
router.get("/", (req, res) => {
  const htmlForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>BlockReceipt OCR Test</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 {
          color: #2563eb;
          margin-bottom: 24px;
        }
        .form-container {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          background-color: #f9fafb;
        }
        .form-field {
          margin-bottom: 16px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        button:hover {
          background-color: #1d4ed8;
        }
        #result {
          margin-top: 24px;
          white-space: pre-wrap;
        }
        #image-preview {
          margin-top: 16px;
          max-width: 100%;
          max-height: 300px;
          display: none;
        }
      </style>
    </head>
    <body>
      <h1>BlockReceipt OCR Test Tool</h1>
      <div class="form-container">
        <h2>Upload Receipt Image</h2>
        <form id="upload-form" enctype="multipart/form-data">
          <div class="form-field">
            <label for="image">Select a receipt image:</label>
            <input type="file" id="image" name="image" accept="image/*" required>
          </div>
          <img id="image-preview" src="" alt="Image preview">
          <div class="form-field">
            <button type="submit">Process Receipt</button>
          </div>
        </form>
      </div>
      
      <div id="result-container">
        <h2>OCR Result</h2>
        <div id="result">Upload an image to see results</div>
      </div>
      
      <script>
        // Preview the image when selected
        document.getElementById('image').addEventListener('change', function(event) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              const preview = document.getElementById('image-preview');
              preview.src = e.target.result;
              preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
          }
        });
        
        // Handle form submission
        document.getElementById('upload-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const resultDiv = document.getElementById('result');
          resultDiv.textContent = 'Processing...';
          
          const formData = new FormData(this);
          
          try {
            const response = await fetch('/api/ocr-test/upload', {
              method: 'POST',
              body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
              resultDiv.innerHTML = '<h3>Extracted Data:</h3>' + 
                '<pre>' + JSON.stringify(result.data, null, 2) + '</pre>';
            } else {
              resultDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
            }
          } catch (error) {
            resultDiv.textContent = 'Error: ' + error.message;
          }
        });
      </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlForm);
});

export default router;