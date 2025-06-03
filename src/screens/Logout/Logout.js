import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import './Logout.css';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salir: false
    };
  }

  cerrarSesion = () => {
    auth.signOut()
      .then(() => {
        this.setState({ salir: true });
      })
      .catch(error => {
        console.log('Error al cerrar sesión:', error.message);
      });
  }

  render() {
    if (this.state.salir) return <Navigate to="/" />;
    return (
      <div className="logout-container" style={{ padding: 20 }}>
        <h2 className="logout-title">¿Querés cerrar sesión?</h2>
        <button className="logout-boton" onClick={this.cerrarSesion}>Cerrar sesión</button>
      </div>
    );
  }
}

export default Logout;
