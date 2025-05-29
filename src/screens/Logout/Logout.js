import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

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
      <div style={{ padding: 20 }}>
        <h2>¿Querés cerrar sesión?</h2>
        <button onClick={this.cerrarSesion}>Cerrar sesión</button>
      </div>
    );
  }
}

export default Logout;
