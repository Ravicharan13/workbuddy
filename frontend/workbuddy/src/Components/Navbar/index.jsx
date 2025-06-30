import { useState } from 'react';
import { Moon, Sun, Menu, X, CircleUserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
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
            <Link to="/" className="text-gray-700 dark:text-gray-300 duration-300 hover:text-gray-500 dark:hover:text-gray-500">Home</Link>
            <Link to="/requests" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link>
            <Link to="/messages" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
            <Link to="/earnings" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Earnings</Link>
            <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
          </div>

          {/* Right Side: Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-0 text-gray-700 dark:text-gray-300">
              <CircleUserRound className="w-7 h-6" />
              <p>User</p>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

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
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden z-50 text-base font-medium space-y-2 px-4 py-4">
            <Link to="/" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Home</Link>
            <Link to="/requests" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link>
            <Link to="/messages" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
            <Link to="/earnings" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Earnings</Link>
            <Link to="/profile" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
