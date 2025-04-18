import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaHome, 
  FaUtensils, 
  FaPalette, 
  FaConciergeBell, 
  FaUser,
  FaMoneyBillWave,
  FaReceipt,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MojeRezervacije = () => {
  const [rezervacije, setRezervacije] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [termini, setTermini] = useState([]);
  const [dekoracije, setDekoracije] = useState([]);
  const [usluge, setUsluge] = useState([]);
  const [paketiHrane, setPaketiHrane] = useState([]);
  const [sale, setSale] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = localStorage.getItem('token');

        if (!userData?.id || !token) {
          throw new Error('Korisnik nije prijavljen');
        }

        // Fetch all necessary data in parallel
        const [rezervacijeRes, terminiRes, dekoracijeRes, uslugeRes, paketiRes, saleRes] = await Promise.all([
          fetch('http://localhost:3000/rezervacije', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:3000/termini'),
          fetch('http://localhost:3000/dekoracije'),
          fetch('http://localhost:3000/usluge'),
          fetch('http://localhost:3000/paketihrane'),
          fetch('http://localhost:3000/svadbenesale')
        ]);

        if (!rezervacijeRes.ok) {
          throw new Error('Greška pri učitavanju rezervacija');
        }

        const allData = await Promise.all([
          rezervacijeRes.json(),
          terminiRes.json(),
          dekoracijeRes.json(),
          uslugeRes.json(),
          paketiRes.json(),
          saleRes.json()
        ]);

        const [rezervacijeData, terminiData, dekoracijeData, uslugeData, paketiData, saleData] = allData;

        // Filter reservations for current user
        const userRezervacije = rezervacijeData.filter(rez => rez.Korisnici_id == userData.id);

        // Enrich reservations with related data
        const enrichedRezervacije = userRezervacije.map(rez => {
          const termin = terminiData.find(t => t.id === rez.Termin_id);
          const paket = paketiData.find(p => p.id === rez.PaketiHrane_id);
          const sala = saleData.find(s => s.ID === rez.SvadbeneSale_id);
          
          // Handle comma-separated IDs for decorations and services
          const decorationIds = rez.Dekoracije_id ? rez.Dekoracije_id.split(',').map(Number) : [];
          const serviceIds = rez.Usluge_id ? rez.Usluge_id.split(',').map(Number) : [];
          
          const selectedDekoracije = dekoracijeData.filter(d => decorationIds.includes(d.id));
          const selectedUsluge = uslugeData.filter(u => serviceIds.includes(u.id));

          return {
            ...rez,
            Termin: termin,
            PaketiHrane: paket,
            SvadbeneSale: sala,
            Dekoracije: selectedDekoracije,
            Usluge: selectedUsluge
          };
        });

        setTermini(terminiData);
        setDekoracije(dekoracijeData);
        setUsluge(uslugeData);
        setPaketiHrane(paketiData);
        setSale(saleData);
        setRezervacije(enrichedRezervacije);
      } catch (err) {
        console.error('Greška:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Nepoznat datum';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('hr-HR', options);
  };

  const formatTime = (timeString) => {
    return timeString?.substring(0, 5) || 'Nepoznato vrijeme';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-rose-600 mb-4">Greška</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Povratak na početnu
          </button>
        </div>
      </div>
    );
  }

  if (rezervacije.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-rose-600 mb-4">Nema rezervacija</h2>
          <p className="text-gray-600 mb-6">Trenutno nemate niti jednu rezervaciju.</p>
          <button
            onClick={() => navigate('/termini')}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
          >
            Napravi rezervaciju
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              Moje Rezervacije
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Pregled svih vaših rezervacija
          </p>
        </div>

        <div className="grid gap-8">
          {rezervacije.map((rezervacija) => (
            <motion.div
              key={rezervacija.ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-2xl mr-3" />
                    <div>
                      <h2 className="text-2xl font-bold">{formatDate(rezervacija.Termin?.datum)}</h2>
                      <p className="flex items-center">
                        <FaClock className="mr-2" />
                        {formatTime(rezervacija.Termin?.vrijeme)}
                      </p>
                    </div>
                  </div>
                  <span className="bg-white text-rose-600 px-4 py-1 rounded-full text-sm font-bold">
                    {rezervacija.status || 'Potvrđeno'}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaHome className="text-rose-500 mr-3" />
                    Svadbena sala
                  </h3>
                  <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                    {rezervacija.SvadbeneSale ? (
                      <>
                        <h4 className="text-lg font-bold text-gray-800">{rezervacija.SvadbeneSale.naziv_sale}</h4>
                        <p className="text-gray-600 flex items-center mt-1">
                          <FaMapMarkerAlt className="mr-2 text-rose-500" />
                          {rezervacija.SvadbeneSale.adresa}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-500 text-sm">Kapacitet</p>
                            <p className="font-medium">{rezervacija.SvadbeneSale.broj_mjesta} gostiju</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Broj stolova</p>
                            <p className="font-medium">{rezervacija.SvadbeneSale.broj_stolova}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">Nema informacija o sali</p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaUtensils className="text-rose-500 mr-3" />
                    Paket hrane
                  </h3>
                  <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                    {rezervacija.PaketiHrane ? (
                      <>
                        <h4 className="text-lg font-bold text-gray-800">{rezervacija.PaketiHrane.naziv}</h4>
                        <p className="text-gray-600 mt-2">{rezervacija.PaketiHrane.opis}</p>
                        <p className="text-rose-600 font-bold text-xl mt-2">
                          {rezervacija.PaketiHrane.cijena} KM
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">Nema informacija o paketu hrane</p>
                    )}
                  </div>
                </div>

                {rezervacija.Dekoracije && rezervacija.Dekoracije.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaPalette className="text-rose-500 mr-3" />
                      Odabrane dekoracije
                    </h3>
                    <div className="space-y-4">
                      {rezervacija.Dekoracije.map((dekoracija) => (
                        <div key={dekoracija.id} className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{dekoracija.naziv}</h4>
                              <p className="text-sm text-gray-500 mt-1">{dekoracija.opis}</p>
                            </div>
                            <p className="text-rose-600 font-medium">{dekoracija.cijena} KM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rezervacija.Usluge && rezervacija.Usluge.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaConciergeBell className="text-rose-500 mr-3" />
                      Dodatne usluge
                    </h3>
                    <div className="space-y-4">
                      {rezervacija.Usluge.map((usluga) => (
                        <div key={usluga.id} className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{usluga.naziv}</h4>
                              <p className="text-sm text-gray-500 mt-1">{usluga.opis}</p>
                            </div>
                            <p className="text-rose-600 font-medium">{usluga.cijena} KM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaMoneyBillWave className="text-rose-500 mr-3" />
                    Ukupna cijena
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-3">
                      {rezervacija.PaketiHrane && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paket hrane:</span>
                          <span className="font-medium">{rezervacija.PaketiHrane.cijena} KM</span>
                        </div>
                      )}
                      {rezervacija.Dekoracije?.map((dekoracija) => (
                        <div key={dekoracija.id} className="flex justify-between">
                          <span className="text-gray-600">{dekoracija.naziv}:</span>
                          <span className="font-medium">{dekoracija.cijena} KM</span>
                        </div>
                      ))}
                      {rezervacija.Usluge?.map((usluga) => (
                        <div key={usluga.id} className="flex justify-between">
                          <span className="text-gray-600">{usluga.naziv}:</span>
                          <span className="font-medium">{usluga.cijena} KM</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold">Ukupno:</span>
                          <span className="text-xl font-bold text-rose-600">
                            {[
                              rezervacija.PaketiHrane?.cijena || 0,
                              ...(rezervacija.Dekoracije?.map(d => d.cijena) || []),
                              ...(rezervacija.Usluge?.map(u => u.cijena) || [])
                            ].reduce((a, b) => a + b, 0)} KM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MojeRezervacije;