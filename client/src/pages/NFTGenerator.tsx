import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface CloudImage {
  name: string;
  publicUrl: string;
}

interface Layer {
  name: string;
  traits: {
    name: string;
    file: File | null;
    preview: string;
    weight?: number;
    cloudUrl?: string;
  }[];
}

interface NFTGenerationConfig {
  collectionName: string;
  description: string;
  size: number;
  width: number;
  height: number;
  layers: Layer[];
}

const NFTGenerator: React.FC = () => {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'config' | 'traits' | 'generate' | 'results'>('config');
  const [config, setConfig] = useState<NFTGenerationConfig>({
    collectionName: 'BlockReceipt Collection',
    description: 'A unique collection of NFTs for BlockReceipt',
    size: 10,
    width: 1000,
    height: 1000,
    layers: [],
  });
  const [currentLayer, setCurrentLayer] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResults, setGenerationResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cloudFolders, setCloudFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [cloudImages, setCloudImages] = useState<CloudImage[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [showCloudBrowser, setShowCloudBrowser] = useState(false);

  // Function to add a new layer
  const addLayer = () => {
    setConfig(prev => ({
      ...prev,
      layers: [
        ...prev.layers,
        {
          name: `Layer ${prev.layers.length + 1}`,
          traits: []
        }
      ]
    }));
  };

  // Function to remove a layer
  const removeLayer = (index: number) => {
    setConfig(prev => ({
      ...prev,
      layers: prev.layers.filter((_, i) => i !== index)
    }));
  };

  // Function to update layer name
  const updateLayerName = (index: number, name: string) => {
    setConfig(prev => {
      const newLayers = [...prev.layers];
      newLayers[index] = {
        ...newLayers[index],
        name
      };
      return { ...prev, layers: newLayers };
    });
  };

  // Function to add a trait to a layer
  const addTrait = (layerIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      
      setConfig(prev => {
        const newLayers = [...prev.layers];
        const newTraits = [...newLayers[layerIndex].traits];
        
        newTraits.push({
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          file,
          preview,
          weight: 100
        });
        
        newLayers[layerIndex] = {
          ...newLayers[layerIndex],
          traits: newTraits
        };
        
        return { ...prev, layers: newLayers };
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Function to remove a trait
  const removeTrait = (layerIndex: number, traitIndex: number) => {
    setConfig(prev => {
      const newLayers = [...prev.layers];
      newLayers[layerIndex] = {
        ...newLayers[layerIndex],
        traits: newLayers[layerIndex].traits.filter((_, i) => i !== traitIndex)
      };
      return { ...prev, layers: newLayers };
    });
  };

  // Function to update trait details
  const updateTraitName = (layerIndex: number, traitIndex: number, name: string) => {
    setConfig(prev => {
      const newLayers = [...prev.layers];
      const newTraits = [...newLayers[layerIndex].traits];
      newTraits[traitIndex] = {
        ...newTraits[traitIndex],
        name
      };
      
      newLayers[layerIndex] = {
        ...newLayers[layerIndex],
        traits: newTraits
      };
      
      return { ...prev, layers: newLayers };
    });
  };

  // Function to update trait weight
  const updateTraitWeight = (layerIndex: number, traitIndex: number, weight: number) => {
    setConfig(prev => {
      const newLayers = [...prev.layers];
      const newTraits = [...newLayers[layerIndex].traits];
      newTraits[traitIndex] = {
        ...newTraits[traitIndex],
        weight
      };
      
      newLayers[layerIndex] = {
        ...newLayers[layerIndex],
        traits: newTraits
      };
      
      return { ...prev, layers: newLayers };
    });
  };

  // Function to fetch folders from Google Cloud Storage
  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/nft-generator/folders');
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
      const data = await response.json();
      return data.folders || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch folders');
      return [];
    }
  };

  // Function to fetch images from a specific folder
  const fetchImagesInFolder = async (folder: string) => {
    try {
      const response = await fetch(`/api/nft-generator/images/${folder}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch images');
      return [];
    }
  };
  
  // Function to handle file drag-and-drop
  const handleDrop = (layerIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          addTrait(layerIndex, file);
        }
      });
    }
  };
  
  // Function to add a cloud image as a trait
  const addCloudImageAsTrait = (layerIndex: number, imageUrl: string, imageName: string) => {
    // Create a preview directly from the cloud URL
    setConfig(prev => {
      const newLayers = [...prev.layers];
      const newTraits = [...newLayers[layerIndex].traits];
      
      // Get trait name from the image name (remove path and extension)
      const fileName = imageName.split('/').pop() || '';
      const traitName = fileName.replace(/\.[^/.]+$/, "");
      
      newTraits.push({
        name: traitName,
        file: null, // No local file since it's from cloud
        preview: imageUrl,
        weight: 100,
        cloudUrl: imageUrl
      });
      
      newLayers[layerIndex] = {
        ...newLayers[layerIndex],
        traits: newTraits
      };
      
      return { ...prev, layers: newLayers };
    });
  };

  // Function to handle file selection
  const handleFileSelect = (layerIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          addTrait(layerIndex, file);
        }
      });
    }
  };

  // Function to validate configuration
  const validateConfig = (): string | null => {
    if (!config.collectionName) return "Collection name is required";
    if (config.size <= 0) return "Collection size must be greater than 0";
    if (config.layers.length === 0) return "At least one layer is required";
    
    for (let i = 0; i < config.layers.length; i++) {
      const layer = config.layers[i];
      if (!layer.name) return `Layer ${i + 1} name is required`;
      if (layer.traits.length === 0) return `Layer ${i + 1} requires at least one trait`;
    }
    
    return null;
  };

  // Function to load cloud folders when component mounts
  useEffect(() => {
    const loadFolders = async () => {
      setIsLoadingFolders(true);
      try {
        const folders = await fetchFolders();
        setCloudFolders(folders);
      } catch (error) {
        console.error('Error loading folders:', error);
      } finally {
        setIsLoadingFolders(false);
      }
    };
    
    loadFolders();
  }, []);
  
  // Function to load cloud images when folder is selected
  useEffect(() => {
    if (!selectedFolder) {
      setCloudImages([]);
      return;
    }
    
    const loadImages = async () => {
      setIsLoadingImages(true);
      try {
        const images = await fetchImagesInFolder(selectedFolder);
        setCloudImages(images);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    loadImages();
  }, [selectedFolder]);

  // Function to generate NFTs
  const generateNFTs = async () => {
    const validationError = validateConfig();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare configuration with cloud images
      const configData = {
        collectionName: config.collectionName,
        description: config.description,
        size: config.size,
        width: config.width,
        height: config.height,
        folders: [], // We'll fill this from cloud folders
        useCloudImages: true
      };
      
      // Add folder names to include in generation
      const usedFolders = new Set<string>();
      
      // Add images from traits that have cloudUrl
      config.layers.forEach(layer => {
        layer.traits.forEach(trait => {
          if (trait.cloudUrl) {
            // Extract folder name from the image path (assuming format folder/image.png)
            const parts = trait.cloudUrl.split('/');
            if (parts.length >= 2) {
              const folderName = parts[parts.length - 2];
              usedFolders.add(folderName);
            }
          }
        });
      });
      
      configData.folders = Array.from(usedFolders);
      
      // If no cloud folders were detected, use selected folder
      if (configData.folders.length === 0 && selectedFolder) {
        configData.folders = [selectedFolder];
      }
      
      // Send to backend for processing
      const response = await fetch('/api/nft-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate NFTs');
      }
      
      const data = await response.json();
      setGenerationResults(data.nfts || []);
      setStep('results');
    } catch (err) {
      console.error('Error generating NFTs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to import NFTs to BlockReceipt
  const importToBlockReceipt = async () => {
    try {
      const response = await fetch('/api/nft-generator/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collectionName: config.collectionName,
          nfts: generationResults
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import NFTs');
      }
      
      // Redirect to NFT browser page
      setLocation('/nft-browser');
    } catch (err) {
      console.error('Error importing NFTs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Render configuration step
  const renderConfigStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Collection Configuration</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Collection Name</label>
          <input
            type="text"
            value={config.collectionName}
            onChange={(e) => setConfig({ ...config, collectionName: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="My NFT Collection"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="A unique collection of NFTs..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Collection Size</label>
            <input
              type="number"
              value={config.size}
              onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) || 1 })}
              min="1"
              max="100"
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Number of NFTs to generate</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Width (px)</label>
            <input
              type="number"
              value={config.width}
              onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) || 10 })}
              min="10"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Height (px)</label>
            <input
              type="number"
              value={config.height}
              onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) || 10 })}
              min="10"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setLocation('/nft-browser')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep('traits')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next: Add Layers & Traits
        </button>
      </div>
    </div>
  );

  // Render Cloud Image Browser
  const renderCloudImageBrowser = (layerIndex: number) => (
    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Google Cloud Images</h3>
        <button
          onClick={() => setShowCloudBrowser(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Folder</label>
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isLoadingFolders}
        >
          <option value="">Select a folder</option>
          {cloudFolders.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
      </div>
      
      {isLoadingImages ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading images...</p>
        </div>
      ) : cloudImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cloudImages.map((image, imageIndex) => (
            <div 
              key={imageIndex} 
              className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => addCloudImageAsTrait(layerIndex, image.publicUrl, image.name)}
            >
              <div className="aspect-square bg-white relative flex items-center justify-center">
                <img 
                  src={image.publicUrl} 
                  alt={image.name.split('/').pop() || ''}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs truncate">
                  {image.name.split('/').pop() || ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : selectedFolder ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No images found in this folder</p>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Select a folder to view images</p>
        </div>
      )}
    </div>
  );

  // Render traits step
  const renderTraitsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Layers & Traits</h2>
      <p className="text-gray-600">Define the layers and traits for your NFT collection.</p>
      
      <div className="flex justify-between">
        <button
          onClick={addLayer}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Layer
        </button>
        
        {config.layers.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{config.layers.length}</span> Layers
            <span className="mx-1">•</span>
            <span className="font-medium">
              {config.layers.reduce((acc, layer) => acc + layer.traits.length, 0)}
            </span> Traits
          </div>
        )}
      </div>
      
      {config.layers.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No layers yet. Add your first layer to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {config.layers.map((layer, layerIndex) => (
            <div 
              key={layerIndex} 
              className="border rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex-1">
                  <input
                    type="text"
                    value={layer.name}
                    onChange={(e) => updateLayerName(layerIndex, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </div>
                <div className="ml-4 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {layer.traits.length} {layer.traits.length === 1 ? 'trait' : 'traits'}
                  </span>
                  <button
                    onClick={() => setCurrentLayer(layerIndex)}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2"
                  >
                    Manage Traits
                  </button>
                  <button
                    onClick={() => removeLayer(layerIndex)}
                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              {currentLayer === layerIndex && (
                <div className="p-4">
                  {!showCloudBrowser ? (
                    <div className="flex justify-between mb-4">
                      <button
                        onClick={() => setShowCloudBrowser(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Browse Google Cloud Images
                      </button>
                    </div>
                  ) : renderCloudImageBrowser(layerIndex)}
                
                  <div 
                    className="p-6 border-2 border-dashed rounded-lg text-center mb-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(layerIndex, e)}
                  >
                    <p className="mb-2">Drag & drop image files here</p>
                    <p className="text-sm text-gray-500 mb-2">or</p>
                    <label className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(layerIndex, e)}
                      />
                    </label>
                  </div>
                  
                  {layer.traits.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {layer.traits.map((trait, traitIndex) => (
                        <div key={traitIndex} className="border rounded-lg overflow-hidden">
                          <div className="aspect-square bg-gray-100 relative">
                            <img 
                              src={trait.preview} 
                              alt={trait.name}
                              className="w-full h-full object-contain"
                            />
                            <button
                              onClick={() => removeTrait(layerIndex, traitIndex)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                            >
                              ×
                            </button>
                            {trait.cloudUrl && (
                              <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Cloud
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <input
                              type="text"
                              value={trait.name}
                              onChange={(e) => updateTraitName(layerIndex, traitIndex, e.target.value)}
                              className="w-full p-1 text-sm border rounded mb-1"
                              placeholder="Trait name"
                            />
                            <div className="flex items-center">
                              <label className="text-xs text-gray-500 mr-1">Weight:</label>
                              <input
                                type="number"
                                value={trait.weight || 100}
                                onChange={(e) => updateTraitWeight(layerIndex, traitIndex, parseInt(e.target.value) || 1)}
                                min="1"
                                max="100"
                                className="w-full p-1 text-xs border rounded"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No traits added yet. Add traits by browsing your Google Cloud images or uploading files.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 mt-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep('config')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Back to Configuration
        </button>
        <button
          onClick={() => setStep('generate')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={config.layers.length === 0}
        >
          Next: Generate Collection
        </button>
      </div>
    </div>
  );

  // Render generation step
  const renderGenerateStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generate NFT Collection</h2>
      
      <div className="p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-xl font-medium mb-4">{config.collectionName}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Collection Summary</p>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600">Size:</td>
                  <td className="py-1 font-medium">{config.size} NFTs</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Dimensions:</td>
                  <td className="py-1 font-medium">{config.width}px × {config.height}px</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Layers:</td>
                  <td className="py-1 font-medium">{config.layers.length}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Total Traits:</td>
                  <td className="py-1 font-medium">
                    {config.layers.reduce((acc, layer) => acc + layer.traits.length, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Layer Breakdown</p>
            <div className="space-y-2">
              {config.layers.map((layer, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium">{layer.name}</span>
                  <span className="text-sm text-gray-600">
                    {layer.traits.length} {layer.traits.length === 1 ? 'trait' : 'traits'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep('traits')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
          disabled={isGenerating}
        >
          Back to Traits
        </button>
        <button
          onClick={generateNFTs}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : 'Generate NFT Collection'}
        </button>
      </div>
    </div>
  );

  // Render results step
  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="bg-green-100 text-green-600 rounded-full p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold ml-2">Generation Complete!</h2>
      </div>
      
      <p className="text-gray-600">
        Your NFT collection "{config.collectionName}" has been successfully generated with {generationResults.length} unique NFTs.
      </p>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-medium">Generated NFTs</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {generationResults.slice(0, 10).map((nft, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{nft.name}</p>
                  <p className="text-xs text-gray-500">#{nft.edition}</p>
                </div>
              </div>
            ))}
            {generationResults.length > 10 && (
              <div className="border rounded-lg overflow-hidden flex items-center justify-center aspect-square bg-gray-50">
                <p className="text-sm text-gray-500">
                  +{generationResults.length - 10} more
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep('generate')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Back
        </button>
        
        <div className="space-x-2">
          <button
            onClick={importToBlockReceipt}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Import to BlockReceipt
          </button>
          <button
            onClick={() => setLocation('/nft-browser')}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            View in NFT Browser
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center brand-gradient-text">HashLips NFT Generator</h1>
      
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {['config', 'traits', 'generate', 'results'].map((s, index) => {
            const isActive = step === s;
            const isPast = (
              (step === 'traits' && s === 'config') ||
              (step === 'generate' && ['config', 'traits'].includes(s)) ||
              (step === 'results' && ['config', 'traits', 'generate'].includes(s))
            );
            
            return (
              <React.Fragment key={s}>
                {index > 0 && (
                  <div 
                    className={`flex-1 h-1 mx-2 ${
                      isPast ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div className="relative">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 
                      isPast ? 'bg-blue-600 text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isPast ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span 
                    className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs ${
                      isActive ? 'font-medium' : 'text-gray-500'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white border rounded-lg p-6">
        {step === 'config' && renderConfigStep()}
        {step === 'traits' && renderTraitsStep()}
        {step === 'generate' && renderGenerateStep()}
        {step === 'results' && renderResultsStep()}
      </div>
    </div>
  );
};

export default NFTGenerator;