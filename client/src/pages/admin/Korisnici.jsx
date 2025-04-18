import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync, FaUserShield, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Korisnici = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    ID: '',
    email: '',
    sifra: '',
    username: '',
    uloga: 'korisnik'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchKorisnici();
  }, []);

  const fetchKorisnici = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/korisnici');
      if (!response.ok) {
        throw new Error('Greška pri učitavanju korisnika');
      }
      const data = await response.json();
      setKorisnici(data);
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
        ? `http://localhost:3000/korisnici/${formData.ID}`
        : 'http://localhost:3000/korisnici';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Don't send password when editing unless it's changed
      const dataToSend = isEditing && !formData.sifra 
        ? { ...formData, sifra: undefined }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`Greška pri ${isEditing ? 'ažuriranju' : 'dodavanju'} korisnika`);
      }

      fetchKorisnici();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (korisnik) => {
    setFormData({
      ID: korisnik.ID,
      email: korisnik.email,
      sifra: '', // Don't pre-fill password for security
      username: korisnik.username,
      uloga: korisnik.uloga
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/korisnici/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju korisnika');
      }

      fetchKorisnici();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ID: '',
      email: '',
      sifra: '',
      username: '',
      uloga: 'korisnik'
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const filteredKorisnici = korisnici.filter(korisnik =>
    korisnik.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    korisnik.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    korisnik.uloga.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={fetchKorisnici}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upravljanje Korisnicima</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Pretraži korisnike..."
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
            {showForm ? 'Zatvori' : <><FaPlus className="mr-2" /> Novi Korisnik</>}
          </button>
          <button
            onClick={fetchKorisnici}
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
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Uredi Korisnika' : 'Dodaj Novog Korisnika'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Korisničko ime</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Šifra {isEditing && '(ostavite prazno za ne mijenjati)'}</label>
                <input
                  type="password"
                  name="sifra"
                  value={formData.sifra}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isEditing}
                  minLength="6"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Uloga</label>
                <select
                  name="uloga"
                  value={formData.uloga}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="korisnik">Korisnik</option>
                  <option value="admin">Admin</option>
                </select>
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
                {isEditing ? 'Spremi Promjene' : 'Dodaj Korisnika'}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Korisničko ime</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uloga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredKorisnici.length > 0 ? (
              filteredKorisnici.map((korisnik) => (
                <tr key={korisnik.ID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{korisnik.ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{korisnik.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{korisnik.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      korisnik.uloga === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {korisnik.uloga === 'admin' ? (
                        <FaUserShield className="mr-1" />
                      ) : (
                        <FaUser className="mr-1" />
                      )}
                      {korisnik.uloga}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(korisnik)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(korisnik.ID)}
                      className="text-red-600 hover:text-red-900"
                      disabled={korisnik.uloga === 'admin'} // Prevent deleting admin
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

export default Korisnici;