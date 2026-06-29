"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  value?: string;
  onRemove?: () => void;
}

export function FileUpload({ onUploadSuccess, value, onRemove }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.data && response.data.data && response.data.data.url) {
        let url = response.data.data.url;
        // Make sure it has backend base URL if it's a relative path
        if (url.startsWith('/uploads')) {
          url = `http://localhost:3000${url}`;
        }
        onUploadSuccess(url);
        toast.success("Image uploaded successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 aspect-video flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Replace
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mb-2" />
              <div className="text-sm font-medium">Click to upload image</div>
              <div className="text-xs">SVG, PNG, JPG or GIF (max. 5MB)</div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
