import React from 'react';
import './ResumenDiario.css'; // usa mismo estilo

const ResumenDiario = ({ datosManana, datosTarde }) => {
  const sumar = (campo) => {
    const m = Number(datosManana?.[campo]) || 0;
    const t = Number(datosTarde?.[campo]) || 0;
    return (m + t).toFixed(2);
  };

  // Siempre mostrar resumen, incluso si no hay ventas
  return (
    <div className="resumen-container">
      <h3 className="resumen-titulo">Resumen Total del Día</h3>
      <p className="resumen-total">Total efectivo: ${sumar('totalEfectivo')}</p>
      <p className="resumen-total">Total posnet: ${sumar('totalPosnet')}</p>
      <p className="resumen-total">Total MP: ${sumar('totalMercadoPago')}</p>
      <p className="resumen-total resumen-total-general"><strong>Total general: ${sumar('totalGeneral')}</strong></p>
    </div>
  );
};

export default ResumenDiario;

