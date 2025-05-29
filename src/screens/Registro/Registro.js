import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';

class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      registrado: false,
    };
  }

  manejarCambio = (evento) => {
    this.setState({ [evento.target.name]: evento.target.value });
  };

  enviarFormularioRegistro = (evento) => {
    evento.preventDefault();
    console.log('Email:', this.state.email);
    console.log('Contraseña:', this.state.password);
    this.setState({ registrado: true });
  };

  render() {
    if (this.state.registrado) return <Navigate to="/home" />;

    return (
      <div style={{ padding: 20 }}>
        <h2>Registro</h2>
        <form onSubmit={this.enviarFormularioRegistro}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.manejarCambio}
          /><br /><br />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={this.state.password}
            onChange={this.manejarCambio}
          /><br /><br />
          <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tenés cuenta? <Link to="/login">Ir a login</Link></p>
      </div>
    );
  }
}

export default Registro;
