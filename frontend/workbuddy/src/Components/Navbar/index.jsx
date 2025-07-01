import { useState } from 'react';
import { Moon, Sun, Menu, X, CircleUserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const isLoggedIn = !!user;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            <div className="md:text-2xl text-lg font-bold text-gray-500 tracking-tight">
              Work<span className="text-gray-800 md:text-3xl text-xl dark:text-white">Buddy</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-8 lg:space-x-20 text-sm font-medium">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Home</Link>
            {isLoggedIn && (
              <>
                <Link to="/worker/request" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link>
                <Link to="/messages" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
                <Link to="/earnings" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Earnings</Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
              </>
            )}
            {!isLoggedIn && (
              <Link to="/" className="text-green-600 hover:underline">Login</Link>
            )}
          </div>

          {/* Right Side: Theme + User Dropdown + Mobile Button */}
          <div className="flex items-center space-x-4 relative">
            {/* User Icon with Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 cursor-pointer">
                <CircleUserRound className="w-6 h-6" />
                <span className="text-sm">{user?.username || 'Guest'}</span>
              </div>

              {isLoggedIn && dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 z-50 transition-opacity duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-4 space-y-2 bg-white dark:bg-gray-900 shadow-md text-base font-medium">
            <Link to="/" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Home</Link>
            {isLoggedIn && (
              <>
                <Link to="/requests" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link>
                <Link to="/messages" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
                <Link to="/earnings" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Earnings</Link>
                <Link to="/profile" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
                <button onClick={handleLogout} className="block text-red-600 hover:underline">Logout</button>
              </>
            )}
            {!isLoggedIn && (
              <Link to="/" className="text-green-600 hover:underline">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
