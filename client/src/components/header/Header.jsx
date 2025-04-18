import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, User } from 'react-feather';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userDataString = localStorage.getItem('userData');
      
      if (token && userDataString) {
        try {
          const parsedData = JSON.parse(userDataString);
          setIsLoggedIn(true);
          setUserData(parsedData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      }
    };

    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const getNavLinks = () => {
    const baseLinks = [
      { path: '/', name: 'Početna' },
      { path: '/about', name: 'O nama' }
    ];

    if (!userData) return baseLinks;

    if (userData.uloga === 'admin') {
      return [
        ...baseLinks,
        { path: '/dekoracijea', name: 'Dekoracije' },
        { path: '/korisnici', name: 'Korisnici' },
        { path: '/paketia', name: 'Paketi' },
        { path: '/salea', name: 'Sale' },
        { path: '/terminii', name: 'Termini' },
        { path: '/uslugee', name: 'Usluge' },
        { path: '/rezervacijee', name: 'Rezervacije' }
      ];
    } else {
      return [
        ...baseLinks,
        { path: '/termini', name: 'Kreiraj termin' },
        { path: '/mojerezervacije', name: 'Moje rezervacije' },
        { path: '/contact', name: 'Kontakt' }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white/80 shadow-sm backdrop-blur-sm'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-rose-600 flex items-center">
              <span className="hidden sm:inline-block mr-2">👰</span>
              <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
                Elegant Weddings
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <motion.div key={link.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={link.path} className="text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200 relative group">
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}

            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-2">
                      <User size={16} className="text-rose-600" />
                    </div>
                    <span>{userData?.username || userData?.email}</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {userDropdownOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{userData?.username}</div>
                      <div className="text-xs text-gray-500">{userData?.email}</div>
                      {userData?.uloga && (
                        <div className="text-xs mt-1">
                          <span className="inline-block bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                            {userData.uloga === 'admin' ? 'Administrator' : 'Korisnik'}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    >
                      Odjava
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-rose-600 to-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-rose-200 transition-all duration-300"
                >
                  Prijava
                </Link>
              </motion.div>
            )}
          </nav>

          <button 
            className="md:hidden p-2 text-gray-700 hover:text-rose-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} className="text-rose-600" /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to={link.path} 
                  className="block py-2 text-gray-700 hover:text-rose-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {isLoggedIn && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <User size={18} className="text-rose-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{userData?.username || userData?.email}</div>
                      {userData?.uloga && (
                        <div className="text-xs mt-1">
                          <span className="inline-block bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                            {userData.uloga === 'admin' ? 'Administrator' : 'Korisnik'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-700 hover:text-rose-600 font-medium"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Odjava
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;