import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Usluge = () => {
  const [usluge, setUsluge] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    naziv: '',
    opis: '',
    cijena: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsluge();
  }, []);

  const fetchUsluge = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/usluge');
      if (!response.ok) {
        throw new Error('Greška pri učitavanju usluga');
      }
      const data = await response.json();
      setUsluge(data);
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
        ? `http://localhost:3000/usluge/${formData.id}`
        : 'http://localhost:3000/usluge';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cijena: Number(formData.cijena)
        })
      });

      if (!response.ok) {
        throw new Error(`Greška pri ${isEditing ? 'ažuriranju' : 'dodavanju'} usluge`);
      }

      fetchUsluge();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (usluga) => {
    setFormData({
      id: usluga.id,
      naziv: usluga.naziv,
      opis: usluga.opis,
      cijena: usluga.cijena
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu uslugu?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/usluge/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju usluge');
      }

      fetchUsluge();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      naziv: '',
      opis: '',
      cijena: ''
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const filteredUsluge = usluge.filter(usluga =>
    usluga.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usluga.opis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usluga.cijena.toString().includes(searchTerm)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ba-BA', {
      style: 'currency',
      currency: 'BAM'
    }).format(amount);
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
          onClick={fetchUsluge}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upravljanje Uslugama</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Pretraži usluge..."
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
            {showForm ? 'Zatvori' : <><FaPlus className="mr-2" /> Nova Usluga</>}
          </button>
          <button
            onClick={fetchUsluge}
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
            <FaMoneyBillWave className="mr-2 text-blue-500" />
            {isEditing ? 'Uredi Uslugu' : 'Dodaj Novu Uslugu'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Naziv usluge</label>
                <input
                  type="text"
                  name="naziv"
                  value={formData.naziv}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Opis usluge</label>
                <textarea
                  name="opis"
                  value={formData.opis}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Cijena (KM)</label>
                <input
                  type="number"
                  name="cijena"
                  value={formData.cijena}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
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
                {isEditing ? 'Spremi Promjene' : 'Dodaj Uslugu'}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaInfoCircle className="mr-2" /> Opis
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FaMoneyBillWave className="mr-2" /> Cijena
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsluge.length > 0 ? (
              filteredUsluge.map((usluga) => (
                <tr key={usluga.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usluga.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usluga.naziv}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {usluga.opis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(usluga.cijena)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(usluga)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(usluga.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
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

export default Usluge;