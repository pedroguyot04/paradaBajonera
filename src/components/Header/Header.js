// Header.js
import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#0077cc', color: 'white', padding: '10px 20px' }}>
      <h1>Mi Aplicación</h1>
      <nav>
        <a href="/home" style={{ color: 'white', marginRight: 15 }}>Inicio</a>
      </nav>
    </header>
  );
};

export default Header;
