import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Logo from '../assets/logos/logo-transparent.png';
import emailjs from '@emailjs/browser';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };




  const handleSubscribe = async () => {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const templateParams = {
      user_email: email, // must match your template variable
    };

    try {
      // Send email to Admin
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_ADMIN_TEMPLATE_ID!, // Admin template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      // Send confirmation email to User
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_USER_TEMPLATE_ID!, // User template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );
      setSuccess('Thank you for subscribing!');
      setEmail('');
    } catch (error: unknown) {
      console.error('FAILED...', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src={Logo} alt="" />
                {/* <span className="text-gray-900 font-bold text-lg">S</span> */}
              </div>
              <div>
                <h3 className="text-xl font-bold">Traventure</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">TRAVEL WITH US</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Traventure turns your travel dreams into reality! Whether it's a serene escape, an adventurous journey, or a cultural deep dive we craft personalized trips to the most amazing destinations, all while keeping your budget in check.            </p>

            <div className="flex space-x-3">
              <button className="w-10 h-10 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Office Locations */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Office</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-medium mb-2 text-white">TRAVENTURE HOLIDAYS</h5>
                <div className="flex items-start space-x-2 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>27/1866 A9, A10 1st Floor, BMT</p>
                    <p>Trade Centre Mini Bypass Road,</p>
                    <p>Junction, Puthiyara,Kozhikode,</p>
                    <p>673032</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Al Wahada Building - 101 - Deira - Dubai - United Arab Emirates</p>
              </div>

              <div className="flex items-start space-x-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>South al khuwair Bousher ,Oman</p>
                  <p>Avenues Mall, Sultan Qaboos St,</p>
                  <p>Muscat 136, Oman</p>
                  <p>673044</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-2 text-blue-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@TRAVENTURE.com" className="hover:text-blue-300 transition-colors">
                  info@traventure.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+971234567891" className="hover:text-blue-300 transition-colors">
                  +971234567891
                </a>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+912345678912" className="hover:text-blue-300 transition-colors">
                  +912345678912
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About us
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Login
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-6">
              Sign up and receive the latest tips via email.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Write your email"
                  className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
                    } focus:border-transparent`}
                />

                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 text-sm">*</span>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-500 mt-3">{success}</p>}


              <button
                onClick={handleSubscribe}
                className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;