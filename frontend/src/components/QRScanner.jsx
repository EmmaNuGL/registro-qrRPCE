import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({ onDetected }){
  useEffect(()=> {
    const qrRegionId = "reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    const config = { fps: 10, qrbox: 250 };

    Html5Qrcode.getCameras().then(cameras => {
      const cameraId = (cameras && cameras[0]) ? cameras[0].id : null;
      if (cameraId) {
        html5QrCode.start(cameraId, config, decodedText => {
          onDetected(decodedText);
        }, errorMessage => {
          // console.warn(errorMessage);
        }).catch(err => console.error('start error', err));
      }
    }).catch(err => console.error('getCameras error', err));

    return ()=> {
      html5QrCode.stop().then(()=> html5QrCode.clear()).catch(()=>{});
    };
  }, [onDetected]);

  return <div id="reader" style={{ width: '100%' }} />;
}
