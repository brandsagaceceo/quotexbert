import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    // For demo purposes, we'll skip authentication
    // In production, you would validate the user session here

    const data = await request.formData();
    const files: File[] = [];
    
    // Extract files from FormData
    for (const [key, value] of data.entries()) {
      if (key.startsWith('photos') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 10;

    if (files.length > maxFiles) {
      return NextResponse.json({ 
        error: `Maximum ${maxFiles} files allowed` 
      }, { status: 400 });
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP` 
        }, { status: 400 });
      }
      
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: `File ${file.name} is too large. Maximum size is 5MB` 
        }, { status: 400 });
      }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'leads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Upload files
    const uploadedFiles = [];
    
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `demo_${timestamp}_${Math.random().toString(36).substring(2)}.${extension}`;
      
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      
      // Store relative path for database
      uploadedFiles.push(`/uploads/leads/${filename}`);
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload files" 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For demo purposes, we'll skip authentication
    // In production, you would validate the user session here

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');
    
    if (!filePath) {
      return NextResponse.json({ error: "File path required" }, { status: 400 });
    }

    // Security: ensure file is in the uploads directory
    if (!filePath.startsWith('/uploads/leads/')) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 403 });
    }

    const fullPath = join(process.cwd(), 'public', filePath);
    
    if (existsSync(fullPath)) {
      const { unlink } = await import('fs/promises');
      await unlink(fullPath);
      return NextResponse.json({ success: true, message: "File deleted" });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ 
      error: "Failed to delete file" 
    }, { status: 500 });
  }
}