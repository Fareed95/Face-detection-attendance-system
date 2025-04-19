import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '.jpg';
    
    // Save to public directory
    await writeFile(
      path.join(process.cwd(), 'public/snapshots/' + filename),
      buffer
    );

    // Return the public URL
    return NextResponse.json({ 
      url: `/snapshots/${filename}`
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 