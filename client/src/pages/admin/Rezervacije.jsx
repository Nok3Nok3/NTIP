import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaSync, FaInfoCircle, FaUser, FaCalendarAlt, FaStore, FaUtensils, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Rezervacije = () => {
  const [rezervacije, setRezervacije] = useState([]);
  const [termini, setTermini] = useState([]);
  const [korisnici, setKorisnici] = useState([]);
  const [sale, setSale] = useState([]);
  const [paketiHrane, setPaketiHrane] = useState([]);
  const [usluge, setUsluge] = useState([]);
  const [dekoracije, setDekoracije] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      const [
        rezervacijeRes, 
        terminiRes, 
        korisniciRes, 
        saleRes, 
        paketiRes, 
        uslugeRes, 
        dekoracijeRes
      ] = await Promise.all([
        fetch('http://localhost:3000/rezervacije'),
        fetch('http://localhost:3000/termini'),
        fetch('http://localhost:3000/korisnici'),
        fetch('http://localhost:3000/svadbenesale'),
        fetch('http://localhost:3000/paketihrane'),
        fetch('http://localhost:3000/usluge'),
        fetch('http://localhost:3000/dekoracije')
      ]);

      if (!rezervacijeRes.ok) throw new Error('Greška pri učitavanju rezervacija');
      if (!terminiRes.ok) throw new Error('Greška pri učitavanju termina');
      if (!korisniciRes.ok) throw new Error('Greška pri učitavanju korisnika');
      if (!saleRes.ok) throw new Error('Greška pri učitavanju sala');
      if (!paketiRes.ok) throw new Error('Greška pri učitavanju paketa hrane');
      if (!uslugeRes.ok) throw new Error('Greška pri učitavanju usluga');
      if (!dekoracijeRes.ok) throw new Error('Greška pri učitavanju dekoracija');

      const data = await Promise.all([
        rezervacijeRes.json(),
        terminiRes.json(),
        korisniciRes.json(),
        saleRes.json(),
        paketiRes.json(),
        uslugeRes.json(),
        dekoracijeRes.json()
      ]);

      setRezervacije(data[0]);
      setTermini(data[1]);
      setKorisnici(data[2]);
      setSale(data[3]);
      setPaketiHrane(data[4]);
      setUsluge(data[5]);
      setDekoracije(data[6]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu rezervaciju?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/rezervacije/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju rezervacije');
      }

      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getNazivById = (id, collection, idField = 'id', nameField = 'naziv') => {
    if (!id) return 'Nepoznato';
    const item = collection.find(item => item[idField] === id);
    return item ? item[nameField] || item.naziv_sale || item.username : 'Nepoznato';
  };

  const getKorisnikInfo = (id) => {
    const korisnik = korisnici.find(k => k.ID === id);
    if (!korisnik) return { name: 'Nepoznati korisnik', email: '' };
    return {
      name: korisnik.username || `${korisnik.Ime || ''} ${korisnik.Prezime || ''}`.trim() || korisnik.email,
      email: korisnik.email
    };
  };

  const getMultipleNamesByIds = (idsString, collection) => {
    if (!idsString) return 'Nema';
    const ids = idsString.split(',').map(id => parseInt(id.trim()));
    return ids.map(id => getNazivById(id, collection)).join(', ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nepoznat datum';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('hr-HR', options);
  };

  const filteredRezervacije = rezervacije.filter(rezervacija => {
    const searchLower = searchTerm.toLowerCase();
    const termin = termini.find(t => t.id === rezervacija.Termin_id);
    const korisnikInfo = getKorisnikInfo(rezervacija.Korisnici_id);
    const sala = getNazivById(rezervacija.SvadbeneSale_id, sale, 'ID', 'naziv_sale');
    const paketHrane = getNazivById(rezervacija.PaketiHrane_id, paketiHrane);
    
    return (
      (termin && termin.datum && termin.datum.toLowerCase().includes(searchLower)) ||
      (termin && termin.vrijeme && termin.vrijeme.toLowerCase().includes(searchLower)) ||
      korisnikInfo.name.toLowerCase().includes(searchLower) ||
      korisnikInfo.email.toLowerCase().includes(searchLower) ||
      sala.toLowerCase().includes(searchLower) ||
      paketHrane.toLowerCase().includes(searchLower) ||
      rezervacija.ID.toString().includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
        <p>{error}</p>
        <button 
          onClick={fetchAllData}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upravljanje Rezervacijama</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Pretraži rezervacije..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <button
          onClick={fetchAllData}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <FaSync className="mr-2" /> Osvježi
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaUser className="mr-2" /> Korisnik
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" /> Termin
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaStore className="mr-2" /> Sala
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaUtensils className="mr-2" /> Paket hrane
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaGift className="mr-2" /> Dekoracije
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usluge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRezervacije.length > 0 ? (
              filteredRezervacije.map((rezervacija) => {
                const termin = termini.find(t => t.id === rezervacija.Termin_id);
                const korisnikInfo = getKorisnikInfo(rezervacija.Korisnici_id);
                
                return (
                  <tr key={rezervacija.ID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rezervacija.ID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div>{korisnikInfo.name}</div>
                      <div className="text-xs text-gray-500">{korisnikInfo.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {termin ? (
                        <>
                          <div>{formatDate(termin.datum)}</div>
                          <div>{termin.vrijeme ? termin.vrijeme.substring(0, 5) : 'Nepoznato vrijeme'}</div>
                        </>
                      ) : 'Termin obrisan'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getNazivById(rezervacija.SvadbeneSale_id, sale, 'ID', 'naziv_sale')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getNazivById(rezervacija.PaketiHrane_id, paketiHrane)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {getMultipleNamesByIds(rezervacija.Dekoracije_id, dekoracije)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {getMultipleNamesByIds(rezervacija.Usluge_id, usluge)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(rezervacija.ID)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Obriši rezervaciju"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  Nema rezultata za prikaz
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rezervacije;