import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-rose-50/20 to-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50 z-10"></div>
          <div className="absolute inset-0 bg-rose-100/20"></div>
          <div className="absolute right-0 top-0 h-full w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Happy wedding couple"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center min-h-[70vh] md:min-h-[80vh]"
          >
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                variants={slideUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Vaše savršeno <span className="text-rose-600">vjenčanje</span> počinje ovdje
              </motion.h1>
              
              <motion.p 
                variants={slideUp}
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg"
              >
                Profesionalno organiziramo nezaboravna vjenčanja već više od 10 godina. Prepustite nam brigu dok vi uživate u svakom trenutku.
              </motion.p>
              
              <motion.div 
                variants={slideUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link 
                  to="/create-appointment" 
                  className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  Kreiraj termin
                </Link>
                <Link 
                  to="/about" 
                  className="border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-medium py-3 px-6 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  Saznaj više
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={slideUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Zašto izabrati nas?
            </motion.h2>
            <motion.p 
              variants={slideUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Naše premium usluge će vaše vjenčanje pretvoriti u nezaboravan događaj
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '💍',
                title: 'Personalizovani pristup',
                description: 'Svako vjenčanje je jedinstveno i mi to shvatamo ozbiljno. Kreirat ćemo potpuno customiziran plan samo za vas.'
              },
              {
                icon: '📅',
                title: 'Fleksibilni termini',
                description: 'Radimo po vašem rasporedu i prilagođavamo se vama. Nema krutih pravila - vaš dan, vaši termini.'
              },
              {
                icon: '💰',
                title: 'Transparentne cijene',
                description: 'Bez skrivenih troškova - sve je jasno od početka. Fiksni paketi ili modularni izbor usluga.'
              },
              {
                icon: '🏆',
                title: 'Elitno iskustvo',
                description: 'Više od 200 luksuzno organizovanih vjenčanja. Ekskluzivni partneri i premium lokacije.'
              },
              {
                icon: '👰',
                title: 'Kompletnost',
                description: 'Organizujemo sve od lokacija do cateringa. Jedna kontakt osoba za sve aspekte vašeg dana.'
              },
              {
                icon: '🛡️',
                title: 'Garancija kvaliteta',
                description: 'Svi događaji su osigurani i imaju backup planove. Vaše mirno spavanje je naš prioritet.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl border border-gray-100 hover:border-rose-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-rose-500">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Iskustva naših klijenata
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Donosimo vam iskrene reakcije parova čija smo vjenčanja organizovali
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                name: 'Ana i Marko',
                quote: 'Najbolja odluka koju smo donijeli! Svaka detalj je bio savršeno organizovan, od dekoracija do rasporeda događaja. Tim je bio uvijek dostupan i profesionalan.',
                rating: '★★★★★',
                date: 'Svadba u augustu 2023'
              },
              {
                name: 'Lejla i Amar',
                quote: 'Hvala vam što ste naš dan učinili tako posebnim. Sve je proteklo bez i najmanjeg stresa. Gosti su bili oduševljeni organizacijom i detaljima.',
                rating: '★★★★★',
                date: 'Vjenčanje u juni 2023'
              },
              {
                name: 'Jelena i Nikola',
                quote: 'Profesionalizam na najvišem nivou. Od prvog sastanka do posljednjeg detalja - sve je bilo besprijekorno. Preporučujemo svima koje znam!',
                rating: '★★★★★',
                date: 'Proslava u septembru 2023'
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-600 italic mb-6 leading-relaxed">"{testimonial.quote}"</blockquote>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Naši radovi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pogledajte fotografije s nekih od naših organizovanih vjenčanja
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            ].map((img, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-lg aspect-square"
              >
                <img 
                  src={img} 
                  alt={`Wedding ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Vjenčanje #{index + 1}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Link 
              to="/portfolio" 
              className="inline-block border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Pogledajte više
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-rose-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={slideUp}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Spremni za vaše vjenčanje?
            </motion.h2>
            <motion.p 
              variants={slideUp}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Kontaktirajte nas danas i započnite planiranje vašeg savršenog dana
            </motion.p>
            <motion.div 
              variants={slideUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link 
                to="/contact" 
                className="bg-white text-rose-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Kontaktirajte nas
              </Link>
              <Link 
                to="/create-appointment" 
                className="border-2 border-white text-white hover:bg-rose-800 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Kreiraj termin
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;