import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  deletePrivateImage,
  privatePhotoPath,
  uploadImage,
  uploadPrivateImage,
} from "@/lib/upload";
import { resolveAuthUser } from "@/lib/server-auth";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import { privatePhotoIsReferenced } from "@/lib/private-photo-records";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let isPrivatePhotoUpload = false;
  try {
    const data = await request.formData();
    const suppliedUserId = data.get("userId");
    const rawUploadType = data.get("type");
    const uploadType = typeof rawUploadType === "string" ? rawUploadType : "leads";
    isPrivatePhotoUpload = uploadType === "leads";

    if (!["profile", "logo", "portfolio", "leads"].includes(uploadType)) {
      return NextResponse.json({ error: "Unsupported upload type" }, { status: 400 });
    }

    let resolvedUserId: string;
    let clerkUserId: string;
    if (uploadType === "leads") {
      const identity = await resolveHomeownerIdentity();
      if (!identity.success) {
        return NextResponse.json(
          { error: identity.error },
          { status: identity.status },
        );
      }
      resolvedUserId = identity.user.dbUserId;
      clerkUserId = identity.user.clerkUserId;
    } else {
      const authResult = await resolveAuthUser();
      if ("error" in authResult) {
        return NextResponse.json(
          { error: authResult.error },
          { status: authResult.status },
        );
      }
      resolvedUserId = authResult.user.dbUserId;
      clerkUserId = authResult.user.clerkUserId;
    }

    if (
      suppliedUserId !== null &&
      (typeof suppliedUserId !== "string" ||
        ![resolvedUserId, clerkUserId].includes(suppliedUserId))
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Extract all files from FormData
    const files: File[] = [];
    
    for (const [key, value] of data.entries()) {
      // Accept 'file', 'photos', or keys starting with 'photos'
      if ((key === 'file' || key === 'photos' || key.startsWith('photos')) && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      console.error('[UPLOAD] No files found in FormData. Keys:', Array.from(data.keys()));
      return NextResponse.json({ 
        error: "No files uploaded. Please select at least one image." 
      }, { status: 400 });
    }

    console.log(`[UPLOAD] Processing ${files.length} file(s), type=${uploadType}`);


    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = uploadType === "profile" || uploadType === "logo" ? 1 : 10;

    if (files.length > maxFiles) {
      return NextResponse.json({ 
        error: `Maximum ${maxFiles} files allowed` 
      }, { status: 400 });
    }

    for (const fileItem of files) {
      if (!allowedTypes.includes(fileItem.type)) {
        console.error(`[UPLOAD] Invalid file type: ${fileItem.type} for ${fileItem.name}`);
        return NextResponse.json({ 
          error: `Invalid file type: ${fileItem.type}. Please upload JPEG, PNG, or WebP images only.` 
        }, { status: 400 });
      }
      
      if (fileItem.size > maxSize) {
        const sizeMB = (fileItem.size / (1024 * 1024)).toFixed(2);
        console.error(`[UPLOAD] File too large: ${fileItem.name} (${sizeMB}MB)`);
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
      
      if (uploadType === "leads") {
        uploadedFiles.push(
          await uploadPrivateImage(buffer, resolvedUserId, fileItem.type),
        );
        continue;
      }

      const folderByType: Record<string, string> = {
        profile: `profiles/${resolvedUserId}`,
        logo: `logos/${resolvedUserId}`,
        portfolio: `portfolio/${resolvedUserId}`,
      };
      const folderPath = folderByType[uploadType];
      
      // Generate unique filename with folder path
      const extensionByType: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };
      const filename = `${folderPath}/${uploadType}_${randomUUID()}.${extensionByType[fileItem.type]}`;
      
      console.log(`[UPLOAD] Uploading to Vercel Blob: ${filename} (${buffer.length} bytes)`);
      
      // Upload to Vercel Blob
      const publicUrl = await uploadImage(buffer, filename, fileItem.type);
      
      console.log(`[UPLOAD] Uploaded successfully: ${publicUrl}`);
      
      uploadedFiles.push(publicUrl);
    }

    console.log(`[UPLOAD] Successfully uploaded ${uploadedFiles.length} file(s)`);

    // Return appropriate response based on upload type
    if (uploadType === "profile" || uploadType === "logo") {
      return NextResponse.json({ 
        success: true, 
        url: uploadedFiles[0],
        message: uploadType === "profile"
          ? "Profile picture uploaded successfully"
          : "Business logo uploaded successfully"
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`
      });
    }

  } catch (error) {
    console.error("[UPLOAD] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ 
      error:
        isPrivatePhotoUpload
          ? "Failed to securely upload homeowner photos. Please try again."
          : `Failed to upload files: ${errorMessage}`,
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('file');
    
    if (!fileUrl) {
      return NextResponse.json({ error: "File URL required" }, { status: 400 });
    }

    const privatePath = privatePhotoPath(fileUrl);
    if (privatePath) {
      if (!privatePath.startsWith(`homeowner-photos/${authResult.user.dbUserId}/`)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (await privatePhotoIsReferenced(fileUrl)) {
        return NextResponse.json(
          { error: "Remove the photo from its saved project or job first" },
          { status: 409 },
        );
      }
      await deletePrivateImage(privatePath);
      return NextResponse.json({ success: true, message: "Photo deleted" });
    }

    console.log(`[Upload] Delete requested for: ${fileUrl}`);
    return NextResponse.json({ 
      success: true, 
      message: "File deletion logged (existing public storage objects are not deleted)"
    });

  } catch (error) {
    console.error("[Upload] Delete error:", error);
    return NextResponse.json({ 
      error: "Failed to delete file" 
    }, { status: 500 });
  }
}