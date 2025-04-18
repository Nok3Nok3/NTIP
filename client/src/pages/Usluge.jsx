import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaCheck, FaConciergeBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Usluge = () => {
  const [usluge, setUsluge] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep] = useState(5);
  const totalSteps = 5;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUsluge = async () => {
      try {
        const response = await fetch('http://localhost:3000/usluge');
        const data = await response.json();
        setUsluge(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching usluge:', error);
        setIsLoading(false);
      }
    };

    fetchUsluge();

    // Load previously selected services if exists
    if (location.state?.usluge) {
      setSelectedServices(location.state.usluge.map(u => u.id));
    }
  }, [location.state]);

  const handleSelect = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(serviceId => serviceId !== id) 
        : [...prev, id]
    );
  };

  const handleNext = () => {
    const selected = usluge.filter(u => selectedServices.includes(u.id));
    navigate('/pregled', {
      state: {
        ...location.state,
        usluge: selected
      }
    });
  };

  const calculateTotal = () => {
    return usluge
      .filter(item => selectedServices.includes(item.id))
      .reduce((sum, item) => sum + item.cijena, 0);
  };

  const getSelectedServices = () => {
    return usluge.filter(item => selectedServices.includes(item.id));
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
                initial={{ width: '100%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-center">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Dodatne Usluge
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
            Dodajte posebne usluge koje će učiniti vaš dan još posebnijim
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {usluge.map((usluga) => (
              <motion.div
                key={usluga.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(usluga.id)}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedServices.includes(usluga.id) ? 'ring-4 ring-rose-500 transform scale-[1.02]' : 'hover:shadow-lg'
                }`}
              >
                <div className="h-64 bg-rose-100 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={
                      usluga.id === 1 ? "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      usluga.id === 2 ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      usluga.id === 3 ? "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" :
                      "https://images.unsplash.com/photo-1459156212016-c812468e2115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={usluga.naziv}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {selectedServices.includes(usluga.id) && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full">
                      <FaCheck size={18} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{usluga.naziv}</h3>
                    <div className="text-rose-600 font-bold text-lg">{usluga.cijena} KM</div>
                  </div>
                  <p className="text-gray-600 mb-4">{usluga.opis}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-rose-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaConciergeBell className="text-rose-500 mr-3" />
              Odabrane usluge
            </h3>
            <div className="space-y-4 mb-4">
              {getSelectedServices().map((usluga) => (
                <div key={usluga.id} className="flex justify-between items-center border-b border-rose-50 pb-3">
                  <div>
                    <p className="font-medium text-gray-800">{usluga.naziv}</p>
                    <p className="text-sm text-gray-500">{usluga.opis}</p>
                  </div>
                  <p className="text-rose-600 font-medium">{usluga.cijena} KM</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-medium text-gray-700">Ukupno:</span>
              <span className="text-xl font-bold text-rose-600">{calculateTotal()} KM</span>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center bg-white text-gray-700 font-medium py-4 px-8 rounded-xl border border-gray-300 shadow-sm hover:shadow-md"
            onClick={() => navigate('/svadbenesale', { state: location.state })}
          >
            <FaArrowLeft className="mr-3" />
            Nazad
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium py-4 px-8 rounded-xl shadow-md hover:shadow-lg"
            onClick={handleNext}
          >
            Pregled
            <FaArrowRight className="ml-3" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Usluge;