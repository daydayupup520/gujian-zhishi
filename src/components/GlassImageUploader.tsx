import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Sparkles } from 'lucide-react';

interface GlassImageUploaderProps {
  onImageUpload: (files: File[], previews: string[]) => void;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 6;

export const GlassImageUploader: React.FC<GlassImageUploaderProps> = ({
  onImageUpload,
  isLoading = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const clearImage = useCallback(() => {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });
    setPreviews([]);
  }, [previews]);

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList).slice(0, MAX_FILES);

    if (files.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      alert('请上传图片文件（单张不超过10MB）');
      return;
    }

    const nextPreviews = validFiles.map((file) => URL.createObjectURL(file));
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });
    setPreviews(nextPreviews);
    onImageUpload(validFiles, nextPreviews);
  }, [onImageUpload, previews]);

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
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles],
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {previews.length > 0 ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl overflow-hidden border border-[rgba(181,137,53,0.35)] shadow-[0_16px_36px_rgba(38,28,12,0.2)] premium-shell"
          >
            <img
              src={previews[0]}
              alt="主视图预览"
              className="w-full h-80 object-contain bg-gradient-to-br from-[#f6efe3] to-[#e9decb]"
            />

            {previews.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-[rgba(247,241,231,0.88)] backdrop-blur-sm p-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {previews.map((preview, index) => (
                    <img
                      key={`preview-${preview}`}
                      src={preview}
                      alt={`视角${index + 1}`}
                      className="h-14 w-20 rounded-md object-cover border border-[#2C2416]/20"
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-400">已选择 {previews.length} 张多角度图片用于融合识别</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-[rgba(15,20,40,0.5)]/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <motion.div className="w-56 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
                    <motion.div
                      className="h-full bg-gradient-to-r from-imperial-gold to-imperial-red"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                  <div className="flex items-center gap-2 text-imperial-gold justify-center">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>AI 正在进行多视角融合识别...</span>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && (
              <motion.button
                type="button"
                onClick={clearImage}
                className="absolute top-4 right-4 p-2 bg-white/5 backdrop-blur-sm text-white rounded-full hover:bg-red-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative group rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 overflow-hidden premium-shell ${
              dragActive
                ? 'border-[#b58935] bg-[#eddcb8]/35'
                : 'border-[#2C2416]/20 bg-white/55 hover:border-[#b58935]/50 hover:bg-white/10/95'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-imperial-gold/5 to-imperial-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="hidden"
              id="image-upload"
            />

            <label htmlFor="image-upload" className="cursor-pointer relative z-10">
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#d8b870] to-[#ad7f2a] flex items-center justify-center shadow-[0_14px_24px_rgba(127,93,30,0.35)]"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(176, 130, 48, 0.22)',
                    '0 0 38px rgba(176, 130, 48, 0.38)',
                    '0 0 20px rgba(176, 130, 48, 0.22)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {dragActive ? <ImageIcon size={40} className="text-white" /> : <Upload size={40} className="text-white" />}
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">
                {dragActive ? '松开以上传' : '上传建筑多角度图片'}
              </h3>

              <p className="text-slate-400 mb-4">
                支持拖拽或点击选择，建议上传正立面、侧立面、细部特写以提升识别精度
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                <span className="px-3 py-1 bg-white/5 rounded-full">最多 6 张</span>
                <span className="px-3 py-1 bg-white/5 rounded-full">JPG/PNG</span>
                <span className="px-3 py-1 bg-white/5 rounded-full">单张≤10MB</span>
              </div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
