import React, { Component } from "react";
import { Navigate, Link } from 'react-router-dom';
import { auth } from '../../firebase/config';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirigir: false
    };
    this.enviarFormularioLogin = this.enviarFormularioLogin.bind(this);
  }

  enviarFormularioLogin(event) {
    event.preventDefault();
    const { email, password } = this.state;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ redirigir: true });
      })
      .catch((error) => {
        console.log("Error de login:", error.message);
        alert("Email o contraseña incorrectos");
      });
  }

  render() {
    if (this.state.redirigir) return <Navigate to="/home" />;

    return (
      <div className="login-container">
        <form onSubmit={this.enviarFormularioLogin} className="login-form">
          <h2 className="login-titulo">Iniciar Sesión</h2>
          <input
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            required
            className="login-input"
          />
          <button type="submit" className="login-boton">Enviar</button>
        </form>
        <p className="login-link">
          ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
        </p>
      </div>
    );
  }
}

export default Login;

