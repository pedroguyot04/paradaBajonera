import React from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';

import ResumenTurno from '../../components/Ventas/ResumenTurno/ResumenTurno';
import TablaVentas from '../../components/Ventas/TablaVentas/TablaVentas';
import ResumenDiario from '../../components/Ventas/ResumenDiario/ResumenDiario';

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
        mañana: this.estadoInicialTurno(),
        tarde: this.estadoInicialTurno()
      },
      cargando: true,
      error: '',
      hayCambios: false,
    };

    this.unsubscribeResumenes = null; // para guardar el listener y limpiar luego
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
              this.setState({ rol }, () => {
                this.iniciarListenerResumenes(email, this.state.fecha);
              });
            } else {
              this.setState({ error: 'Usuario sin rol asignado', cargando: false });
            }
          })
          .catch((error) =>
            this.setState({ error: 'Error buscando usuario: ' + error.message })
          );
      }
    });
    window.addEventListener('beforeunload', this.manejarAntesDeSalir);
  }

  componentWillUnmount() {
    if (this.unsubscribeResumenes) {
      this.unsubscribeResumenes(); // Desuscribirse al desmontar el componente
    }
    window.removeEventListener('beforeunload', this.manejarAntesDeSalir);
  }

  obtenerFechaHoy() {
    return new Date().toISOString().split('T')[0];
  }

  manejarAntesDeSalir = (e) => {
    if (this.state.hayCambios) {
      e.preventDefault();
      e.returnValue = '';  // Esto hace que el navegador muestre el warning estándar
    }
  };

  iniciarListenerResumenes = (email, fecha) => {
    if (this.unsubscribeResumenes) {
      this.unsubscribeResumenes();
    }

    const turnos = ['mañana', 'tarde'];

    if (this.state.rol.toLowerCase() === 'toto') {
      // Para toto: traer todos los resumenes del día para cada turno, y consolidar
      this.unsubscribeResumenes = db.collection('resumenes')
        .where('fecha', '==', fecha)
        .onSnapshot(snapshot => {
          const resumenesPorTurno = {
            mañana: this.estadoInicialTurno(),
            tarde: this.estadoInicialTurno(),
          };

          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const turno = data.turno;

            if (!turnos.includes(turno)) return;

            const ventas = data.ventas || [];

            resumenesPorTurno[turno].ventas = resumenesPorTurno[turno].ventas.concat(ventas);
            resumenesPorTurno[turno].aperturaCaja = resumenesPorTurno[turno].aperturaCaja || data.aperturaCaja || '';
            if (!resumenesPorTurno[turno].empleado.includes(data.empleado)) {
              resumenesPorTurno[turno].empleado += (resumenesPorTurno[turno].empleado ? ' / ' : '') + (data.empleado || '');
            }


            // Sumar totales
            ventas.forEach(v => {
              resumenesPorTurno[turno].totalEfectivo += Number(v.efectivo) || 0;
              resumenesPorTurno[turno].totalPosnet += Number(v.posnet) || 0;
              resumenesPorTurno[turno].totalMercadoPago += Number(v.mercadoPago) || 0;
            });
          });

          // Calcular total general
          Object.keys(resumenesPorTurno).forEach(turno => {
            const r = resumenesPorTurno[turno];
            r.totalGeneral = r.totalEfectivo + r.totalPosnet + r.totalMercadoPago;
          });

          this.setState({ resumenTurnos: resumenesPorTurno, cargando: false });
        }, error => {
          this.setState({ error: 'Error en snapshot: ' + error.message, cargando: false });
        });

    } else {
      // Para otros usuarios, cargar solo su resumen por turno como antes
      const listeners = turnos.map(turno => {
        const docRef = db.collection('resumenes').doc(`${email}_${fecha}_${turno}`);
        return docRef.onSnapshot(doc => {
          const resumenTurnos = { ...this.state.resumenTurnos };
          if (doc.exists) {
            const data = doc.data();
            const ventas = data.ventas || [];
            let totalEfectivo = 0, totalPosnet = 0, totalMercadoPago = 0;
            ventas.forEach(v => {
              totalEfectivo += Number(v.efectivo) || 0;
              totalPosnet += Number(v.posnet) || 0;
              totalMercadoPago += Number(v.mercadoPago) || 0;
            });
            const totalGeneral = totalEfectivo + totalPosnet + totalMercadoPago;

            resumenTurnos[turno] = {
              aperturaCaja: data.aperturaCaja || '',
              empleado: data.empleado || '',
              ventas,
              totalEfectivo,
              totalPosnet,
              totalMercadoPago,
              totalGeneral
            };
          } else {
            resumenTurnos[turno] = this.estadoInicialTurno();
          }
          this.setState({ resumenTurnos, cargando: false });
        }, error => {
          this.setState({ error: 'Error en snapshot: ' + error.message, cargando: false });
        });
      });

      // Guardar listeners para desuscribir
      this.unsubscribeResumenes = () => listeners.forEach(unsub => unsub());
    }
  };

  actualizarTotalesTurno = (turno, ventas) => {
    let totalEfectivo = 0, totalPosnet = 0, totalMercadoPago = 0;
    ventas.forEach(v => {
      totalEfectivo += Number(v.efectivo) || 0;
      totalPosnet += Number(v.posnet) || 0;
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
      return { resumenTurnos, hayCambios: true };
    });
  };

  manejarCambioVenta = (turno, index, campo, valor) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      const ventas = [...resumenTurnos[turno].ventas];
      ventas[index] = { ...ventas[index], [campo]: campo === 'pedido' ? valor : Number(valor) || 0 };
      resumenTurnos[turno].ventas = ventas;
      return { resumenTurnos, hayCambios: true };
    }, () => this.actualizarTotalesTurno(turno, this.state.resumenTurnos[turno].ventas));

  };

  agregarVenta = (turno) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      resumenTurnos[turno].ventas.push({ pedido: '', efectivo: 0, posnet: 0, mercadoPago: 0 });
      return { resumenTurnos, hayCambios: true };
    });

  };

  eliminarVenta = (turno, index) => {
    this.setState(prev => {
      const resumenTurnos = { ...prev.resumenTurnos };
      resumenTurnos[turno].ventas.splice(index, 1);
      return { resumenTurnos, hayCambios: true };
    }, () => this.actualizarTotalesTurno(turno, this.state.resumenTurnos[turno].ventas));

  };

  guardarResumen = () => {
    const { email, fecha, turnoSeleccionado, resumenTurnos } = this.state;
    const datos = resumenTurnos[turnoSeleccionado];

    if (!turnoSeleccionado) {
      alert('Selecciona un turno antes de guardar.');
      return;
    }

    db.collection('resumenes')
      .doc(`${email}_${fecha}_${turnoSeleccionado}`)
      .set({
        aperturaCaja: datos.aperturaCaja,
        empleado: datos.empleado,
        ventas: datos.ventas,
        turno: turnoSeleccionado,
        fecha: fecha
      })

      .then(() => {
        alert('Resumen guardado con éxito.');
        this.setState({ hayCambios: false });
      })

      .catch(error => alert('Error al guardar: ' + error.message));
  };

  reiniciarCaja = () => {
    const { email, fecha, rol } = this.state;
    const turnos = ['mañana', 'tarde'];

    if (rol.toLowerCase() === 'toto') {
      db.collection('resumenes')
        .where('fecha', '==', fecha)
        .get()
        .then(snapshot => {
          const batch = db.batch();
          snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          return batch.commit();
        })
        .then(() => {
          this.avanzarFechaYLimpiar();
        })
        .catch(error => {
          console.error('Error eliminando resumenes de Toto:', error);
        });
    } else {
      Promise.all(
        turnos.map(turno =>
          db.collection('resumenes')
            .doc(`${email}_${fecha}_${turno}`)
            .delete()
            .catch(error => {
              console.error('Error eliminando resumen:', error);
            })
        )
      ).then(() => {
        this.avanzarFechaYLimpiar();
      });
    }
  };

  avanzarFechaYLimpiar = () => {
    const fechaActual = new Date(this.state.fecha);
    fechaActual.setDate(fechaActual.getDate() + 1);
    const fechaSiguiente = fechaActual.toISOString().split('T')[0];

    this.setState({
      fecha: fechaSiguiente,
      resumenTurnos: {
        mañana: this.estadoInicialTurno(),
        tarde: this.estadoInicialTurno()
      },
      turnoSeleccionado: '',
    });
    alert('Caja reiniciada y datos del día anterior eliminados.');
  };


  renderResumenTurno = (turno) => {
    return <ResumenTurno datos={this.state.resumenTurnos[turno]} turno={turno} />;
  }

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
            {this.renderResumenTurno('mañana')}
            {this.renderResumenTurno('tarde')}

            <button
              className="home-reiniciar-boton"
              onClick={() => {
                if (window.confirm(`Caja cerrada y gastos del día ${fecha} registrados. ¿Reiniciar caja para el día siguiente?`)) {
                  this.reiniciarCaja();
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
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
          </select>
        </label>

        {turnoSeleccionado && (
          <TablaVentas
            datos={resumenTurnos[turnoSeleccionado] || this.estadoInicialTurno()}
            turno={turnoSeleccionado}
            manejarCambioArriba={this.manejarCambioArriba}
            manejarCambioVenta={this.manejarCambioVenta}
            agregarVenta={this.agregarVenta}
            eliminarVenta={this.eliminarVenta}
            guardarResumen={this.guardarResumen}
          />
        )}

        {rol.toLowerCase() === 'toto' && (
          <ResumenDiario datosManana={resumenTurnos.mañana} datosTarde={resumenTurnos.tarde} />
        )}
        <Link className="home-logout-link" to="/logout">Cerrar sesión</Link>
      </div>
    );
  }

}

export default Home;
