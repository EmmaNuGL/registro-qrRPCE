import { useState } from 'react';
import QRScanner from '../components/QRScanner';

export default function Scanner(){
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Escáner QR</h2>
        <button onClick={()=>setOpen(true)}>Iniciar Cámara</button>
      </div>

      {open && (
        <QRScanner
          onResult={(qr) => {
            // TODO: aquí pegamos tu función original que busca el libro por QR y acciona flujo (entrada/salida).
            alert(`QR leído: ${qr}`);
            setOpen(false);
          }}
          onClose={()=>setOpen(false)}
        />
      )}
    </>
  );
}
