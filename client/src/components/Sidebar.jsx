import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiDatabase, FiUser, FiLogOut, FiLock } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Brand & Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
          <FiLock size={20} className="animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight leading-tight">SecureVault</h1>
          <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">Safe locker</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 space-y-1.5">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-600 dark:from-indigo-950/30 dark:to-indigo-900/10 dark:text-indigo-400 border-l-4 border-indigo-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-white border-l-4 border-transparent'
            }`
          }
        >
          <FiDatabase size={18} />
          <span>My Locker</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-600 dark:from-indigo-950/30 dark:to-indigo-900/10 dark:text-indigo-400 border-l-4 border-indigo-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-white border-l-4 border-transparent'
            }`
          }
        >
          <FiUser size={18} />
          <span>Profile Settings</span>
        </NavLink>
      </nav>

      {/* Storage stats */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50">
        <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
          <span>Protected Files</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">{user?.totalFiles || 0}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.min((user?.totalFiles || 0) * 10, 100)}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">AES-256-GCM Military Grade</p>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800/60">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all duration-200 cursor-pointer"
        >
          <FiLogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
