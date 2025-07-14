import { useState } from 'react';
import { Moon, Sun, Menu, X, CircleUserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getRole } from '../SignUp/auth';


const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentRole = getRole();

  const { user, setUser } = useUser(); // ✅ correct usage

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
    setUser(null); // clear context
    navigate("/customerauth?mode=login");
  };

  const isLoggedIn = !!user;

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
            {isLoggedIn && (
                  <>
                    {currentRole === "worker"?<Link
                      to="/worker/home"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                    >
                      Home
                    </Link>:<Link
                      to="/customer/home"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                    >
                      Home
                    </Link>}

                    {currentRole === "worker" ? (
                      <>
                        <Link
                          to="/worker/requests"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Requests
                        </Link>
                        <Link
                          to="/worker/chat/:chatRoomId"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Messages
                        </Link>
                        <Link
                          to="/earnings"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Earnings
                        </Link>
                        <Link
                          to="/worker/profile-update"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/customer/services"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Browse Services
                        </Link>
                        <Link
                          to="/customer/services/track-request"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          My Requests
                        </Link>
                        <Link
                          to="/customer/chat/:chatRoomId"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Messages
                        </Link>
                        <Link
                          to="/customer/profile-update"
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                        >
                          Profile
                        </Link>
                      </>
                    )}
                  </>
                )}

            
          </div>

          {/* Right Side: User Info + Theme + Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block group text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-1 cursor-pointer">
                <CircleUserRound className="w-6 h-6" />
                <span className="text-sm">{user?.username || 'LOGIN'}</span>
              </div>
              {/* Hover Dropdown */}
              {isLoggedIn && (
                <div className="absolute right-0 mt-1 hidden group-hover:block bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
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
            {isLoggedIn && (
              <>
                <Link to="/requests" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link>
                <Link to="/messages" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
                <Link to="/earnings" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Earnings</Link>
                <Link to="/profile" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
              </>
            )}
            {!isLoggedIn ? (
                <Link to="/customerauth?mode=login" className="text-green-600 hover:underline">Login</Link>
              ) : null}

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
