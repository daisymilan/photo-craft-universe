
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { triggerWebhook } from "@/utils/webhookService";

export const PhotoUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsProcessing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageData = reader.result as string;
          setPreview(imageData);
          
          // Trigger webhook for image upload
          await triggerWebhook("image_uploaded", {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            timestamp: new Date().toISOString()
          });
          
          toast.success("Photo uploaded and processed successfully! Select a template to continue.");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Failed to process image. Please try again.");
        console.error("Error processing image:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative overflow-hidden transition-all duration-300 ease-out 
          ${
            isDragActive
              ? "bg-violet-50 border-violet-300"
              : "bg-white hover:bg-gray-50"
          }
          border-2 border-dashed rounded-xl p-12 cursor-pointer
          flex flex-col items-center justify-center gap-4
          animate-fade-in backdrop-blur-sm
          ${isProcessing ? 'pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <p className="text-sm text-gray-500">Processing your image...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full max-w-md aspect-video">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg shadow-lg animate-fade-up"
            />
            <p className="mt-4 text-sm text-gray-500 text-center">
              Image uploaded! Choose a template below to continue.
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center">
              <Upload
                className={`w-8 h-8 ${
                  isDragActive ? "text-violet-600" : "text-violet-500"
                }`}
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Upload your photo
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Supports PNG, JPG up to 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
