
import React from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';

import ResumenTurno from '../../components/Ventas/ResumenTurno/ResumenTurno';
import TablaVentas from '../../components/Ventas/TablaVentas/TablaVentas';

import './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      rol: '',
      fecha: this.obtenerFechaHoy(),
      turnoSeleccionado: '',
      resumenTurnos: {
        manana: this.estadoInicialTurno(),
        tarde: this.estadoInicialTurno()
      },
      cargando: true,
      error: ''
    };
  }

  estadoInicialTurno = () => ({
    aperturaCaja: '',
    empleado: '',
    ventas: [],
    totalEfectivo: 0,
    totalPosnet: 0,
    totalMercadoPago: 0,
    totalGeneral: 0
  });

  componentDidMount() {
    auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        const email = usuario.email;
        this.setState({ email });

        db.collection('users')
          .where('email', '==', email)
          .get()
          .then((snap) => {
            if (!snap.empty) {
              const rol = snap.docs[0].data().rol;
              this.setState({ rol }, () =>
                this.cargarResumenTurnos(email, this.state.fecha)
              );
            }
          })
          .catch((error) =>
            this.setState({ error: 'Error buscando usuario: ' + error.message })
          );
      }
    });
  }

  obtenerFechaHoy() {
    return new Date().toISOString().split('T')[0];
  }

  renderResumenTurno = (turno) => {
    return <ResumenTurno datos={this.state.resumenTurnos[turno]} turno={turno} />;
  }

  cargarResumenTurnos = (email, fecha) => {
    const turnos = ['manana', 'tarde'];
    const resumenTurnos = { ...this.state.resumenTurnos };

    Promise.all(
      turnos.map(turno =>
        db.collection('resumenes')
          .doc(`${email}_${fecha}_${turno}`)
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              resumenTurnos[turno] = {
                ...this.estadoInicialTurno(),
                aperturaCaja: data.aperturaCaja || '',
                empleado: data.empleado || '',
                ventas: data.ventas || []
              };
              this.actualizarTotalesTurno(turno, resumenTurnos[turno].ventas);
            }
          })
      )
    )
      .then(() => this.setState({ resumenTurnos, cargando: false }))
      .catch(error =>
        this.setState({ error: 'Error cargando resumenes: ' + error.message, cargando: false })
      );
  };

  actualizarTotalesTurno = (turno, ventas) => {
    let totalEfectivo = 0, totalPosnet = 0, totalMercadoPago = 0;
    ventas.forEach(v => {
      totalEfectivo += Number(v.efectivo) || 0;
      totalPosnet += Number(v.Posnet) || 0;
      totalMercadoPago += Number(v.mercadoPago) || 0;
    });
    const totalGeneral = totalEfectivo + totalPosnet + totalMercadoPago;

    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      resumenTurnos[turno] = {
        ...resumenTurnos[turno],
        ventas,
        totalEfectivo,
        totalPosnet,
        totalMercadoPago,
        totalGeneral
      };
      return { resumenTurnos };
    });
  };

  manejarCambioArriba = (turno, campo, valor) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      resumenTurnos[turno][campo] = valor;
      return { resumenTurnos };
    });
  };

  manejarCambioVenta = (turno, index, campo, valor) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      const ventas = [...resumenTurnos[turno].ventas];
      ventas[index] = { ...ventas[index], [campo]: campo === 'pedido' ? valor : Number(valor) || 0 };
      resumenTurnos[turno].ventas = ventas;
      return { resumenTurnos };
    }, () => this.actualizarTotalesTurno(turno, this.state.resumenTurnos[turno].ventas));
  };

  agregarVenta = (turno) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      resumenTurnos[turno].ventas.push({ pedido: '', efectivo: 0, Posnet: 0, mercadoPago: 0 });
      return { resumenTurnos };
    });
  };

  eliminarVenta = (turno, index) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      resumenTurnos[turno].ventas.splice(index, 1);
      return { resumenTurnos };
    }, () => this.actualizarTotalesTurno(turno, this.state.resumenTurnos[turno].ventas));
  };

  guardarResumen = () => {
    const { email, fecha, turnoSeleccionado, resumenTurnos } = this.state;
    const datos = resumenTurnos[turnoSeleccionado];

    db.collection('resumenes')
      .doc(`${email}_${fecha}_${turnoSeleccionado}`)
      .set({
        aperturaCaja: datos.aperturaCaja,
        empleado: datos.empleado,
        ventas: datos.ventas
      })
      .then(() => alert('Resumen guardado con éxito.'))
      .catch(error => alert('Error al guardar: ' + error.message));
  };

  render() {
    const { email, rol, fecha, turnoSeleccionado, cargando, error, resumenTurnos } = this.state;

    if (cargando) return <p className="home-loading">Cargando...</p>;
    if (error) return <p className="home-error">{error}</p>;

    return (
      <div className="home-container">
        <h1>Bienvenido</h1>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Rol:</strong> {rol}</p>
        <p><strong>Fecha:</strong> {fecha}</p>

        {rol.toLowerCase() === 'toto' && (
          <>
            <h2>Resumen turnos</h2>
            {this.renderResumenTurno('manana')}
            {this.renderResumenTurno('tarde')}

            <button
              className="home-reiniciar-boton"
              onClick={() => {
                if (window.confirm(`Caja cerrada y gastos del día ${fecha} registrados. ¿Reiniciar caja para el día siguiente?`)) {
                  const fechaActual = new Date(fecha);
                  fechaActual.setDate(fechaActual.getDate() + 1);
                  const fechaSiguiente = fechaActual.toISOString().split('T')[0];

                  this.setState({
                    fecha: fechaSiguiente,
                    resumenTurnos: {
                      manana: this.estadoInicialTurno(),
                      tarde: this.estadoInicialTurno()
                    },
                    turnoSeleccionado: '',
                  });
                }
              }}
            >
              Gastos del día {fecha} registrados == Reiniciar Caja
            </button>
          </>
        )}

        <h2>Anotar Ventas</h2>
        <label className="home-turno-label">
          Turno:
          <select
            value={turnoSeleccionado}
            onChange={e => this.setState({ turnoSeleccionado: e.target.value })}
            className="home-turno-select"
          >
            <option value="">-</option>
            <option value="manana">Mañana</option>
            <option value="tarde">Tarde</option>
          </select>
        </label>

        {turnoSeleccionado && (
          <TablaVentas
            datos={resumenTurnos[turnoSeleccionado]}
            turno={turnoSeleccionado}
            manejarCambioArriba={this.manejarCambioArriba}
            manejarCambioVenta={this.manejarCambioVenta}
            agregarVenta={this.agregarVenta}
            eliminarVenta={this.eliminarVenta}
            guardarResumen={this.guardarResumen}
          />
        )}

        <Link className="home-logout-link" to="/logout">Cerrar sesión</Link>
      </div>
    );
  }
}

export default Home;
