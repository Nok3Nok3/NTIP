import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Termini = () => {
  const [termini, setTermini] = useState([]);
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [customTime, setCustomTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermini = async () => {
      try {
        const response = await fetch('http://localhost:3000/termini');
        const data = await response.json();
        setTermini(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching termini:', error);
        setIsLoading(false);
      }
    };

    fetchTermini();
  }, []);

  const handleTerminSelect = (termin) => {
    if (termin.dostupnost === 1) {
      setSelectedTermin(termin);
      setSuccessMessage('');
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customTime) {
      const customTermin = {
        id: null,
        datum: customTime.split('T')[0],
        vrijeme: customTime.split('T')[1],
        dostupnost: 2 // 2 for custom request
      };
      setSelectedTermin(customTermin);
      setSuccessMessage(`Vaš termin: ${formatCustomDate(customTime)} je zatražen! Kontaktirat ćemo vas za potvrdu.`);
      setCustomTime('');
    }
  };

  const handleNext = () => {
    if (selectedTermin) {
      navigate('/dekoracije', {
        state: {
          termin: selectedTermin
        }
      });
    }
  };

  const groupByDate = () => {
    return termini.reduce((acc, termin) => {
      if (!acc[termin.datum]) {
        acc[termin.datum] = [];
      }
      acc[termin.datum].push(termin);
      return acc;
    }, {});
  };

  const formatDate = (dateString) => {
    const months = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    return `${day}. ${months[monthIndex]}`;
  };

  const formatCustomDate = (dateTimeString) => {
    const [date, time] = dateTimeString.split('T');
    return `${formatDate(date)} u ${time.substring(0, 5)}`;
  };

  const groupedTermini = groupByDate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
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
                initial={{ width: '20%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif text-center">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Odaberite Termin
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
            Izaberite dostupan termin iz ponude ili predložite svoj
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
                <FaCalendarAlt className="text-rose-500 mr-3" />
                Dostupni termini
              </h2>

              <div className="space-y-6">
                {Object.entries(groupedTermini).map(([date, slots]) => (
                  <div key={date} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      {formatDate(date)}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {slots.map((termin) => (
                        <motion.button
                          key={termin.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTerminSelect(termin)}
                          className={`py-3 px-4 rounded-lg border transition-all ${
                            termin.dostupnost === 1
                              ? selectedTermin?.id === termin.id
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                          disabled={termin.dostupnost === 0}
                        >
                          <div className="flex items-center justify-center">
                            <FaClock className="mr-2" />
                            {termin.vrijeme.substring(0, 5)}
                            {termin.dostupnost === 0 && (
                              <FaTimes className="ml-2 text-red-400" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaClock className="text-rose-500 mr-3" />
                Vaš termin
              </h2>

              {selectedTermin ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-6 text-center">
                  <div className="text-2xl font-medium text-rose-600 mb-2">
                    {formatDate(selectedTermin.datum)}
                  </div>
                  <div className="text-xl font-bold">
                    {selectedTermin.vrijeme.substring(0, 5)}
                  </div>
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <FaCheck className="mr-2" />
                    {selectedTermin.dostupnost === 2 ? 'Termin zatražen' : 'Termin odabran'}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-center">
                  <div className="text-gray-500">
                    Niste odabrali termin
                  </div>
                </div>
              )}

              <form onSubmit={handleCustomSubmit} className="mt-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Predložite svoj termin
                </h3>
                <div className="flex flex-col space-y-4">
                  <input
                    type="datetime-local"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-rose-500 to-rose-400 text-white font-medium py-3 px-6 rounded-lg shadow-md"
                    disabled={!customTime}
                  >
                    Predloži termin
                  </motion.button>
                </div>
              </form>

              {successMessage && (
                <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                  {successMessage}
                </div>
              )}

              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className={`w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center ${
                    !selectedTermin ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectedTermin}
                >
                  Dalje <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Termini;