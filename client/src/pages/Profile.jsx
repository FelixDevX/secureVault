import React, { useContext, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiCamera, FiFolder, FiLock as FiL } from 'react-icons/fi';

const Profile = () => {
  const { user, setUser, refreshUser } = useContext(AuthContext);
  const [updating, setUpdating] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || ''
    }
  });

  const newPassword = watch('newPassword', '');

  // Resolve profile image URL
  const getProfileImageSrc = () => {
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
      return user.profileImage;
    }
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const serverUrl = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
    return `${serverUrl}${user.profileImage}`;
  };

  const avatarSrc = getProfileImageSrc();

  // Handle profile image upload
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Limit size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile image must be less than 5MB');
        return;
      }

      setImgUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const response = await api.put('/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          setUser(response.data.user);
          toast.success('Profile picture updated successfully!');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        const msg = error.response?.data?.message || 'Failed to upload profile picture';
        toast.error(msg);
      } finally {
        setImgUploading(false);
      }
    }
  };

  // Handle form updates (name, password)
  const onSubmit = async (data) => {
    setUpdating(true);
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.newPassword && data.newPassword.trim() !== '') {
      formData.append('newPassword', data.newPassword);
    }

    try {
      const response = await api.put('/profile', formData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        // Reset password fields
        reset({
          name: response.data.user.name,
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar title="Profile Settings" />

        {/* Profile Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Manage Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Profile Card & Avatar Frame */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-6 rounded-3xl shadow-sm text-center flex flex-col items-center">
                <div className="relative group mb-4">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name ? user.name.substring(0, 2).toUpperCase() : 'SV'
                    )}
                    {imgUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imgUploading}
                    className="absolute -bottom-1.5 -right-1.5 p-2 bg-indigo-600 text-white rounded-xl shadow-lg border-2 border-white dark:border-gray-900 cursor-pointer hover:bg-indigo-755 transition-all"
                  >
                    <FiCamera size={14} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{user?.email}</p>

                {/* Account Details Box */}
                <div className="w-full mt-6 bg-gray-50/50 dark:bg-gray-850/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/80 space-y-3.5 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    <FiFolder className="text-indigo-500" />
                    <span>Locker Count: {user?.totalFiles || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    <FiLock className="text-indigo-500" />
                    <span>Server: Local Encryption</span>
                  </div>
                </div>
              </div>

              {/* Edit Details Form */}
              <div className="md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800/85 mb-5">
                  Update Account Details
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        disabled={updating}
                        placeholder="John Doe"
                        className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                          errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                        }`}
                        {...register('name', { required: 'Name is required' })}
                      />
                    </div>
                    {errors.name && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.name.message}</span>}
                  </div>

                  {/* Email field (readonly) */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full bg-gray-100/50 dark:bg-gray-850/50 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Password section */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 mt-6">
                    <h4 className="text-xs font-bold text-gray-850 dark:text-gray-300 mb-3">Change Account Password</h4>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4">Leave these fields blank if you do not wish to update your password.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">New Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="password"
                            placeholder="Min. 6 chars"
                            disabled={updating}
                            className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                              errors.newPassword ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                            }`}
                            {...register('newPassword', {
                              minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                          />
                        </div>
                        {errors.newPassword && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.newPassword.message}</span>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Confirm New Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="password"
                            placeholder="Confirm password"
                            disabled={updating}
                            className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                              errors.confirmPassword ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                            }`}
                            {...register('confirmPassword', {
                              validate: (val) => val === newPassword || 'Passwords do not match'
                            })}
                          />
                        </div>
                        {errors.confirmPassword && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.confirmPassword.message}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-150 dark:border-gray-800 text-right">
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ml-auto"
                    >
                      {updating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Profile Details</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
