import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaGem, FaGlassCheers, FaArrowRight } from 'react-icons/fa';
import { GiBigDiamondRing } from 'react-icons/gi';

const About = () => {
  return (
    <div className="min-h-screen bg-rose-50 bg-opacity-50 py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-rose-200 text-9xl"><GiBigDiamondRing /></div>
        <div className="absolute bottom-40 right-20 text-rose-200 text-9xl"><FaHeart /></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-rose-500 to-rose-300 text-white px-6 py-2 rounded-full text-sm font-medium mb-4 shadow-md">
            O NAMA
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">Iskustvo</span> Koje Inspiriše
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Svaka ljubavna priča je jedinstvena, a mi smo tu da vašu pretvorimo u nezaboravno iskustvo.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-rose-300 to-rose-200 mx-auto"></div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-50 opacity-80"></div>
          <div className="relative grid md:grid-cols-2">
            <div className="p-12 md:p-16">
              <div className="flex items-center mb-8">
                <div className="bg-rose-100 p-3 rounded-full mr-4">
                  <FaHeart className="text-rose-600 text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Naša Priča</h2>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Osnovani u srcu Sarajeva 2010. godine, Wedding Planner je izrastao u vodeću agenciju za organizaciju vjenčanja u regionu. Naša putovanja kroz svijet event menadžmenta obilježena su stotinama uspješnih priča.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-rose-50 p-4 rounded-xl">
                  <div className="text-4xl font-bold text-rose-600 mb-2">200+</div>
                  <div className="text-sm text-gray-600">Organiziranih vjenčanja</div>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl">
                  <div className="text-4xl font-bold text-rose-600 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Godina iskustva</div>
                </div>
              </div>
              <div className="flex items-center text-rose-600 font-medium">
                <FaHeart className="mr-2" />
                <span>Svako vjenčanje je za nas izuzetno</span>
              </div>
            </div>
            <div className="hidden md:block bg-rose-100 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-90 mix-blend-multiply"></div>
            </div>
          </div>
        </div>

        {/* Mission & Team */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-rose-600 to-rose-400 rounded-3xl shadow-2xl overflow-hidden text-white transform hover:-translate-y-2 transition-transform duration-500">
            <div className="p-12">
              <div className="flex items-center mb-8">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <FaGem className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold font-serif">Naša Misija</h2>
              </div>
              <p className="mb-6 text-lg leading-relaxed opacity-90">
                Naša misija je jednostavna - stvoriti savršen dan bez stresa. Od prvog sastanka do posljednjeg plesa, mi smo tu da osiguramo da svaki detalj odgovara vašoj viziji.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Personalizovani pristup</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Ekskluzivni dobavljači</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Besprijekorna organizacija</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Team Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
            <div className="p-12">
              <div className="flex items-center mb-8">
                <div className="bg-rose-100 p-3 rounded-full mr-4">
                  <FaUsers className="text-rose-600 text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Naš Tim</h2>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Naš tim čine strastveni profesionalci sa ekspertizom u svim aspektima vjenčanja. Od kreativnih direktora do iskusnih koordinatora, svako doprinosi jedinstvenim veštinama.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">Dekoracija</span>
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">Logistika</span>
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">Kulinarstvo</span>
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">Fotografija</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Spremni da započnemo vašu priču?</h3>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold py-5 px-10 rounded-full shadow-xl transition-all duration-300 group"
          >
            <span className="mr-3">Zakažite Konsultacije</span>
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center text-gray-500">
              <FaGlassCheers className="text-rose-400 mr-2" />
              <span>Vaše vjenčanje, naša strast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;