import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';

class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      email: '',
      password: '',
      rol: 'Empleado',  // Valor por defecto
      registrado: false,
      error: ''
    };
  }

  manejarCambio = (evento) => {
    this.setState({ [evento.target.name]: evento.target.value });
  };

  enviarFormularioRegistro = (evento) => {
    evento.preventDefault();
    const { nombre, email, password, rol } = this.state;

    console.log('Nombre:', nombre);
    console.log('Email:', email);
    console.log('Contraseña:', password);
    console.log('Rol:', rol);

    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        db.collection('users').add({
          nombre: nombre,
          email: email,
          password: password,
          rol: rol
        });
        this.setState({ registrado: true });
      })
      .catch((error) => {
        console.log('Error al registrar:', error.message);
        this.setState({ error: error.message });
      });
  };

  render() {
    if (this.state.registrado) return <Navigate to="/home" />;

    return (
      <div style={{ padding: 20 }}>
        <h2>Registro</h2>
        <form onSubmit={this.enviarFormularioRegistro}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={this.state.nombre}
            onChange={this.manejarCambio}
            required
          /><br /><br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.manejarCambio}
            required
          /><br /><br />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={this.state.password}
            onChange={this.manejarCambio}
            required
          /><br /><br />
          <label htmlFor="rol">Seleccione su rol:</label><br />
          <select
            name="rol"
            value={this.state.rol}
            onChange={this.manejarCambio}
            id="rol"
            required
          >
            <option value="Empleado">Empleado</option>
            <option value="Toto">Toto</option>
          </select>
          <br /><br />
          <button type="submit">Registrarse</button>
        </form>
        {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
        <p>¿Ya tenés cuenta? <Link to="/">Ir a login</Link></p>
      </div>
    );
  }
}

export default Registro;
