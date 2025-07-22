import { useState } from 'react';
import { Moon, Sun, Menu, X, CircleUserRound, UserPen, LogOut, BriefcaseBusiness } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axiosInstance from "../../axiosInstance";
import { House,HeartHandshake, MessageSquareText } from 'lucide-react';

const Navbar = ({ isDark, setIsDark }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const currentRole = user?.role;
  const isLoggedIn = !!user;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    localStorage.clear();
    setUser(null);
    navigate("/customerauth?mode=login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            Work<span className="text-gray-800 md:text-3xl dark:text-white">Buddy</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex md:space-x-8 lg:space-x-20 text-sm font-medium">
            {isLoggedIn && (
              <>
                <Link
                  to={currentRole === "worker" ? "/worker/home" : "/customer/home"}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500"
                >
                  Home
                </Link>

                {currentRole === "worker" ? (
                  <>
                    <Link to="/worker/requests"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link>
                    <Link to="/worker/chat/:chatRoomId"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
                    <Link to="/worker/profile-update"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
                  </>
                ) : (
                  <>
                    <Link to="/customer/services"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Browse Services</Link>
                    <Link to="/customer/services/track-request"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">My Requests</Link>
                    <Link to="/customer/chat/:chatRoomId"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link>
                    <Link to="/customer/profile-update"  className="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="relative hidden lg:block">
                <div className="cursor-pointer flex items-center space-x-6 text-gray-700 dark:text-gray-300">
                  <div className='flex gap-1'>
                    <CircleUserRound className="w-7 h-7" />
                  <span className="text-sm pt-1">{user?.username || 'Login'}</span>
                  </div>

                  {isLoggedIn && <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-gray-800 dark:hover:text-gray-500 duration-300"
                  >
                    <span className="flex gap-1">
                      <LogOut />
                      <span className="font-semibold">Logout</span>
                    </span>
                  </button>}
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Hamburger for Mobile */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden md:px-10 absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 text-base font-medium px-4 py-4 space-y-3">
            <div className='flex gap-1'><House className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /><Link onClick={closeMenu} to={currentRole === "worker" ? "/worker/home" : "/customer/home"} className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Home</Link></div>
            {isLoggedIn && (
              currentRole === "worker" ? (
                <>
                  <div className='flex gap-1'><HeartHandshake className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /><Link onClick={closeMenu} to="/worker/requests"  className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Requests</Link></div>
                  <div className='flex gap-1'><MessageSquareText className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /><Link onClick={closeMenu} to="/worker/chat/:chatRoomId" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link></div>
                  <div className='flex gap-1'><UserPen className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /> <Link onClick={closeMenu} to="/worker/profile-update" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link></div>
                  <div className='flex gap-1'><LogOut className='w-5 text-red-700 dark:text-red-300 hover:text-red-500 dark:hover:text-red-500 ' />  <Link onClick={(e) => {handleLogout();closeMenu();}}  className="block text-red-700 dark:text-red-300 hover:text-red-500 dark:hover:text-red-500">Log Out</Link></div>
                </>
              ) : (
                <>
                  <div className='flex gap-1'><BriefcaseBusiness className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /><Link onClick={closeMenu} to="/customer/services" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Browse Services</Link></div>
                  <div className='flex gap-1'><HeartHandshake className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /><Link onClick={closeMenu} to="/customer/services/track-request" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">My Requests</Link></div>
                  <div className='flex gap-1'><MessageSquareText className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' /><Link onClick={closeMenu} to="/customer/chat/:chatRoomId" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Messages</Link></div>
                  <div className='flex gap-1'><UserPen className='w-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 ' />   <Link onClick={closeMenu} to="/customer/profile-update" className="block text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500">Profile</Link></div>
                  <div className='flex gap-1'><LogOut className='w-5 text-red-700 dark:text-red-300 hover:text-red-500 dark:hover:text-red-500 ' />  <Link onClick={(e) => {handleLogout();closeMenu();}}  className="block text-red-700 dark:text-red-300 hover:text-red-500 dark:hover:text-red-500">Log Out</Link></div>
                </>
              )
            )}
            {!isLoggedIn && (
              <Link onClick={closeMenu} to="/customerauth?mode=login" className="text-green-600 hover:underline">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
