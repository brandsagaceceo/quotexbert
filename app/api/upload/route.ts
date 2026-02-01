import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/upload";

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

    // Upload files to S3
    const uploadedFiles = [];
    
    for (const fileItem of files) {
      const bytes = await fileItem.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Determine the folder path based on upload type
      let folderPath = 'leads';
      if (uploadType === 'profile' && userId) {
        folderPath = `profiles/${userId}`;
      } else if (uploadType === 'portfolio' && userId) {
        folderPath = `portfolio/${userId}`;
      }
      
      // Generate unique filename with folder path
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2);
      const extension = fileItem.name.split('.').pop();
      const filename = `${folderPath}/${uploadType || 'file'}_${timestamp}_${randomStr}.${extension}`;
      
      console.log(`[Upload] Uploading to S3: ${filename} (${buffer.length} bytes)`);
      
      // Upload to S3
      const publicUrl = await uploadImage(buffer, filename, fileItem.type);
      
      console.log(`[Upload] Uploaded successfully: ${publicUrl}`);
      
      uploadedFiles.push(publicUrl);
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
    const fileUrl = searchParams.get('file');
    
    if (!fileUrl) {
      return NextResponse.json({ error: "File URL required" }, { status: 400 });
    }

    // For S3 files, we'll just return success
    // In production, you might want to implement S3 deletion using DeleteObjectCommand
    console.log(`[Upload] Delete requested for: ${fileUrl}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "File deletion logged (S3 cleanup can be implemented separately)" 
    });

  } catch (error) {
    console.error("[Upload] Delete error:", error);
    return NextResponse.json({ 
      error: "Failed to delete file" 
    }, { status: 500 });
  }
}