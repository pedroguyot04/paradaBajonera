import React from 'react';
import './ResumenTurno.css';

const ResumenTurno = ({ datos, turno }) => {
  if (!datos) return null;
  if (datos.ventas.length === 0) return <p className="resumen-no-ventas">No hay ventas registradas para {turno}.</p>;

  return (
    <div className="resumen-container">
      <h3 className="resumen-titulo">Turno {turno}</h3>
      <p className="resumen-info"><strong>Empleado a cargo:</strong> {datos.empleado || '(no registrado)'}</p>
      <p className="resumen-info"><strong>Apertura Caja:</strong> ${ (datos.aperturaCaja || 0).toFixed(2) }</p>

      <table className="resumen-table" border="1" cellPadding="5">
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

      <p className="resumen-total">Total efectivo: ${ (datos.totalEfectivo || 0).toFixed(2) }</p>
      <p className="resumen-total">Total postnet: ${ (datos.totalPostnet || 0).toFixed(2) }</p>
      <p className="resumen-total">Total MP: ${ (datos.totalMercadoPago || 0).toFixed(2) }</p>
      <p className="resumen-total resumen-total-general"><strong>Total general: ${ (datos.totalGeneral || 0).toFixed(2) }</strong></p>
    </div>
  );
};

export default ResumenTurno;

