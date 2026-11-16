"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadFieldProps {
  label: string;
  value?: string; // Media ID
  previewUrl?: string; // Current image URL if available
  onChange: (mediaId: string, url: string) => void;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  previewUrl: initialPreview,
  onChange,
  helperText,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to upload image");
      }

      const media = json.data;
      setPreview(media.url);
      onChange(media._id, media.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 bg-gray-50">
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">
            No image
          </div>
        )}
        <div className="flex flex-col gap-1">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#0E7C7B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0b6564] disabled:opacity-50"
          />
          {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
          {helperText && !error && !uploading && (
            <span className="text-xs text-gray-400">{helperText}</span>
          )}
        </div>
      </div>
    </div>
  );
}
