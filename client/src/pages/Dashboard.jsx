import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadModal from '../components/UploadModal';
import PasswordModal from '../components/PasswordModal';
import PreviewModal from '../components/PreviewModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiFile, FiFileText, FiImage, FiVideo, FiTrash2, FiDownload, FiEye, 
  FiFolder, FiShield, FiPlus, FiAlertCircle 
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Selected file details
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordAction, setPasswordAction] = useState('view'); // 'view' or 'download'
  const [decryptedBlobUrl, setDecryptedBlobUrl] = useState('');

  // Fetch files from server
  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      if (response.data.success) {
        setFiles(response.data.files);
      }
    } catch (error) {
      console.error('Fetch files error:', error);
      toast.error('Failed to load files list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Update profile metrics (total files count) whenever file count changes
  const handleUploadSuccess = () => {
    fetchFiles();
    refreshUser();
  };

  const handleDeleteSuccess = () => {
    fetchFiles();
    refreshUser();
  };

  // Triggers password prompt
  const triggerPasswordChallenge = (file, action) => {
    setSelectedFile(file);
    setPasswordAction(action);
    setIsPasswordOpen(true);
  };

  // Performs decryption request to download/stream
  const handlePasswordSubmit = async (password) => {
    const fileId = selectedFile._id || selectedFile.id;
    try {
      // Fetch decrypted file blob using password header
      const res = await api.get(`/download/${fileId}`, {
        headers: {
          'x-file-password': password
        },
        responseType: 'blob'
      });

      const contentType = res.headers['content-type'] || selectedFile.fileType;
      const blob = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      if (passwordAction === 'download') {
        // Trigger browser download
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedFile.originalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Successfully downloaded ${selectedFile.originalFileName}`);
        setIsPasswordOpen(false);
      } else {
        // Prepare preview
        setDecryptedBlobUrl(url);
        setIsPasswordOpen(false);
        setIsPreviewOpen(true);
      }
    } catch (err) {
      console.error('Decryption/Verification failure:', err);
      // Determine error details
      if (err.response?.status === 401) {
        throw new Error('Incorrect Password');
      } else {
        throw new Error('Decryption failed. Please try again.');
      }
    }
  };

  // Clean up object URLs when closing preview
  const handleClosePreview = () => {
    if (decryptedBlobUrl) {
      URL.revokeObjectURL(decryptedBlobUrl);
      setDecryptedBlobUrl('');
    }
    setIsPreviewOpen(false);
    setSelectedFile(null);
  };

  // Delete file
  const handleDelete = async (file) => {
    const fileId = file._id || file.id;
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete "${file.originalFileName}"?`);
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/file/${fileId}`);
      if (res.data.success) {
        toast.success('File deleted successfully');
        handleDeleteSuccess();
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete file');
    }
  };

  // Helper to format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Helper to resolve appropriate icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage className="text-emerald-500" size={20} />;
    if (fileType.startsWith('video/')) return <FiVideo className="text-rose-500" size={20} />;
    if (fileType === 'application/pdf') return <FiFileText className="text-red-500" size={20} />;
    if (fileType.includes('word') || fileType.includes('document')) return <FiFile className="text-blue-500" size={20} />;
    return <FiFile className="text-gray-400" size={20} />;
  };

  // Calculate statistics
  const totalFiles = files.length;
  const totalStorage = files.reduce((acc, curr) => acc + curr.fileSize, 0);

  // Filter files based on search
  const filteredFiles = files.filter(file => 
    file.originalFileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          title="Dashboard" 
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* Welcome Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                Keep your confidential assets secure and accessible anywhere.
              </p>
            </div>
            
            {/* Primary Action Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
            >
              <FiPlus size={16} />
              <span>Upload New File</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FiFolder size={22} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Uploads</p>
                <h3 className="text-xl font-extrabold text-gray-850 dark:text-white mt-0.5">{totalFiles}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FiShield size={22} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Storage Consumed</p>
                <h3 className="text-xl font-extrabold text-gray-850 dark:text-white mt-0.5">{formatBytes(totalStorage)}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FiShield size={22} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Security State</p>
                <h3 className="text-xs font-extrabold text-emerald-500 mt-1">AES-255-GCM Hashed</h3>
              </div>
            </div>
          </div>

          {/* Files Grid / List */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/50 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Protected Files Locker</h3>
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {filteredFiles.length} item(s)
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Scanning vault items...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <FiShield size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-250">No files locked</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
                  {searchTerm ? 'No results found matching your search query.' : 'Your vault is currently empty. Upload files with a password to encrypt them.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="mt-6 flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <FiPlus size={14} />
                    <span>Upload File</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-850/40 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Locked Date</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredFiles.map((file) => (
                      <tr 
                        key={file._id || file.id} 
                        className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors duration-150"
                      >
                        {/* File Name & Icon */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0">
                              {getFileIcon(file.fileType)}
                            </div>
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px] sm:max-w-[300px]">
                              {file.originalFileName}
                            </span>
                          </div>
                        </td>
                        {/* File Size */}
                        <td className="px-6 py-4.5 text-xs text-gray-650 dark:text-gray-400 whitespace-nowrap">
                          {formatBytes(file.fileSize)}
                        </td>
                        {/* File Type */}
                        <td className="px-6 py-4.5 text-xs text-gray-650 dark:text-gray-400 whitespace-nowrap uppercase tracking-wider text-[10px] font-semibold">
                          {file.fileType.split('/')[1] || 'Unknown'}
                        </td>
                        {/* Upload Date */}
                        <td className="px-6 py-4.5 text-xs text-gray-650 dark:text-gray-400 whitespace-nowrap">
                          {new Date(file.uploadDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        {/* Action Buttons */}
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => triggerPasswordChallenge(file, 'view')}
                              className="p-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer"
                              title="Unlock & View"
                            >
                              <FiEye size={15} />
                            </button>
                            <button
                              onClick={() => triggerPasswordChallenge(file, 'download')}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all cursor-pointer"
                              title="Unlock & Download"
                            >
                              <FiDownload size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(file)}
                              className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 rounded-xl transition-all cursor-pointer"
                              title="Delete Locker"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={handleUploadSuccess} 
      />

      <PasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSubmit={handlePasswordSubmit}
        file={selectedFile}
        actionType={passwordAction}
      />

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        file={selectedFile}
        blobUrl={decryptedBlobUrl}
        onDownload={() => {
          setPasswordAction('download');
          setIsPreviewOpen(false);
          setIsPasswordOpen(true);
        }}
      />
    </div>
  );
};

export default Dashboard;
