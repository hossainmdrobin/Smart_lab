import { NextRequest } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { dbConnect } from "@/src/lib/db/connect";
import { Media } from "@/src/models/Media";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      throw new ApiError({ code: "BAD_REQUEST", message: "No file provided" });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WEBP.`,
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "File size exceeds the 5MB limit",
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "algolab",
          resource_type: "auto",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(error.message || "Cloudinary upload failed"));
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Cloudinary upload failed without response"));
          }
        }
      );
      uploadStream.end(buffer);
    });

    const media = await Media.create({
      filename: uploadResult.public_id,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: uploadResult.secure_url,
      altText,
      uploadedBy: user.id,
    });

    return sendOk(media, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
