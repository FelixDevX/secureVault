import React from 'react';
import { FiX, FiFile, FiDownload } from 'react-icons/fi';

const PreviewModal = ({ isOpen, onClose, file, blobUrl, onDownload }) => {
  if (!isOpen || !file) return null;

  const isImage = file.fileType.startsWith('image/');
  const isPdf = file.fileType === 'application/pdf';
  const isVideo = file.fileType.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-4xl h-[85vh] shadow-2xl p-6 relative flex flex-col animate-in fade-in zoom-in-95 duration-250">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/80 mb-4 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[300px] sm:max-w-[500px]">
              Decrypted Preview: {file.originalFileName}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase mt-0.5">
              Type: {file.fileType} • Size: {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
              title="Download Decrypted File"
            >
              <FiDownload size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Content Preview Frame */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-800/60 overflow-hidden flex items-center justify-center relative p-2 sm:p-4">
          {isImage && (
            <img
              src={blobUrl}
              alt={file.originalFileName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          )}

          {isPdf && (
            <iframe
              src={blobUrl}
              title={file.originalFileName}
              className="w-full h-full border-0 rounded-lg"
            />
          )}

          {isVideo && (
            <video
              src={blobUrl}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}

          {!isImage && !isPdf && !isVideo && (
            <div className="text-center p-8">
              <FiFile size={72} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Preview Not Available
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                This file type ({file.fileType}) cannot be rendered directly in the browser. You can still download the decrypted version.
              </p>
              <button
                onClick={onDownload}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <FiDownload size={14} />
                <span>Download Plaintext File</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
