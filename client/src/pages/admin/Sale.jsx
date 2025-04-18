import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaHome, FaChair, FaUtensils } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Sale = () => {
  const [sale, setSale] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    ID: '',
    naziv_sale: '',
    broj_mjesta: '',
    adresa: '',
    broj_stolova: '',
    broj_stolica: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/svadbenesale');
      if (!response.ok) {
        throw new Error('Greška pri učitavanju sala');
      }
      const data = await response.json();
      setSale(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:3000/svadbenesale/${formData.ID}`
        : 'http://localhost:3000/svadbenesale';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          broj_mjesta: Number(formData.broj_mjesta),
          broj_stolova: Number(formData.broj_stolova),
          broj_stolica: Number(formData.broj_stolica)
        })
      });

      if (!response.ok) {
        throw new Error(`Greška pri ${isEditing ? 'ažuriranju' : 'dodavanju'} sale`);
      }

      fetchSale();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (sala) => {
    setFormData({
      ID: sala.ID,
      naziv_sale: sala.naziv_sale,
      broj_mjesta: sala.broj_mjesta,
      adresa: sala.adresa,
      broj_stolova: sala.broj_stolova,
      broj_stolica: sala.broj_stolica
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu salu?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/svadbenesale/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju sale');
      }

      fetchSale();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ID: '',
      naziv_sale: '',
      broj_mjesta: '',
      adresa: '',
      broj_stolova: '',
      broj_stolica: ''
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const filteredSale = sale.filter(sala =>
    sala.naziv_sale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.adresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={fetchSale}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upravljanje Svadbenim Salama</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Pretraži sale..."
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
            {showForm ? 'Zatvori' : <><FaPlus className="mr-2" /> Nova Sala</>}
          </button>
          <button
            onClick={fetchSale}
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
            <FaHome className="mr-2 text-blue-500" />
            {isEditing ? 'Uredi Svadbenu Salu' : 'Dodaj Novu Svadbenu Salu'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Naziv sale</label>
                <input
                  type="text"
                  name="naziv_sale"
                  value={formData.naziv_sale}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Adresa</label>
                <input
                  type="text"
                  name="adresa"
                  value={formData.adresa}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Broj mjesta</label>
                <input
                  type="number"
                  name="broj_mjesta"
                  value={formData.broj_mjesta}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Broj stolova</label>
                <input
                  type="number"
                  name="broj_stolova"
                  value={formData.broj_stolova}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Broj stolica</label>
                <input
                  type="number"
                  name="broj_stolica"
                  value={formData.broj_stolica}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
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
                {isEditing ? 'Spremi Promjene' : 'Dodaj Salę'}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv sale</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaChair className="mr-1" /> Mjesta
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaUtensils className="mr-1" /> Stolovi
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSale.length > 0 ? (
              filteredSale.map((sala) => (
                <tr key={sala.ID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sala.ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sala.naziv_sale}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sala.adresa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sala.broj_mjesta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sala.broj_stolova}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(sala)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(sala.ID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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

export default Sale;