/**
 * File Uploader Component
 */
import React, { useCallback } from 'react';
import { useAppStore } from '../../stores/app';

export const FileUploader: React.FC = () => {
  const { setDocument, setUI } = useAppStore();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';

    setDocument({
      type,
      file,
      currentPage: 1,
      totalPages: type === 'pdf' ? 0 : 1
    });

    // Close sidebar
    setUI({ sidebar: null });
  }, [setDocument, setUI]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const type = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';

    setDocument({
      type,
      file,
      currentPage: 1,
      totalPages: type === 'pdf' ? 0 : 1
    });

    setUI({ sidebar: null });
  }, [setDocument, setUI]);

  return (
    <div
      className="flex flex-col items-center justify-center h-full p-8"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">📄🖼️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Drop PDF or Image
        </h2>
        <p className="text-gray-500 mb-6">
          or click to browse
        </p>
        
        <label className="inline-block">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            Choose File
          </span>
        </label>
      </div>

      <div className="mt-8 text-sm text-gray-400">
        Supported: PDF, PNG, JPG, WEBP
      </div>
    </div>
  );
};
