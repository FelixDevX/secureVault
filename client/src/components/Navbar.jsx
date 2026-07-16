import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FiSun, FiMoon, FiSearch } from 'react-icons/fi';

const Navbar = ({ searchTerm, setSearchTerm, title }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const getInitials = (name) => {
    if (!name) return 'SV';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getProfileImageSrc = () => {
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
      return user.profileImage;
    }
    // Append server base URL for local storage uploads
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const serverUrl = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
    return `${serverUrl}${user.profileImage}`;
  };

  const avatarSrc = getProfileImageSrc();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between px-6 z-10">
      {/* Title & Search bar */}
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize tracking-wide">{title}</h2>
        
        {setSearchTerm !== undefined && (
          <div className="relative w-64 max-w-md ml-6 md:block hidden">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search secure locker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        )}
      </div>

      {/* User utilities */}
      <div className="flex items-center gap-4">
        {/* Mobile Search input */}
        {setSearchTerm !== undefined && (
          <div className="relative md:hidden block">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-28 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-3 py-1.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        )}

        {/* Theme Toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200/50 dark:border-gray-700/60 cursor-pointer hover:shadow-sm transition-all duration-200"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-800/80">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-800 dark:text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{user?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/10 overflow-hidden shrink-0 border border-gray-200/20">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.name || 'User Avatar'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails, clear it to fallback to initials
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              getInitials(user?.name)
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
