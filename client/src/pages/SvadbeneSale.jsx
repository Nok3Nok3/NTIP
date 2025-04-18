import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaCheck, FaUsers, FaChair, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Svadbenesale = () => {
  const [sale, setSale] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep] = useState(4);
  const totalSteps = 5;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch('http://localhost:3000/svadbenesale');
        const data = await response.json();
        setSale(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sale:', error);
        setIsLoading(false);
      }
    };

    fetchSale();

    // Load previously selected hall if exists
    if (location.state?.sala) {
      setSelectedHall(location.state.sala.ID);
    }
  }, [location.state]);

  const handleSelect = (sala) => {
    setSelectedHall(sala.ID === selectedHall ? null : sala.ID);
  };

  const handleNext = () => {
    const selected = sale.find(s => s.ID === selectedHall);
    navigate('/usluge', {
      state: {
        ...location.state,
        sala: selected
      }
    });
  };

  const getSelectedHall = () => {
    return sale.find(s => s.ID === selectedHall);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="relative pt-4">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                    ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                      currentStep === index + 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {currentStep > index + 1 ? <FaCheck /> : index + 1}
                  </div>
                  <span className="text-sm mt-2 text-gray-600 font-medium">
                    {index === 0 && 'Termin'}
                    {index === 1 && 'Dekoracije'}
                    {index === 2 && 'Paketi'}
                    {index === 3 && 'Sale'}
                    {index === 4 && 'Usluge'}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 -z-10 rounded-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"
                initial={{ width: '80%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif text-center">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Naše Svadbene Sale
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
            Odaberite savršeni prostor za vaš veliki dan
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {sale.map((sala) => (
              <motion.div
                key={sala.ID}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(sala)}
                className={`bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedHall === sala.ID ? 'ring-4 ring-rose-500 transform scale-[1.02]' : 'hover:shadow-xl'
                }`}
              >
                <div className="h-64 bg-rose-100 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={
                      sala.ID === 1 ? "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      sala.ID === 2 ? "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      sala.ID === 3 ? "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      sala.ID === 4 ? "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={sala.naziv_sale}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {selectedHall === sala.ID && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full">
                      <FaCheck size={18} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">{sala.naziv_sale}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUsers className="text-rose-500 mr-3" size={18} />
                      <div>
                        <p className="text-gray-500 text-sm">Kapacitet</p>
                        <p className="font-medium">{sala.broj_mjesta} gostiju</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUtensils className="text-rose-500 mr-3" size={18} />
                      <div>
                        <p className="text-gray-500 text-sm">Stolovi</p>
                        <p className="font-medium">{sala.broj_stolova}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaChair className="text-rose-500 mr-3" size={18} />
                      <div>
                        <p className="text-gray-500 text-sm">Stolice</p>
                        <p className="font-medium">{sala.broj_stolica}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-rose-500 mr-3" size={18} />
                      <div>
                        <p className="text-gray-500 text-sm">Lokacija</p>
                        <p className="font-medium">{sala.adresa}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Hall Summary */}
        {selectedHall && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-rose-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCheck className="text-green-500 mr-3" />
              Vaša odabrana sala
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-700">{getSelectedHall()?.naziv_sale}</p>
                <p className="text-gray-500">{getSelectedHall()?.adresa}</p>
              </div>
              <p className="text-lg font-medium">{getSelectedHall()?.broj_mjesta} mjesta</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center bg-white text-gray-700 font-medium py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            onClick={() => navigate('/paketihrane', { state: location.state })}
          >
            <FaArrowLeft className="mr-3" />
            Nazad
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all ${
              !selectedHall ? 'opacity-50 cursor-not-allowed' : 'hover:from-rose-600 hover:to-rose-700'
            }`}
            onClick={handleNext}
            disabled={!selectedHall}
          >
            Dalje
            <FaArrowRight className="ml-3" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Svadbenesale;