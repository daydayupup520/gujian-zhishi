import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File, preview: string) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  isLoading = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewResult = e.target?.result;
      if (typeof previewResult !== 'string') {
        return;
      }

      setPreview(previewResult);
      onImageUpload(file, previewResult);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const files = e.target.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const clearImage = () => {
    setPreview(null);
  };

  const openFileDialog = () => {
    const input = document.getElementById('image-upload');
    if (input instanceof HTMLInputElement) {
      input.click();
    }
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-imperial-gold">
          <img
            src={preview}
            alt="预览"
            className="w-full h-64 object-contain bg-[rgba(15,20,40,0.5)]"
          />
          {!isLoading && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C2416]/30 mx-auto mb-2"></div>
                <p>识别中...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-imperial-gold bg-imperial-gold/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="image-upload"
            data-testid="image-upload-input"
          />
          <div className="cursor-pointer flex flex-col items-center">
            <div className="p-4 bg-imperial-gold/20 rounded-full mb-4">
              {dragActive ? (
                <ImageIcon size={32} className="text-imperial-gold" />
              ) : (
                <Upload size={32} className="text-imperial-gold" />
              )}
            </div>
            <p className="text-lg font-medium mb-2">
              {dragActive ? '松开以上传图片' : '点击或拖拽上传古建筑图片'}
            </p>
            <p className="text-sm text-slate-400">
              支持 JPG、PNG 格式，最大 10MB
            </p>
          </div>
        </button>
      )}
    </div>
  );
};
