import React from 'react';

const ResumenTurno = ({ datos, turno }) => {
  if (!datos) return null;
  if (datos.ventas.length === 0) return <p>No hay ventas registradas para {turno}.</p>;

  return (
    <div style={{ border: '1px solid #aaa', padding: 10, marginBottom: 20 }}>
      <h3>Turno {turno}</h3>
      <p><strong>Empleado:</strong> {datos.empleado || '(no registrado)'}</p>
      <p><strong>Apertura Caja:</strong> ${ (datos.aperturaCaja || 0).toFixed(2) }</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Pedido</th><th>Efectivo</th><th>Postnet</th><th>MP</th>
          </tr>
        </thead>
        <tbody>
          {datos.ventas.map((v, i) => (
            <tr key={i}>
              <td>{v.pedido}</td>
              <td>${(v.efectivo || 0).toFixed(2)}</td>
              <td>${(v.postnet || 0).toFixed(2)}</td>
              <td>${(v.mercadoPago || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Total efectivo: ${ (datos.totalEfectivo || 0).toFixed(2) }</p>
      <p>Total postnet: ${ (datos.totalPostnet || 0).toFixed(2) }</p>
      <p>Total MP: ${ (datos.totalMercadoPago || 0).toFixed(2) }</p>
      <p><strong>Total general: ${ (datos.totalGeneral || 0).toFixed(2) }</strong></p>
    </div>
  );
};

export default ResumenTurno;
