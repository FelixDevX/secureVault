import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLock, FiMail, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser(data.name, data.email, data.password);
    setLoading(false);
    if (result && result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-xl p-8 animate-in fade-in zoom-in-95 duration-250">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/20 mb-4 animate-bounce">
            <FiLock size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create Locker Space</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">Set up a SecureVault user account</p>
        </div>

        {/* Register form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="John Doe"
                disabled={loading}
                className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                  errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                }`}
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="email@example.com"
                disabled={loading}
                className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                  errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' }
                })}
              />
            </div>
            {errors.email && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                disabled={loading}
                className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                  errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                disabled={loading}
                className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match'
                })}
              />
            </div>
            {errors.confirmPassword && <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Space...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
        </div>

        <GoogleLoginButton text="signup_with" />

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
