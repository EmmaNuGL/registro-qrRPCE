import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [detectedCode, setDetectedCode] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [message, setMessage] = useState("");
  const qrRegionId = "qr-reader";
  const qrScanner = useRef(null);

  // 🔎 Buscar información del libro escaneado
  const fetchBookData = async (code) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/books/${code}`);
      setBookInfo(data);
    } catch (error) {
      console.warn("Libro no encontrado:", error);
      setBookInfo(null);
    }
  };

  // 🟢 Iniciar escáner
  const startScanner = async () => {
    if (scanning) return;
    setScanning(true);
    setMessage("");

    try {
      qrScanner.current = new Html5Qrcode(qrRegionId);
      await qrScanner.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (batchMode) {
            if (!batchList.includes(decodedText)) {
              setBatchList((prev) => [...prev, decodedText]);
              setMessage("Código agregado al lote.");
            }
          } else {
            setDetectedCode(decodedText);
            setMessage("Código detectado. Esperando confirmación...");
            fetchBookData(decodedText);
          }
        },
        () => {}
      );
    } catch (err) {
      console.error("Error al iniciar cámara:", err);
      setMessage("❌ No se pudo acceder a la cámara.");
      setScanning(false);
    }
  };

  // 🔴 Detener escáner
  const stopScanner = async () => {
    if (qrScanner.current) {
      await qrScanner.current.stop();
      qrScanner.current.clear();
    }
    setScanning(false);
  };

  // 🔁 Reiniciar cámara
  const refreshScanner = () => {
    stopScanner().then(() => setTimeout(startScanner, 500));
  };

  // ✅ Procesar libro individual
  const processDetected = async () => {
    if (!detectedCode) return;
    try {
      // 1️⃣ Consultar libro actual
      const { data: book } = await axios.get(
        `http://localhost:4000/api/books/${detectedCode}`
      );

      if (!book) {
        setMessage("⚠️ Libro no encontrado.");
        return;
      }

      // 2️⃣ Cambiar estado
      const newStatus = book.status === "En uso" ? "En archivos" : "En uso";
      await axios.put(`http://localhost:4000/api/books/${book._id}`, {
        ...book,
        status: newStatus,
      });

      // 3️⃣ Registrar en historial
      await axios.post("http://localhost:4000/api/history", {
        code: detectedCode,
        action: newStatus === "En uso" ? "Préstamo" : "Devolución",
        date: new Date().toLocaleString(),
      });

      setMessage(`✅ Estado cambiado a "${newStatus}". Movimiento registrado.`);
      setDetectedCode(null);
      setBookInfo(null);
    } catch (error) {
      console.error("Error al procesar:", error);
      setMessage("⚠️ Error al actualizar el libro.");
    }
  };

  // 🚫 Cancelar código actual
  const cancelDetected = () => {
    setDetectedCode(null);
    setBookInfo(null);
    setMessage("⏹️ Escaneo cancelado.");
  };

  // ✅ Confirmar lote
  const confirmBatch = async () => {
    if (batchList.length === 0) return setMessage("⚠️ No hay elementos en el lote.");

    try {
      for (const code of batchList) {
        const { data: book } = await axios.get(
          `http://localhost:4000/api/books/${code}`
        );
        if (!book) continue;

        const newStatus = book.status === "En uso" ? "En archivos" : "En uso";
        await axios.put(`http://localhost:4000/api/books/${book._id}`, {
          ...book,
          status: newStatus,
        });

        await axios.post("http://localhost:4000/api/history", {
          code,
          action: newStatus === "En uso" ? "Préstamo (Lote)" : "Devolución (Lote)",
          date: new Date().toLocaleString(),
        });
      }

      setMessage("✅ Lote procesado correctamente.");
      setBatchList([]);
    } catch (error) {
      console.error("Error al procesar lote:", error);
      setMessage("⚠️ Error al procesar el lote.");
    }
  };

  useEffect(() => {
    return () => {
      if (qrScanner.current) qrScanner.current.stop();
    };
  }, []);

  return (
    <div className="scanner-container">
      <h2>📷 Escáner QR — Control de Préstamos y Devoluciones</h2>

      <div className="action-buttons">
        <button onClick={startScanner} disabled={scanning} className="btn btn-primary">
          📱 Iniciar
        </button>
        <button onClick={stopScanner} disabled={!scanning} className="btn btn-secondary">
          ⏹️ Detener
        </button>
        <button onClick={refreshScanner} className="btn btn-info">
          🔄 Refrescar
        </button>
        <button onClick={() => setBatchMode(!batchMode)} className="btn btn-warning">
          📦 Modo Lote {batchMode ? "✅" : ""}
        </button>
      </div>

      <div id={qrRegionId} className="camera-view"></div>
      <p className="status-message">{message}</p>

      {/* Información del libro detectado */}
      {bookInfo && (
        <div className="detected-box">
          <h4>📘 Información del Libro</h4>
          <p><strong>Tomo:</strong> {bookInfo.tome}</p>
          <p><strong>Año:</strong> {bookInfo.year}</p>
          <p><strong>Estado actual:</strong> {bookInfo.status}</p>
          <div className="detected-actions">
            <button onClick={processDetected} className="btn btn-success">
              ✅ Procesar
            </button>
            <button onClick={cancelDetected} className="btn btn-danger">
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modo lote */}
      {batchMode && (
        <div className="batch-results">
          <h4>📦 Códigos Escaneados ({batchList.length})</h4>
          {batchList.length === 0 ? (
            <p>No hay elementos en el lote.</p>
          ) : (
            <ul>
              {batchList.map((code, i) => (
                <li key={i}>{code}</li>
              ))}
            </ul>
          )}
          <button onClick={confirmBatch} className="btn btn-success">
            ✅ Confirmar Lote
          </button>
        </div>
      )}
    </div>
  );
}
