import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create logs directory if it doesn't exist
    const logsDir = join(process.cwd(), 'logs');
    try {
      await writeFile(join(logsDir, file.name), buffer);
    } catch (error) {
      // If directory doesn't exist, create it and try again
      if (error.code === 'ENOENT') {
        await mkdir(logsDir, { recursive: true });
        await writeFile(join(logsDir, file.name), buffer);
      } else {
        throw error;
      }
    }

    return NextResponse.json({ 
      message: 'File saved successfully',
      fileName: file.name 
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    );
  }
} 