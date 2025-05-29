import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';

class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      registrado: false,
      error: ''
    };
  }

  manejarCambio = (evento) => {
    this.setState({ [evento.target.name]: evento.target.value });
  };

  enviarFormularioRegistro = (evento) => {
    evento.preventDefault();
    const { email, password } = this.state;

    console.log('Email:', email);
    console.log('Contraseña:', password);

    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        db.collection('users').add({
          email: email,
          password: password
        });
        this.setState({ registrado: true });
      })
      .catch((error) => {
        console.log('Error al registrar:', error.message);
      });
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
        <p>¿Ya tenés cuenta? <Link to="/">Ir a login</Link></p>
      </div>
    );
  }
}

export default Registro;
