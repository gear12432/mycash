'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  accept?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  helperText?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  accept = 'image/*,application/pdf',
  file,
  onChange,
  error,
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      onChange(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full text-left space-y-1.5">
      <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed ${
            error ? 'border-red-400 bg-red-50/50' : 'border-gray-300 hover:border-[#397EF5] bg-gray-50/50 hover:bg-blue-50/20'
          } rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#397EF5] flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#20244F]">
              Click to upload photo/document
            </p>
            <p className="text-[11px] text-gray-500">JPG, PNG or PDF (Max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={label}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 text-[#397EF5] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#20244F] truncate">{file.name}</p>
              <p className="text-[10px] text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-600 hover:text-[#397EF5] hover:bg-white rounded-lg transition-colors"
              title="Replace document"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-500 font-medium pl-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 pl-1">{helperText}</p>
      ) : null}
    </div>
  );
};
