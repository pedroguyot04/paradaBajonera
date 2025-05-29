// src/screens/Home/Home.js
import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mensaje: 'Bienvenido al Home',
    };
  }

  render() {
    return (
      <div>
        <h1>{this.state.mensaje}</h1>
        <p>Acá va a ir el contenido del sistema de ventas.</p>
      </div>
    );
  }
}

export default Home;
