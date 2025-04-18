import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaCheck, FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const PaketiHrane = () => {
  const [paketi, setPaketi] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep] = useState(3);
  const totalSteps = 5;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPaketi = async () => {
      try {
        const response = await fetch('http://localhost:3000/paketihrane');
        const data = await response.json();
        setPaketi(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching paketi:', error);
        setIsLoading(false);
      }
    };

    fetchPaketi();

    // Load previously selected package if exists
    if (location.state?.paket) {
      setSelectedPackage(location.state.paket.id);
    }
  }, [location.state]);

  const handleSelect = (paket) => {
    setSelectedPackage(paket.id === selectedPackage ? null : paket.id);
  };

  const handleNext = () => {
    const selected = paketi.find(p => p.id === selectedPackage);
    navigate('/svadbenesale', {
      state: {
        ...location.state,
        paket: selected
      }
    });
  };

  const getSelectedPackage = () => {
    return paketi.find(p => p.id === selectedPackage);
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
                initial={{ width: '60%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-center">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Meni za Vaše Vjenčanje
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
            Odaberite paket hrane koji će oduševiti vaše goste
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {paketi.map((paket) => (
              <motion.div
                key={paket.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(paket)}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedPackage === paket.id ? 'ring-4 ring-rose-500 transform scale-[1.02]' : 'hover:shadow-lg'
                }`}
              >
                <div className="h-64 bg-rose-100 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={
                      paket.id === 1 ? "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" :
                      paket.id === 2 ? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" :
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={paket.naziv}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {selectedPackage === paket.id && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full">
                      <FaCheck size={18} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{paket.naziv}</h3>
                    <div className="text-rose-600 font-bold text-lg">{paket.cijena} KM</div>
                  </div>
                  <p className="text-gray-600 mb-4">{paket.opis}</p>
                  <div className="flex items-center text-sm text-rose-500">
                    <FaUtensils className="mr-2" />
                    {paket.id === 1 && "3 kursne večere"}
                    {paket.id === 2 && "5 kursna večera"}
                    {paket.id === 3 && "4 veganska jela"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Package Summary */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-rose-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCheck className="text-green-500 mr-3" />
              Vaš odabrani paket
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-700">{getSelectedPackage()?.naziv}</p>
                <p className="text-gray-500">{getSelectedPackage()?.opis}</p>
              </div>
              <p className="text-xl font-bold text-rose-600">{getSelectedPackage()?.cijena} KM</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center bg-white text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-300 shadow-sm hover:shadow-md"
            onClick={() => navigate('/dekoracije', { state: location.state })}
          >
            <FaArrowLeft className="mr-3" />
            Nazad
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg ${
              !selectedPackage ? 'opacity-50 cursor-not-allowed' : 'hover:from-rose-600 hover:to-rose-700'
            }`}
            onClick={handleNext}
            disabled={!selectedPackage}
          >
            Dalje
            <FaArrowRight className="ml-3" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PaketiHrane;