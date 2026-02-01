import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const userId = data.get('userId') as string;
    const uploadType = data.get('type') as string; // 'profile', 'portfolio', or 'leads'
    
    // Extract all files from FormData
    const files: File[] = [];
    
    for (const [key, value] of data.entries()) {
      // Accept 'file', 'photos', or keys starting with 'photos'
      if ((key === 'file' || key === 'photos' || key.startsWith('photos')) && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      console.error('[Upload] No files found in FormData. Keys:', Array.from(data.keys()));
      return NextResponse.json({ 
        error: "No files uploaded. Please select at least one image." 
      }, { status: 400 });
    }

    console.log(`[Upload] Processing ${files.length} file(s)`);


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
        console.error(`[Upload] Invalid file type: ${fileItem.type} for ${fileItem.name}`);
        return NextResponse.json({ 
          error: `Invalid file type: ${fileItem.type}. Please upload JPEG, PNG, or WebP images only.` 
        }, { status: 400 });
      }
      
      if (fileItem.size > maxSize) {
        const sizeMB = (fileItem.size / (1024 * 1024)).toFixed(2);
        console.error(`[Upload] File too large: ${fileItem.name} (${sizeMB}MB)`);
        return NextResponse.json({ 
          error: `File "${fileItem.name}" is ${sizeMB}MB. Maximum size is 5MB per file.` 
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
    
    console.log(`[Upload] Creating directory: ${uploadDir}`);
    
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
      
      console.log(`[Upload] Saved file: ${filename} (${buffer.length} bytes)`);
      
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

    console.log(`[Upload] Successfully uploaded ${uploadedFiles.length} file(s)`);

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
    console.error("[Upload] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ 
      error: `Failed to upload files: ${errorMessage}` 
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