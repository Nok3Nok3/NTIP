import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaCalendarAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Termini = () => {
  const [termini, setTermini] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    datum: '',
    vrijeme: '',
    dostupnost: 1
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTermini();
    fetchRezervacije();
  }, []);

  const fetchTermini = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/termini');
      if (!response.ok) {
        throw new Error('Greška pri učitavanju termina');
      }
      const data = await response.json();
      setTermini(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRezervacije = async () => {
    try {
      const response = await fetch('http://localhost:3000/rezervacije');
      if (!response.ok) {
        throw new Error('Greška pri učitavanju rezervacija');
      }
      const data = await response.json();
      setRezervacije(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  };

  // Check if a termin has any reservations
  const hasReservation = (terminId) => {
    return rezervacije.some(rezervacija => rezervacija.Termin_id === terminId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 1 : 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:3000/termini/${formData.id}`
        : 'http://localhost:3000/termini';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dostupnost: Number(formData.dostupnost)
        })
      });

      if (!response.ok) {
        throw new Error(`Greška pri ${isEditing ? 'ažuriranju' : 'dodavanju'} termina`);
      }

      fetchTermini();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (termin) => {
    setFormData({
      id: termin.id,
      datum: termin.datum,
      vrijeme: termin.vrijeme.substring(0, 5),
      dostupnost: termin.dostupnost
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    // Check if there are reservations for this termin
    if (hasReservation(id)) {
      alert('Ne možete obrisati termin jer postoje rezervacije za njega!');
      return;
    }

    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj termin?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/termini/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju termina');
      }

      fetchTermini();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      datum: '',
      vrijeme: '',
      dostupnost: 1
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const filteredTermini = termini.filter(termin =>
    termin.datum.includes(searchTerm) ||
    termin.vrijeme.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('hr-HR', options);
  };

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
          onClick={fetchTermini}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upravljanje Terminima</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Pretraži termine..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            {showForm ? 'Zatvori' : <><FaPlus className="mr-2" /> Novi Termin</>}
          </button>
          <button
            onClick={() => {
              fetchTermini();
              fetchRezervacije();
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <FaSync className="mr-2" /> Osvježi
          </button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            {isEditing ? 'Uredi Termin' : 'Dodaj Novi Termin'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Datum</label>
                <input
                  type="date"
                  name="datum"
                  value={formData.datum}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Vrijeme</label>
                <input
                  type="time"
                  name="vrijeme"
                  value={formData.vrijeme}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="dostupnost"
                  checked={formData.dostupnost === 1}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  id="dostupnost-checkbox"
                  disabled={isEditing && hasReservation(formData.id)}
                />
                <label htmlFor="dostupnost-checkbox" className="ml-2 block text-gray-700">
                  Dostupnost {isEditing && hasReservation(formData.id) && "(Zauzeto - ima rezervaciju)"}
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                {isEditing ? 'Spremi Promjene' : 'Dodaj Termin'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" /> Datum
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaClock className="mr-2" /> Vrijeme
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dostupnost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTermini.length > 0 ? (
              filteredTermini.map((termin) => {
                const isReserved = hasReservation(termin.id);
                const actualAvailability = isReserved ? 0 : termin.dostupnost;
                
                return (
                  <tr key={termin.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{termin.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(termin.datum)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {termin.vrijeme.substring(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {actualAvailability === 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCheck className="mr-1" /> Dostupno
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FaTimes className="mr-1" /> {isReserved ? 'Zauzeto (rezervacija)' : 'Zauzeto'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(termin)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        disabled={isReserved}
                        title={isReserved ? 'Termin ima rezervaciju - ne može se mijenjati' : ''}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(termin.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isReserved}
                        title={isReserved ? 'Termin ima rezervaciju - ne može se brisati' : ''}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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

export default Termini;