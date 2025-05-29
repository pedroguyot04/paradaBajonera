import React, { Component } from "react";
import { Navigate } from 'react-router-dom';


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
        console.log("Email:", this.state.email);
        console.log("Password:", this.state.password);
        this.setState({ redirigir: true });

    }

    render() {
        if (this.state.redirigir) {
            return <Navigate to="/home" />;
        }
        return (
            <form onSubmit={this.enviarFormularioLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    required
                />
                <button type="submit">Enviar</button>
            </form>

        );
    }
}

export default Login;

