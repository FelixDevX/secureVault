import React, { useState, useRef } from 'react';
import { FiX, FiUploadCloud, FiEye, FiEyeOff, FiLock, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    if (!password) {
      toast.error('A file password is required for encryption');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    if (fileName.trim() !== '') {
      formData.append('fileName', fileName.trim());
    }

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'File uploaded and locked successfully!');
        setFile(null);
        setFileName('');
        setPassword('');
        onUploadSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Upload error:', error);
      const msg = error.response?.data?.message || 'File upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Encrypt & Upload File</h3>
          <button 
            onClick={onClose} 
            disabled={uploading}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              file
                ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {file ? (
              <div className="text-center">
                <FiFileText size={40} className="mx-auto text-emerald-500 mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-[300px] truncate">{file.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-center">
                <FiUploadCloud size={40} className="mx-auto text-indigo-500 mb-3" />
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Drag and drop file here, or click to browse</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Images, PDFs, Word, ZIP, Videos up to 100MB</p>
              </div>
            )}
          </div>

          {/* Custom File Name input */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Custom File Name (Optional)</label>
            <input
              type="text"
              placeholder="Leave empty to use original file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={uploading}
              className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          {/* Encryption Password input */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Locker Password (Required)</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Set password to encrypt this file"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={uploading}
                required
                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={uploading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
              We never store your raw password. It is hashed, and used in scrypt key derivation. If forgotten, this file cannot be decrypted.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/60">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-xl border border-gray-200/50 dark:border-gray-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Encrypting & Locking...</span>
                </>
              ) : (
                <span>Encrypt & Upload</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
