import React from 'react';
import './TablaVentas.css';

const TablaVentas = ({ datos, turno, manejarCambioArriba, manejarCambioVenta, agregarVenta, eliminarVenta, guardarResumen }) => {
  return (
    <div className="tabla-container">
      <h3 className="tabla-titulo">Editar ventas turno {turno}</h3>

      <label className="tabla-label">
        Apertura caja: $
        <input
          type="number"
          value={datos.aperturaCaja}
          onChange={e => manejarCambioArriba(turno, 'aperturaCaja', e.target.value)}
          className="tabla-input"
        />
      </label>

      <label className="tabla-label tabla-label-empleado">
        Empleado a cargo:
        <input
          type="text"
          value={datos.empleado}
          onChange={e => manejarCambioArriba(turno, 'empleado', e.target.value)}
          className="tabla-input"
        />
      </label>

      <table className="tabla-table" border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Pedido</th><th>Efectivo</th><th>Postnet</th><th>MP</th><th>X</th>
          </tr>
        </thead>
        <tbody>
          {datos.ventas.map((v, i) => (
            <tr key={i}>
              <td>
                <input
                  type="text"
                  value={v.pedido}
                  onChange={e => manejarCambioVenta(turno, i, 'pedido', e.target.value)}
                  className="tabla-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={v.efectivo}
                  onChange={e => manejarCambioVenta(turno, i, 'efectivo', e.target.value)}
                  className="tabla-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={v.postnet}
                  onChange={e => manejarCambioVenta(turno, i, 'postnet', e.target.value)}
                  className="tabla-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={v.mercadoPago}
                  onChange={e => manejarCambioVenta(turno, i, 'mercadoPago', e.target.value)}
                  className="tabla-input"
                />
              </td>
              <td>
                <button className="tabla-btn-eliminar" onClick={() => eliminarVenta(turno, i)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="tabla-btn-agregar" onClick={() => agregarVenta(turno)}>+ Agregar venta</button>
      <br /><br />
      <button className="tabla-btn-guardar" onClick={guardarResumen}>Guardar ventas</button>
      <p className="tabla-info">
        Al final del turno asegurate de apretar el boton 'Guardar Ventas' asi se cargan al sistema.
      </p>
    </div>
  );
};

export default TablaVentas;
