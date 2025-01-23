'use client';

import { useState, useCallback, useEffect } from 'react';
import { FiImage } from 'react-icons/fi';
import axios from 'axios';
import Canvas from './Canvas';
import type { TextLayer } from './Canvas';

interface ImageUploaderProps {
  onUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageState, setImageState] = useState<{ url: string | null }>({ url: null });
  const [layers] = useState<TextLayer[]>([]);

  // Function to handle the actual upload to backend
  const processImage = useCallback(async (base64Image: string) => {
    try {
      console.log('Starting image processing...');
      setIsProcessing(true);
      setError(null);

      const response = await axios.post('/api/remove-bg', {
        image: base64Image
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        console.log('Image processed successfully');
        const processedImage = response.data.processedImage;
        setImageState({ url: processedImage });
        onUpload(processedImage);
      } else {
        throw new Error(response.data?.error || 'Failed to process image');
      }

    } catch (error) {
      console.error('Error processing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      if (axios.isAxiosError(error)) {
        console.error('Server response:', error.response?.data);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [onUpload]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Increase max size to 20MB
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('Image size should be less than 20MB');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsProcessing(true);
        
        const reader = new FileReader();
        reader.onload = async () => {
          if (typeof reader.result === 'string') {
            try {
              // First show the original image
              setImageState({ url: reader.result });
              // Then start processing
              await processImage(reader.result);
            } catch (processError) {
              console.error('Error during image processing:', processError);
              setError(processError instanceof Error ? processError.message : 'Failed to process image');
              setIsProcessing(false);
            }
          }
        };
        reader.onerror = () => {
          setError('Error reading file');
          setIsProcessing(false);
        };
        reader.readAsDataURL(selectedFile);
      } catch (err) {
        console.error('Error during upload:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsProcessing(false);
      } finally {
        setLoading(false);
      }
    }
  }, [processImage]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {!imageState.url ? (
        <div className="text-center p-8 rounded-2xl bg-[#141519]/80 backdrop-blur-lg border border-[#585B7A]/40 cursor-pointer hover:bg-white/5 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="imageInput"
          />
          <label 
            htmlFor="imageInput"
            className="cursor-pointer"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#8692FE]/10 flex items-center justify-center">
              <FiImage className="w-10 h-10 text-[#8692FE]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {loading ? 'Uploading...' : 'Upload Your Image'}
            </h3>
            <p className="text-gray-400 mb-4">Click here to choose a file</p>
            <p className="text-xs text-gray-500">Supports: JPG, PNG, WebP</p>
          </label>
        </div>
      ) : (
        <div className="absolute inset-0">
          <Canvas
            selectedImage={imageState.url}
            layers={layers}
            selectedLayerId={undefined}
            onLayerClick={() => {}}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
}
