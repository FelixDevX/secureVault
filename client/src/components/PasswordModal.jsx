import React, { useState } from 'react';
import { FiX, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordModal = ({ isOpen, onClose, onSubmit, file, actionType }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !file) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setVerifying(true);
    setErrorMsg('');

    try {
      await onSubmit(password);
      setPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Incorrect password or decryption failure.');
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FiLock size={16} />
            </div>
            <h3 className="text-md font-bold text-gray-900 dark:text-white">Unlock Secure File</h3>
          </div>
          <button 
            onClick={handleClose} 
            disabled={verifying}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Info */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Please enter the password to {actionType === 'view' ? 'preview' : 'download'} the protected file:
          </p>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1 truncate bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
            {file.originalFileName}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter file password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={verifying}
                required
                autoFocus
                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={verifying}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] font-semibold text-red-500 mt-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-200/20 dark:border-red-800/20">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={verifying}
              className="flex-1 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-xl border border-gray-200/50 dark:border-gray-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={verifying}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Decrypting...</span>
                </>
              ) : (
                <span>Decrypt & Open</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
