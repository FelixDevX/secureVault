import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Access Your Vault</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">Log in to upload and decrypt secure file lockers</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="••••••••"
                disabled={loading}
                className={`w-full bg-gray-50/50 dark:bg-gray-800/50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 ${
                  errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700/80'
                }`}
                {...register('password', { required: 'Password is required' })}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Entering Vault...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
        </div>

        <GoogleLoginButton text="signin_with" />

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 font-medium">
          New to SecureVault?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
