import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/logos/logo-transparent.png';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { RootState, AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { getPackages } from '../redux/slices/packageSlice';

interface NavItem {
  label: string;
  href: string;
}

const WebNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { packages } = useSelector((state: RootState) => state.package);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Remaining', href: '/remaining' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setShowPackageDropdown(false);
    navigate(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    setShowPackageDropdown(false);
  };

  const handlePackagesClick = () => {
    setShowPackageDropdown((prev) => !prev);
    if (!packages.length) dispatch(getPackages({}));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPackageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile toggle */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-10 w-10" />
            <span className="ml-2 text-xl font-bold text-[#16baa5]">Tranventure</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Packages Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handlePackagesClick}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                Packages
              </button>
              {showPackageDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-white border rounded shadow z-50">
                  {packages.length > 0 ? (
                    packages.map((pkg) => (
                      <button
                        key={pkg._id}
                        onClick={() => {
                          navigate(`/packages/${pkg._id}`);
                          setShowPackageDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {pkg.toLocation}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500">No packages found</p>
                  )}
                </div>
              )}
            </div>

            {/* Other links */}
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}

            {/* Auth */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 flex items-center hover:text-red-600"
              >
                <AccountCircleOutlinedIcon className="mr-1" />
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="text-gray-700 flex items-center hover:text-blue-600"
              >
                <AccountCircleOutlinedIcon className="mr-1" />
                Login
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-2 bg-white border-t">
          {/* Packages */}
          <button
            onClick={handlePackagesClick}
            className="w-full text-left text-gray-700 hover:text-blue-600 text-base font-medium"
          >
            Packages
          </button>
          {showPackageDropdown && (
            <div className="ml-4 space-y-1">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <button
                    key={pkg._id}
                    onClick={() => {
                      navigate(`/packages/${pkg._id}`);
                      setShowPackageDropdown(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {pkg.toLocation}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">No packages found</p>
              )}
            </div>
          )}

          {/* Other links */}
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="w-full text-left text-gray-700 hover:text-blue-600 text-base font-medium"
            >
              {item.label}
            </button>
          ))}

          {/* Auth mobile */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
            >
              <AccountCircleOutlinedIcon />
              <span>Logout</span>
            </button>
          ) : (
            <a
              href="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
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
