
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  images: string[];
  onUpload: (files: File[]) => Promise<void>;
  onRemove: (index: number) => void;
  progress: number;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onUpload,
  onRemove,
  progress,
  maxImages = 5,
}) => {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }
    
    await onUpload(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Upload ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <ImagePlus className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Add Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </div>
      
      {progress > 0 && progress < 100 && (
        <Progress value={progress} className="w-full" />
      )}
    </div>
  );
};

export default ImageUpload;
