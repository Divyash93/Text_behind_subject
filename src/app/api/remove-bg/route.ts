import { NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal';
import sharp from 'sharp';

// Use nodejs runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Set maximum duration to 5 minutes

// Configure headers for SharedArrayBuffer support
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
  });
}

export async function POST(req: Request) {
  // Set CORS headers for the main request
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp'
  };

  try {
    console.log('Starting background removal process...');
    
    // First try to parse the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request body format' 
      }, { 
        status: 400,
        headers 
      });
    }
    
    if (!body.image) {
      console.error('No image data provided');
      return NextResponse.json({ 
        success: false, 
        error: 'No image data provided' 
      }, { 
        status: 400,
        headers 
      });
    }

    if (typeof body.image !== 'string' || !body.image.includes('base64')) {
      console.error('Invalid image format provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid image format. Must be base64 encoded' 
      }, { 
        status: 400,
        headers 
      });
    }

    try {
      // Convert base64 to Buffer
      const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Use Sharp to optimize the input image
      console.log('Optimizing input image...');
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      // Process image with imgly
      console.log('Processing image with imgly...');
      const uint8Array = new Uint8Array(optimizedBuffer);
      const processedBlob = await removeBackground(uint8Array);
      const url = URL.createObjectURL(processedBlob);

      console.log('Background removal completed successfully');
      
      return NextResponse.json({
        success: true,
        imageUrl: url
      }, {
        headers
      });

    } catch (processingError) {
      console.error('Image processing error:', processingError);
      const errorMessage = processingError instanceof Error 
        ? processingError.message 
        : 'Unknown error occurred during image processing';
      return NextResponse.json({ 
        success: false, 
        error: `Image processing failed: ${errorMessage}` 
      }, { 
        status: 500,
        headers
      });
    }

  } catch (error) {
    console.error('Background removal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { 
      status: 500,
      headers
    });
  }
}
