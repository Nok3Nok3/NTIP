import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaCalendarAlt, FaPalette, FaUtensils, FaHome, FaConciergeBell, FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Pregled = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    termin: null,
    dekoracije: [],
    paket: null,
    sala: null,
    usluge: []
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const calculateTotal = () => {
    let total = 0;
    if (selectedOptions.paket) total += selectedOptions.paket.cijena;
    if (selectedOptions.dekoracije?.length > 0) {
      total += selectedOptions.dekoracije.reduce((sum, dekoracija) => sum + dekoracija.cijena, 0);
    }
    if (selectedOptions.usluge?.length > 0) {
      total += selectedOptions.usluge.reduce((sum, usluga) => sum + usluga.cijena, 0);
    }
    return total;
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    setUser(storedUser);

    if (location.state) {
      setSelectedOptions(prev => ({
        ...prev,
        termin: location.state.termin || location.state.selectedOptions?.termin,
        dekoracije: location.state.dekoracije || location.state.selectedOptions?.dekoracije || [],
        paket: location.state.paket || location.state.selectedOptions?.paket,
        sala: location.state.sala || location.state.selectedOptions?.sala,
        usluge: location.state.usluge || location.state.selectedOptions?.usluge || []
      }));
    }
  }, [location.state]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('hr-HR', options);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (!storedUser?.id) {
        throw new Error('User information not found');
      }

      const requestBody = {
        Termin_id: selectedOptions.termin?.id,
        Dekoracije_id: selectedOptions.dekoracije?.map(d => d.id).join(','),
        Korisnici_id: storedUser.id,
        PaketiHrane_id: selectedOptions.paket?.id,
        SvadbeneSale_id: selectedOptions.sala?.ID,
        Usluge_id: selectedOptions.usluge?.map(u => u.id).join(',')
      };

      const response = await fetch('http://localhost:3000/rezervacije', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to submit reservation');
      }

      const result = await response.json();
      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setSubmitError(error.message || 'Došlo je do greške prilikom rezervacije. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Pregled Rezervacije
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Potvrdite svoje odabire za svadbeni dan
          </p>
        </div>

        {user && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-rose-100 p-3 rounded-full mr-4">
                <FaUser className="text-rose-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Podaci o naručiocu</h3>
                <p className="text-gray-600">{user.username}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Detalji rezervacije
            </h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-rose-100 p-3 rounded-full mr-6">
                  <FaCalendarAlt className="text-rose-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Termin</h3>
                  {selectedOptions.termin ? (
                    <>
                      <p className="text-gray-600">{formatDate(selectedOptions.termin.datum)}</p>
                      <p className="text-gray-600">Vrijeme: {selectedOptions.termin.vrijeme}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Niste odabrali termin</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-rose-100 p-3 rounded-full mr-6">
                  <FaHome className="text-rose-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Svadbena sala</h3>
                  {selectedOptions.sala ? (
                    <>
                      <p className="text-gray-600 font-medium">{selectedOptions.sala.naziv_sale}</p>
                      <p className="text-gray-600">{selectedOptions.sala.adresa}</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-gray-500 text-sm">Kapacitet:</p>
                          <p className="font-medium">{selectedOptions.sala.broj_mjesta} gostiju</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Broj stolova:</p>
                          <p className="font-medium">{selectedOptions.sala.broj_stolova}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">Niste odabrali svadbenu salu</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-rose-100 p-3 rounded-full mr-6">
                  <FaUtensils className="text-rose-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Paket hrane</h3>
                  {selectedOptions.paket ? (
                    <>
                      <p className="text-gray-600 font-medium">{selectedOptions.paket.naziv}</p>
                      <p className="text-gray-500">{selectedOptions.paket.opis}</p>
                      <p className="text-rose-600 font-bold mt-2">{selectedOptions.paket.cijena} KM</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Niste odabrali paket hrane</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-rose-100 p-3 rounded-full mr-6">
                  <FaPalette className="text-rose-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Dekoracije</h3>
                  {selectedOptions.dekoracije?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOptions.dekoracije.map(dekoracija => (
                        <div key={dekoracija.id} className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{dekoracija.naziv}</p>
                              <p className="text-sm text-gray-500">{dekoracija.opis}</p>
                            </div>
                            <p className="text-rose-600 font-medium">{dekoracija.cijena} KM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Niste odabrali dekoracije</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-rose-100 p-3 rounded-full mr-6">
                  <FaConciergeBell className="text-rose-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Dodatne usluge</h3>
                  {selectedOptions.usluge?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOptions.usluge.map(usluga => (
                        <div key={usluga.id} className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{usluga.naziv}</p>
                              <p className="text-sm text-gray-500">{usluga.opis}</p>
                            </div>
                            <p className="text-rose-600 font-medium">{usluga.cijena} KM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Niste odabrali dodatne usluge</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
            Ukupna cijena
          </h2>
          <div className="space-y-4">
            {selectedOptions.paket && (
              <div className="flex justify-between">
                <p className="text-gray-600">Paket hrane:</p>
                <p className="text-gray-800 font-medium">{selectedOptions.paket.cijena} KM</p>
              </div>
            )}
            {selectedOptions.dekoracije?.map(dekoracija => (
              <div key={dekoracija.id} className="flex justify-between">
                <p className="text-gray-600">{dekoracija.naziv}:</p>
                <p className="text-gray-800 font-medium">{dekoracija.cijena} KM</p>
              </div>
            ))}
            {selectedOptions.usluge?.map(usluga => (
              <div key={usluga.id} className="flex justify-between">
                <p className="text-gray-600">{usluga.naziv}:</p>
                <p className="text-gray-800 font-medium">{usluga.cijena} KM</p>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between">
                <p className="text-xl font-bold text-gray-800">Ukupno:</p>
                <p className="text-2xl font-bold text-rose-600">{calculateTotal()} KM</p>
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-medium">Greška pri rezervaciji:</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center bg-white text-gray-700 font-medium py-4 px-8 rounded-xl border border-gray-300 shadow-sm hover:shadow-md"
            onClick={() => navigate('/usluge', { state: { selectedOptions } })}
          >
            <FaArrowLeft className="mr-3" />
            Nazad
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium py-4 px-8 rounded-xl shadow-md hover:shadow-lg ${
              isSubmitting || submitSuccess ? 'opacity-75' : ''
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
          >
            {isSubmitting ? (
              'Šaljem rezervaciju...'
            ) : submitSuccess ? (
              <>
                <FaCheck className="mr-2" />
                Rezervacija uspješna!
              </>
            ) : (
              'Potvrdi rezervaciju'
            )}
          </motion.button>
        </div>

        {submitSuccess && (
          <div className="mt-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <p className="font-medium">Vaša rezervacija je uspješno poslana!</p>
            <p className="text-sm">Uskoro ćemo vas kontaktirati za potvrdu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pregled;