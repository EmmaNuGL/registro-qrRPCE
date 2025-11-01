import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function ViewQRModal({ book, onClose }) {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      const qrData = `REG-${book.year}-${book.tome}-${book.registryFrom}-${book.registryTo}`;
      const url = await QRCode.toDataURL(qrData);
      setQrUrl(url);
    };
    generateQR();
  }, [book]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `QR_${book.year}_${book.tome}_${book.registryFrom}-${book.registryTo}.png`;
    a.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal qr-modal">
        <h2>Vista previa del código QR</h2>
        {qrUrl && (
          <img
            src={qrUrl}
            alt="QR"
            style={{ width: '200px', height: '200px', margin: '1rem auto', display: 'block' }}
          />
        )}
        <div className="actions">
          <button onClick={handleDownload}>⬇️ Descargar</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
