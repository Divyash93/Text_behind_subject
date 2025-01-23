'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { HexColorPicker } from 'react-colorful';
import * as htmlToImage from 'html-to-image';
import { FiImage, FiTrash2, FiDownload } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticlesBackground } from '../../components/ParticlesBackground';
import ImageUploader from '@/components/ImageUploader';

const fontFamilies = [
  'Inter', 'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana',
  'Courier New', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino',
  'Garamond', 'Bookman', 'Tahoma', 'Avant Garde', 'Century Gothic',
  'Copperplate', 'Lucida Grande', 'Lucida Sans', 'Calibri', 'Candara',
  'Franklin Gothic', 'Futura', 'Geneva', 'Optima', 'Segoe UI',
  'Monaco', 'Brush Script MT', 'Cambria', 'Rockwell', 'Symbol'
];

const colorSwatches = [
  '#FFFFFF', // White
  '#8692FE', // Primary Blue
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#000000', // Black
];

export default function EditorPage() {
  const [textSets, setTextSets] = useState<Array<{
    id: string;
    text: string;
    fontSize: number;
    fontFamily: string;
    isBold: boolean;
    isItalic: boolean;
    textCase: string;
    opacity: number;
    rotation: number;
    color: string;
    positionX: number;
    positionY: number;
    useGradient: boolean;
    gradient: {
      color1: string;
      color2: string;
      angle: number;
    };
  }>>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropRatio, setCropRatio] = useState<string>('original');
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cropRatios = [
    { id: 'original', label: 'Original', value: 0 },
    { id: 'square', label: 'Square (1:1)', value: 1 },
    { id: 'portrait', label: 'Portrait (4:5)', value: 0.8 },
    { id: 'landscape', label: 'Landscape (16:9)', value: 1.778 },
    { id: 'story', label: 'Story (9:16)', value: 0.5625 }
  ];

  const handleImageUpload = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
  }, []);

  const getImageStyle = () => {
    if (!imageSize || cropRatio === 'original') {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'contain' as const
      };
    }

    const targetRatio = cropRatios.find(r => r.id === cropRatio)?.value || 1;
    const currentRatio = imageSize.width / imageSize.height;
    
    if (currentRatio > targetRatio) {
      // Image is wider than target ratio - crop width
      const newWidth = imageSize.height * targetRatio;
      const offsetX = (imageSize.width - newWidth) / 2;
      return {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        objectPosition: `${-offsetX}px center`
      };
    } else {
      // Image is taller than target ratio - crop height
      const newHeight = imageSize.width / targetRatio;
      const offsetY = (imageSize.height - newHeight) / 2;
      return {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        objectPosition: `center ${-offsetY}px`
      };
    }
  };

  const handleExport = async () => {
    if (canvasRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(canvasRef.current);
        const link = document.createElement('a');
        link.download = 'text-design.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  };

  const addTextSet = () => {
    if (textSets.length >= 5) {
      alert('Maximum 5 text sets allowed');
      return;
    }
    const newTextSet = {
      id: Date.now().toString(),
      text: 'Edit',
      fontSize: 32,
      fontFamily: 'Inter',
      isBold: false,
      isItalic: false,
      textCase: 'normal',
      opacity: 100,
      rotation: 0,
      color: '#8692FE',
      positionX: 50,
      positionY: 50,
      useGradient: false,
      gradient: {
        color1: '#8692FE',
        color2: '#0000ff',
        angle: 90
      }
    };
    setTextSets([...textSets, newTextSet]);
    setSelectedTextId(newTextSet.id);
  };

  const deleteTextSet = (id: string) => {
    setTextSets(textSets.filter(set => set.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const updateTextSet = (id: string, updates: Partial<typeof textSets[0]>) => {
    setTextSets(textSets.map(set => 
      set.id === id ? { ...set, ...updates } : set
    ));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 relative bg-[#0D0D10]">
        <div className="fixed inset-0 top-24  bg-center [mask-image:linear-gradient(180deg,--background)]" />
        
        {/* Bottom Oval Glow */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[250px] -mb-20 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-[100%] transform scale-x-150" />
          <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-[100%] transform scale-x-150 translate-y-6" />
        </div>

        <div className="container mx-auto max-w-[1600px] px-4">
          <div className="flex flex-col md:flex-row gap-8 py-8">
            {/* Left Column - Canvas */}
            <div className="flex-1 relative space-y-4">
              <div className="flex items-center justify-start gap-2 mb-4">
                {cropRatios.map((ratio) => (
                  <Button
                    key={ratio.id}
                    onClick={() => setCropRatio(ratio.id)}
                    className={`${
                      cropRatio === ratio.id ? 'bg-[#8692FE]' : 'bg-[#141519]/40'
                    } text-sm`}
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex-1 min-h-[700px] relative rounded-xl overflow-hidden bg-[#141519]/80 backdrop-blur-lg border border-[#585B7A]/40">
                <div className="absolute inset-0 z-0">
                  <ParticlesBackground />
                </div>
                <div
                  ref={canvasRef}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {selectedImage ? (
                    <div 
                      className="relative flex items-center justify-center"
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '2rem'
                      }}
                    >
                      <div
                        className="relative"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          aspectRatio: cropRatio === 'original' 
                            ? imageSize ? `${imageSize.width}/${imageSize.height}` : 'auto'
                            : cropRatios.find(r => r.id === cropRatio)?.value || 'auto',
                          width: cropRatio === 'original' ? 'auto' : '100%',
                          height: cropRatio === 'original' ? 'auto' : '100%'
                        }}
                      >
                        <img
                          ref={imageRef}
                          src={selectedImage}
                          alt="Uploaded"
                          style={getImageStyle()}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 z-20"
                          onClick={() => setSelectedImage(null)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                        
                        {textSets.map((textSet) => (
                          <div
                            key={textSet.id}
                            onClick={() => setSelectedTextId(textSet.id)}
                            style={{
                              fontSize: `${textSet.fontSize}px`,
                              fontFamily: textSet.fontFamily,
                              fontWeight: textSet.isBold ? 'bold' : 'normal',
                              fontStyle: textSet.isItalic ? 'italic' : 'normal',
                              textTransform: textSet.textCase as any,
                              opacity: textSet.opacity / 100,
                              transform: `translate(-50%, -50%) translate(${textSet.positionX}%, ${textSet.positionY}%) rotate(${textSet.rotation}deg)`,
                              color: !textSet.useGradient ? textSet.color : 'transparent',
                              backgroundImage: textSet.useGradient 
                                ? `linear-gradient(${textSet.gradient.angle}deg, ${textSet.gradient.color1}, ${textSet.gradient.color2})`
                                : 'none',
                              backgroundClip: textSet.useGradient ? 'text' : 'border-box',
                              WebkitBackgroundClip: textSet.useGradient ? 'text' : 'border-box',
                              position: 'absolute',
                              left: '50%',
                              top: '0%',
                              transition: 'all 0.3s ease',
                              userSelect: 'none',
                              cursor: 'pointer',
                              border: selectedTextId === textSet.id ? '1px dashed white' : 'none',
                              padding: '4px',
                              zIndex: 10,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {textSet.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageUploader
                        onUpload={handleImageUpload}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(URL.createObjectURL(e.target.files[0]))}
                  />
                </div>
              </div>

              {/* Export Button */}
              <Button
                onClick={handleExport}
                className="w-full bg-[#8692FE] hover:bg-[#8692FE]/90 py-6 text-lg mt-4"
              >
                <FiDownload className="w-5 h-5 mr-2" />
                Export Image
              </Button>
            </div>

            {/* Right Column - Controls */}
            <div className="w-full md:w-80 space-y-6">
              {/* Image Upload Section */}
              <div className="mt-12 bg-[#141519]/40 backdrop-blur-sm rounded-xl p-4 border border-[#585B7A]/40">
                <h3 className="text-lg font-medium text-white mb-4">Delete Image</h3>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 z-20"
                  onClick={() => setSelectedImage(null)}
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Text Controls */}
              <div className="bg-[#141519]/40 backdrop-blur-sm rounded-xl p-4 border border-[#585B7A]/40">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Text Sets</h3>
                  <Button
                    onClick={addTextSet}
                    className="width-full bg-[#8692FE] hover:bg-[#6B77E5] text-white"
                    disabled={textSets.length >= 5}
                  >
                    Add Text
                  </Button>
                </div>

                {/* Text Set List */}
                <div className="space-y-2 mb-4">
                  {textSets.map((textSet) => (
                    <div
                      key={textSet.id}
                      className={`flex items-center justify-between p-2 rounded ${
                        selectedTextId === textSet.id ? 'bg-[#8692FE]/20' : 'bg-[#1a1a1a]'
                      }`}
                    >
                      <div
                        className="flex-1 cursor-pointer truncate"
                        onClick={() => setSelectedTextId(textSet.id)}
                      >
                        {textSet.text}
                      </div>
                      <Button
                        onClick={() => deleteTextSet(textSet.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedTextId && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="text">Text Content</Label>
                      <Input
                        id="text"
                        value={textSets.find(set => set.id === selectedTextId)?.text}
                        onChange={(e) => updateTextSet(selectedTextId, { text: e.target.value })}
                        className="bg-[#1a1a1a] border-[#585B7A]/40"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Font Size: {textSets.find(set => set.id === selectedTextId)?.fontSize}px</Label>
                      <input
                        type="range"
                        min="8"
                        max="200"
                        value={textSets.find(set => set.id === selectedTextId)?.fontSize}
                        onChange={(e) => updateTextSet(selectedTextId, { fontSize: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Position X: {textSets.find(set => set.id === selectedTextId)?.positionX}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={textSets.find(set => set.id === selectedTextId)?.positionX}
                        onChange={(e) => updateTextSet(selectedTextId, { positionX: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Position Y: {textSets.find(set => set.id === selectedTextId)?.positionY}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={textSets.find(set => set.id === selectedTextId)?.positionY}
                        onChange={(e) => updateTextSet(selectedTextId, { positionY: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Font Family</Label>
                      <select
                        value={textSets.find(set => set.id === selectedTextId)?.fontFamily}
                        onChange={(e) => updateTextSet(selectedTextId, { fontFamily: e.target.value })}
                        className="w-full px-3 py-2 bg-black/20 rounded text-white"
                      >
                        {fontFamilies.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateTextSet(selectedTextId, { isBold: !textSets.find(set => set.id === selectedTextId)?.isBold })}
                        className={`flex-1 ${textSets.find(set => set.id === selectedTextId)?.isBold ? 'bg-[#8692FE]' : 'bg-black/20'}`}
                      >
                        Bold
                      </Button>
                      <Button
                        onClick={() => updateTextSet(selectedTextId, { isItalic: !textSets.find(set => set.id === selectedTextId)?.isItalic })}
                        className={`flex-1 ${textSets.find(set => set.id === selectedTextId)?.isItalic ? 'bg-[#8692FE]' : 'bg-black/20'}`}
                      >
                        Italic
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Text Case</Label>
                      <select
                        value={textSets.find(set => set.id === selectedTextId)?.textCase}
                        onChange={(e) => updateTextSet(selectedTextId, { textCase: e.target.value })}
                        className="w-full px-3 py-2 bg-black/20 rounded text-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Opacity: {textSets.find(set => set.id === selectedTextId)?.opacity}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={textSets.find(set => set.id === selectedTextId)?.opacity}
                        onChange={(e) => updateTextSet(selectedTextId, { opacity: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-gray-200">Rotation: {textSets.find(set => set.id === selectedTextId)?.rotation}°</Label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={textSets.find(set => set.id === selectedTextId)?.rotation}
                        onChange={(e) => updateTextSet(selectedTextId, { rotation: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="relative">
                      <Label className="text-sm text-gray-200">Color</Label>
                      <div
                        className="w-full h-10 rounded cursor-pointer border border-[#585B7A]/40"
                        style={{ backgroundColor: textSets.find(set => set.id === selectedTextId)?.color }}
                        onClick={() => {
                          updateTextSet(selectedTextId, { useGradient: false });
                          setIsColorPickerOpen(!isColorPickerOpen);
                        }}
                      />
                      {isColorPickerOpen && (
                        <div ref={colorPickerRef} className="absolute z-10 mt-2">
                          <HexColorPicker 
                            color={textSets.find(set => set.id === selectedTextId)?.color} 
                            onChange={(color) => updateTextSet(selectedTextId, { color })}
                          />
                          <div className="mt-2 grid grid-cols-6 gap-1 p-2 bg-[#1a1a1a] rounded border border-[#585B7A]/40">
                            {colorSwatches.map((color) => (
                              <div
                                key={color}
                                className="w-6 h-6 rounded cursor-pointer border border-[#585B7A]/40 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  updateTextSet(selectedTextId, { color });
                                  setIsColorPickerOpen(false);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={textSets.find(set => set.id === selectedTextId)?.useGradient}
                          onChange={(e) => updateTextSet(selectedTextId, { useGradient: e.target.checked })}
                          className="rounded border-[#585B7A]/40"
                        />
                        <span className="text-sm text-gray-200">Use Gradient</span>
                      </label>
                      {textSets.find(set => set.id === selectedTextId)?.useGradient && (
                        <div className="space-y-2 mt-2">
                          <div>
                            <Label className="text-sm text-gray-200">Color 1</Label>
                            <input
                              type="color"
                              value={textSets.find(set => set.id === selectedTextId)?.gradient.color1}
                              onChange={(e) => {
                                const currentGradient = textSets.find(set => set.id === selectedTextId)?.gradient;
                                updateTextSet(selectedTextId, { 
                                  gradient: { 
                                    color1: e.target.value,
                                    color2: currentGradient?.color2 || '#000000',
                                    angle: currentGradient?.angle || 0
                                  } 
                                });
                              }}
                              className="w-full h-8 rounded bg-black/20"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-200">Color 2</Label>
                            <input
                              type="color"
                              value={textSets.find(set => set.id === selectedTextId)?.gradient.color2}
                              onChange={(e) => {
                                const currentGradient = textSets.find(set => set.id === selectedTextId)?.gradient;
                                updateTextSet(selectedTextId, { 
                                  gradient: { 
                                    color1: currentGradient?.color1 || '#000000',
                                    color2: e.target.value,
                                    angle: currentGradient?.angle || 0
                                  } 
                                });
                              }}
                              className="w-full h-8 rounded bg-black/20"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-200">Angle: {textSets.find(set => set.id === selectedTextId)?.gradient.angle}°</Label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={textSets.find(set => set.id === selectedTextId)?.gradient.angle}
                              onChange={(e) => {
                                const currentGradient = textSets.find(set => set.id === selectedTextId)?.gradient;
                                updateTextSet(selectedTextId, { 
                                  gradient: { 
                                    color1: currentGradient?.color1 || '#000000',
                                    color2: currentGradient?.color2 || '#000000',
                                    angle: parseInt(e.target.value)
                                  } 
                                });
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleExport}
                      className="w-full bg-[#8692FE] hover:bg-[#8692FE]/90"
                    >
                      <FiDownload className="w-4 h-4 mr-2" />
                      Export Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
