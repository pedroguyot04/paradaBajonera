import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import './Registro.css';

class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      email: '',
      password: '',
      rol: 'Empleado',
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

    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        db.collection('users').add({ nombre, email, password, rol });
        this.setState({ registrado: true });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    if (this.state.registrado) return <Navigate to="/home" />;

    return (
      <div className="registro-container">
        <h2 className="registro-titulo">Registro</h2>
        <form onSubmit={this.enviarFormularioRegistro} className="registro-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={this.state.nombre}
            onChange={this.manejarCambio}
            required
            className="registro-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.manejarCambio}
            required
            className="registro-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={this.state.password}
            onChange={this.manejarCambio}
            required
            className="registro-input"
          />
          <label htmlFor="rol" className="registro-label">Seleccione su rol:</label>
          <select
            name="rol"
            value={this.state.rol}
            onChange={this.manejarCambio}
            id="rol"
            required
            className="registro-select"
          >
            <option value="Empleado">Empleado</option>
            <option value="Toto">Toto</option>
          </select>
          <button type="submit" className="registro-boton">Registrarse</button>
        </form>
        {this.state.error && <p className="registro-error">{this.state.error}</p>}
        <p className="registro-link">¿Ya tenés cuenta? <Link to="/">Ir a login</Link></p>
      </div>
    );
  }
}

export default Registro;
