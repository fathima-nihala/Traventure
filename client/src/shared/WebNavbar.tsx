import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/logos/logo-transparent.png';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { RootState, AppDispatch } from '../redux/store'; // Import AppDispatch type
import { logout } from '../redux/slices/authSlice';

interface NavItem {
  label: string;
  href: string;
}

const WebNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const navItems: NavItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'Packages', href: '#packages' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact Us', href: '#contact' }
  ];

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (href: string): void => {
    setIsMenuOpen(false);
    console.log(`Navigating to: ${href}`);
  };

  const handleLogout = (): void => {
    dispatch(logout()); // This should now work without TypeScript errors
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <a href="/home" className="flex-shrink-0 flex items-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img src={Logo} alt="Tranventure Logo" className="h-full object-contain" />
            </div>
            <span className="ml-3 text-xl font-bold text-[#16baa5]">
              Tranventure
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-blue-600 cursor-pointer px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
              >
                {item.label}
              </button>
            ))}

            {/* Login/Logout (Desktop) */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 flex items-center justify-center cursor-pointer hover:text-red-600 text-sm font-medium transition-colors duration-200"
                  >
                    <AccountCircleOutlinedIcon />

                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="text-gray-700 flex items-center justify-center hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                >
                  <AccountCircleOutlinedIcon />
                  <span>Login</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium w-full text-left rounded-md transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}

          {/* Login/Logout (Mobile) */}
          {isAuthenticated ? (
            <div className="px-3 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer space-x-2 text-gray-700 hover:text-red-600 hover:bg-gray-50  py-2 text-base font-medium w-full text-left rounded-md transition-colors duration-200"
              >
                <AccountCircleOutlinedIcon />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center cursor-pointer space-x-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 text-base font-medium w-full text-left rounded-md transition-colors duration-200"
            >
              <AccountCircleOutlinedIcon />
              <span>Login</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default WebNavbar;