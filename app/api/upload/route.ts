import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    const userId = data.get('userId') as string;
    const uploadType = data.get('type') as string; // 'profile', 'portfolio', or 'leads'
    
    // Handle multiple files for leads (legacy support)
    const files: File[] = [];
    if (file) {
      files.push(file);
    } else {
      // Extract files from FormData for leads
      for (const [key, value] of data.entries()) {
        if (key.startsWith('photos') && value instanceof File) {
          files.push(value);
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = uploadType === 'profile' ? 1 : 10;

    if (files.length > maxFiles) {
      return NextResponse.json({ 
        error: `Maximum ${maxFiles} files allowed` 
      }, { status: 400 });
    }

    for (const fileItem of files) {
      if (!allowedTypes.includes(fileItem.type)) {
        return NextResponse.json({ 
          error: `Invalid file type: ${fileItem.type}. Allowed: JPEG, PNG, WebP` 
        }, { status: 400 });
      }
      
      if (fileItem.size > maxSize) {
        return NextResponse.json({ 
          error: `File ${fileItem.name} is too large. Maximum size is 5MB` 
        }, { status: 400 });
      }
    }

    // Create upload directory based on type
    let uploadDir;
    if (uploadType === 'profile' && userId) {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles', userId);
    } else if (uploadType === 'portfolio' && userId) {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'portfolio', userId);
    } else {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'leads');
    }
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Upload files
    const uploadedFiles = [];
    
    for (const fileItem of files) {
      const bytes = await fileItem.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = fileItem.name.split('.').pop();
      const filename = `${uploadType || 'file'}_${timestamp}_${Math.random().toString(36).substring(2)}.${extension}`;
      
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      
      // Store relative path for database
      let relativePath;
      if (uploadType === 'profile' && userId) {
        relativePath = `/uploads/profiles/${userId}/${filename}`;
      } else if (uploadType === 'portfolio' && userId) {
        relativePath = `/uploads/portfolio/${userId}/${filename}`;
      } else {
        relativePath = `/uploads/leads/${filename}`;
      }
      
      uploadedFiles.push(relativePath);
    }

    // Return appropriate response based on upload type
    if (uploadType === 'profile') {
      return NextResponse.json({ 
        success: true, 
        url: uploadedFiles[0],
        message: "Profile picture uploaded successfully"
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`
      });
    }

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload files" 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');
    
    if (!filePath) {
      return NextResponse.json({ error: "File path required" }, { status: 400 });
    }

    // Security: ensure file is in the uploads directory
    if (!filePath.startsWith('/uploads/')) {
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