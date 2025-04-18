import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaCheck, FaPalette } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Dekoracije = () => {
  const [dekoracije, setDekoracije] = useState([]);
  const [selectedDecorations, setSelectedDecorations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep] = useState(2);
  const totalSteps = 5;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDekoracije = async () => {
      try {
        const response = await fetch('http://localhost:3000/dekoracije');
        const data = await response.json();
        setDekoracije(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dekoracije:', error);
        setIsLoading(false);
      }
    };

    fetchDekoracije();

    if (location.state?.selectedOptions?.dekoracije) {
      setSelectedDecorations(location.state.selectedOptions.dekoracije.map(d => d.id));
    }
  }, [location.state]);

  const toggleSelection = (id) => {
    setSelectedDecorations(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return dekoracije
      .filter(item => selectedDecorations.includes(item.id))
      .reduce((sum, item) => sum + item.cijena, 0);
  };

  const handleNext = () => {
    const selectedItems = dekoracije.filter(item => selectedDecorations.includes(item.id));
    
    navigate('/paketihrane', {
      state: {
        ...location.state,
        selectedOptions: {
          ...(location.state?.selectedOptions || {}),
          dekoracije: selectedItems
        }
      }
    });
  };

  const handleBack = () => {
    navigate('/termini', {
      state: {
        ...location.state,
        selectedOptions: {
          ...(location.state?.selectedOptions || {}),
          dekoracije: dekoracije.filter(item => selectedDecorations.includes(item.id))
        }
      }
    });
  };

  const getSelectedItems = () => {
    return dekoracije.filter(item => selectedDecorations.includes(item.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="relative pt-4">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                      currentStep === index + 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {currentStep > index + 1 ? <FaCheck /> : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {index === 0 && 'Termin'}
                    {index === 1 && 'Dekoracije'}
                    {index === 2 && 'Paketi'}
                    {index === 3 && 'Sale'}
                    {index === 4 && 'Usluge'}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 -z-10">
              <motion.div 
                className="h-full bg-rose-500"
                initial={{ width: '40%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-center">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Odaberite Dekoracije
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
            Kreirajte jedinstveni izgled vašeg vjenčanja
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 pb-12">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaPalette className="text-rose-500 mr-3" />
                Dostupne dekoracije
              </h2>

              <div className="space-y-4">
                {dekoracije.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3 }}
                    onClick={() => toggleSelection(item.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      selectedDecorations.includes(item.id)
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-white border-gray-200 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-800">{item.naziv}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-rose-100 text-rose-800 rounded-full mt-1">
                          {item.tip}
                        </span>
                      </div>
                      <div className="text-rose-600 font-bold">
                        {item.cijena} KM
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{item.opis}</p>
                    <div className="mt-3 flex justify-end">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        selectedDecorations.includes(item.id) 
                          ? 'bg-rose-500 border-rose-500 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {selectedDecorations.includes(item.id) && <FaCheck size={10} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Vaša dekoracija
              </h2>

              {getSelectedItems().length > 0 ? (
                <div className="space-y-4 mb-6">
                  {getSelectedItems().map((item) => (
                    <div key={item.id} className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{item.naziv}</h3>
                          <span className="text-xs text-rose-600">{item.tip}</span>
                        </div>
                        <div className="text-rose-600 font-bold">
                          {item.cijena} KM
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <div className="text-gray-500">
                    Odaberite dekoracije koje želite za svoje vjenčanje
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-medium text-gray-700">Ukupna cijena:</span>
                  <span className="text-2xl font-bold text-rose-600">
                    {calculateTotal()} KM
                  </span>
                </div>

                <div className="flex justify-between space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center bg-white text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-300 shadow-sm hover:shadow-md flex-1"
                    onClick={handleBack}
                  >
                    <FaArrowLeft className="mr-3" />
                    Nazad
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg flex-1"
                    onClick={handleNext}
                  >
                    Dalje
                    <FaArrowRight className="ml-3" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dekoracije;