import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setIsLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <FaHeart className="absolute top-20 left-10 text-rose-200 text-9xl" />
        <FaHeart className="absolute bottom-40 right-20 text-rose-200 text-9xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-rose-500 to-rose-300 text-white px-6 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
            KONTAKT
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-serif">
            <span className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">Pišite</span> Nam
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Spremni smo da odgovorimo na sva vaša pitanja i pretvorimo vaše snove o savršenom vjenčanju u stvarnost.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-rose-300 to-rose-200 mx-auto"></div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 mb-20"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-50 opacity-80"></div>
            <div className="relative p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Informacije</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-full mr-6">
                    <FaPhone className="text-rose-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Telefon</h3>
                    <p className="text-gray-600">+387 61 234 567</p>
                    <p className="text-gray-600">+387 61 234 568</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-full mr-6">
                    <FaEnvelope className="text-rose-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@weddingplanner.ba</p>
                    <p className="text-gray-600">sales@weddingplanner.ba</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-full mr-6">
                    <FaMapMarkerAlt className="text-rose-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Adresa</h3>
                    <p className="text-gray-600">Trg nezavisnosti 1</p>
                    <p className="text-gray-600">71000 Sarajevo, BiH</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-full mr-6">
                    <FaClock className="text-rose-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Radno vrijeme</h3>
                    <p className="text-gray-600">Ponedjeljak - Petak: 09:00 - 17:00</p>
                    <p className="text-gray-600">Subota: 09:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-50 opacity-80"></div>
            <div className="relative p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Pošaljite Poruku</h2>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-8"
                >
                  <p className="font-medium">Hvala vam na poruci!</p>
                  <p>Javit ćemo vam se u najkraćem mogućem roku.</p>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ime i Prezime</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300"
                    placeholder="Vaše ime i prezime"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Adresa</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300"
                    placeholder="vaš@email.com"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Broj Telefona</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300"
                    placeholder="+387 61 234 567"
                  />
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Vaša Poruka</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300"
                    placeholder="Opišite nam vaše želje i potrebe..."
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-3" />
                      Pošalji Poruku
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <iframe
            title="Our Location"
            width="100%"
            height="450"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://maps.google.com/maps?q=Trg%20nezavisnosti%201%2C%20Sarajevo&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;