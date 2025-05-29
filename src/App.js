import { Routes, Route } from 'react-router-dom';
import Registro from './screens/Registro/Registro';
import Login from './screens/Login/Login';
import Home from './screens/Home/Home';

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      {/* Ruta 404 */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;





