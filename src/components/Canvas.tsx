'use client';

import { useEffect, useRef, useState } from 'react';

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
  textCase: 'normal' | 'uppercase' | 'lowercase';
  isBold?: boolean;
  isItalic?: boolean;
  gradient?: {
    color1: string;
    color2: string;
    angle: number;
  };
}

interface CanvasProps {
  selectedImage: string | null;
  layers: TextLayer[];
  selectedLayerId?: string;
  onLayerClick: (id: string) => void;
  isProcessing: boolean;
}

export default function Canvas({
  selectedImage,
  layers,
  selectedLayerId,
  onLayerClick,
  isProcessing
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageBounds, setImageBounds] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    console.log('Processing state changed:', isProcessing);
  }, [isProcessing]);

  // Draw the image and layers on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Calculate canvas dimensions
      const maxWidth = 800;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;

      const aspectRatio = width / height;
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw text layers first (before the image)
      if (!isProcessing) {
        // Store image bounds for text positioning
        setImageBounds({
          x: 0,
          y: 0,
          width,
          height
        });

        // Draw text layers
        layers.forEach(layer => {
          drawTextLayer(ctx, layer, width, height);
        });
      }

      // Draw original image on top with some transparency
      ctx.globalAlpha = 0.8; // Make the image slightly transparent
      ctx.drawImage(img, 0, 0, width, height);
      ctx.globalAlpha = 1;

      if (isProcessing) {
        // Apply blur effect
        ctx.filter = 'blur(10px)';
        ctx.globalAlpha = 0.7;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        // Add dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);

        // Add loading text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Processing Image...', width / 2, height / 2);
        ctx.font = '16px Arial';
        ctx.fillText('Please wait while we remove the background', width / 2, height / 2 + 30);
      }
    };

    img.onerror = () => {
      console.error('Error loading image');
      setError('Failed to load image');
    };

    img.src = selectedImage;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [selectedImage, isProcessing, layers]);

  const drawTextLayer = (
    ctx: CanvasRenderingContext2D,
    layer: TextLayer,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    // Set text properties
    ctx.font = `${layer.isBold ? 'bold' : ''} ${layer.isItalic ? 'italic' : ''} ${
      layer.fontSize
    }px ${layer.fontFamily}`;
    ctx.fillStyle = layer.color;
    ctx.globalAlpha = layer.opacity;

    // Position text
    const x = layer.x || canvasWidth / 2;
    const y = layer.y || 40;

    // Apply rotation
    if (layer.rotation) {
      ctx.translate(x, y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.translate(-x, -y);
    }

    // Handle gradient if present
    if (layer.gradient) {
      const gradient = ctx.createLinearGradient(x, y - 20, x, y + 20);
      gradient.addColorStop(0, layer.gradient.color1);
      gradient.addColorStop(1, layer.gradient.color2);
      ctx.fillStyle = gradient;
    }

    // Handle text case
    let text = layer.text;
    if (layer.textCase === 'uppercase') text = text.toUpperCase();
    if (layer.textCase === 'lowercase') text = text.toLowerCase();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);

    ctx.restore();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageBounds) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked layer
    const clickedLayer = layers.find(layer => {
      const layerX = layer.x || imageBounds.width / 2;
      const layerY = layer.y || 40;
      
      // Simple hit detection
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return false;

      ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
      const metrics = ctx.measureText(layer.text);
      const width = metrics.width;
      const height = layer.fontSize;

      return (
        x >= layerX - width / 2 &&
        x <= layerX + width / 2 &&
        y >= layerY - height / 2 &&
        y <= layerY + height / 2
      );
    });

    if (clickedLayer) {
      onLayerClick(clickedLayer.id);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full object-contain"
      />
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-medium">Processing Image...</p>
            <p className="text-white/70 text-sm">Please wait while we remove the background</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
