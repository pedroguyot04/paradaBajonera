import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src="/logoPB.jpeg"
          alt="Logo Parada Bajonera"
          className="logo"
        />
        <h1 className="title">Parada Bajonera</h1>
      </div>
    </header>
  );
};

export default Header;
