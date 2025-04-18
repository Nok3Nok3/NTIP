import { Link } from 'react-router-dom';
import { FaHeart, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-rose-50 to-rose-100 border-t border-rose-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
                Wedding Planner
              </span>
              <FaHeart className="ml-2 text-rose-400" />
            </Link>
            <p className="text-sm text-gray-600">
              Pretvaramo vaše snove o savršenom vjenčanju u stvarnost s pažnjom na svaki detalj.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-rose-400 hover:text-rose-600">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-rose-400 hover:text-rose-600">
                <FaFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-4">
              Brzi linkovi
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-rose-600 transition-colors flex items-center">
                  <span className="h-1 w-1 bg-rose-400 rounded-full mr-2"></span>
                  O nama
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-rose-600 transition-colors flex items-center">
                  <span className="h-1 w-1 bg-rose-400 rounded-full mr-2"></span>
                  Usluge
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-600 hover:text-rose-600 transition-colors flex items-center">
                  <span className="h-1 w-1 bg-rose-400 rounded-full mr-2"></span>
                  Galerija
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-4">
              Kontaktirajte nas
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="h-4 w-4 text-rose-500 mt-0.5 mr-2" />
                <span className="text-gray-600">Trg bezavisnosti 1, Sarajevo</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="h-4 w-4 text-rose-500 mr-2" />
                <span className="text-gray-600">+387 61 234 567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-4 w-4 text-rose-500 mr-2" />
                <span className="text-gray-600">info@weddingplanner.ba</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Prijavite se za najnovije savjete i ponude.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Vaš email"
                className="px-4 py-2 w-full rounded-l-lg border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-rose-400 text-white px-4 py-2 rounded-r-lg hover:from-rose-600 hover:to-rose-500 transition-all"
              >
                Pošalji
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-rose-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Wedding Planner. Sva prava pridržana.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-rose-600">
                Politika privatnosti
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-rose-600">
                Uslovi korištenja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;