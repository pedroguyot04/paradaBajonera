import { Routes, Route } from 'react-router-dom';
import Registro from './screens/Registro/Registro';
import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import Logout from './screens/Logout/Logout';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Header />
      
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          {/* Ruta 404 */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;


