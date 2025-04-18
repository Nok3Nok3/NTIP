import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Termin from './pages/Termini';
import Dekoracije from './pages/Dekoracije';
import PaketiHrane from './pages/PaketiHrane';
import SvadbeneSale from './pages/SvadbeneSale';
import Usluge from './pages/Usluge';
import Pregled from './pages/Pregled';
import MojeRezervacije from './pages/MojeRezervacije';
import Dekoracijea from './pages/admin/Dekoracije';
import Korisnici from './pages/admin/Korisnici';
import Paketi from './pages/admin/Paketi';
import Sale from './pages/admin/Sale';
import Termini from './pages/admin/Termini';
import Uslugee from './pages/admin/Usluge';
import Rezervacijee from './pages/admin/Rezervacije';

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } />
            <Route path="/termini" element={
              <ProtectedRoute>
                <Termin />
              </ProtectedRoute>
            } />
            <Route path="/dekoracije" element={
              <ProtectedRoute>
                <Dekoracije />
              </ProtectedRoute>
            } />
            <Route path="/paketihrane" element={
              <ProtectedRoute>
                <PaketiHrane />
              </ProtectedRoute>
            } />
            <Route path="/svadbenesale" element={
              <ProtectedRoute>
                <SvadbeneSale />
              </ProtectedRoute>
            } />
            <Route path="/usluge" element={
              <ProtectedRoute>
                <Usluge />
              </ProtectedRoute>
            } />
            <Route path="/pregled" element={
              <ProtectedRoute>
                <Pregled />
              </ProtectedRoute>
            } />
            <Route path="/mojerezervacije" element={
              <ProtectedRoute>
                <MojeRezervacije />
              </ProtectedRoute>
            } />
            <Route path="/dekoracijea" element={
              <ProtectedRoute>
                <Dekoracijea />
              </ProtectedRoute>
            } />
            <Route path="/korisnici" element={
              <ProtectedRoute>
                <Korisnici />
              </ProtectedRoute>
            } />
            <Route path="/paketia" element={
              <ProtectedRoute>
                <Paketi />
              </ProtectedRoute>
            } />
            <Route path="/salea" element={
              <ProtectedRoute>
                <Sale />
              </ProtectedRoute>
            } />
            <Route path="/terminii" element={
              <ProtectedRoute>
                <Termini />
              </ProtectedRoute>
            } />
            <Route path="/uslugee" element={
              <ProtectedRoute>
                <Uslugee />
              </ProtectedRoute>
            } />
            <Route path="/rezervacijee" element={
              <ProtectedRoute>
                <Rezervacijee/>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;