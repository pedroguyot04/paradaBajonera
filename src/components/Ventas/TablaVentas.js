import React from 'react';

const TablaVentas = ({ datos, turno, manejarCambioArriba, manejarCambioVenta, agregarVenta, eliminarVenta, guardarResumen }) => {
  return (
    <div style={{ border: '1px solid #0077cc', padding: 15, marginBottom: 30 }}>
      <h3>Editar ventas turno {turno}</h3>

      <label>
        Apertura caja: $
        <input type="number" value={datos.aperturaCaja} onChange={e => manejarCambioArriba(turno, 'aperturaCaja', e.target.value)} />
      </label>{' '}

      <label style={{ marginLeft: 10 }}>
        Empleado:
        <input type="text" value={datos.empleado} onChange={e => manejarCambioArriba(turno, 'empleado', e.target.value)} />
      </label>

      <table border="1" cellPadding="5" style={{ width: '100%', marginTop: 10 }}>
        <thead>
          <tr>
            <th>Pedido</th><th>Efectivo</th><th>Postnet</th><th>MP</th><th>X</th>
          </tr>
        </thead>
        <tbody>
          {datos.ventas.map((v, i) => (
            <tr key={i}>
              <td><input type="text" value={v.pedido} onChange={e => manejarCambioVenta(turno, i, 'pedido', e.target.value)} /></td>
              <td><input type="number" value={v.efectivo} onChange={e => manejarCambioVenta(turno, i, 'efectivo', e.target.value)} /></td>
              <td><input type="number" value={v.postnet} onChange={e => manejarCambioVenta(turno, i, 'postnet', e.target.value)} /></td>
              <td><input type="number" value={v.mercadoPago} onChange={e => manejarCambioVenta(turno, i, 'mercadoPago', e.target.value)} /></td>
              <td><button onClick={() => eliminarVenta(turno, i)} style={{ color: 'red' }}>X</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => agregarVenta(turno)} style={{ marginTop: 10 }}>+ Agregar venta</button>
      <br /><br />
      <button onClick={guardarResumen}>Guardar resumen</button>
    </div>
  );
};

export default TablaVentas;
