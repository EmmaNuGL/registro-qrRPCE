import { NavLink } from 'react-router-dom';

const linkBase = { display:'block', padding:'10px 14px', borderRadius:8, textDecoration:'none', margin:'6px 0' };

export default function Sidebar(){
  return (
    <aside style={{background:'#f3f6fb', padding:'1rem', borderRight:'1px solid #e5e7eb'}}>
      <div style={{fontWeight:700, marginBottom:12}}>Menú</div>
      <NavLink to="/libros"     style={linkBase}>📚 Gestión de Libros</NavLink>
      <NavLink to="/scanner"    style={linkBase}>📷 Escáner QR</NavLink>
      <NavLink to="/historial"  style={linkBase}>🕘 Historial</NavLink>
      <NavLink to="/reportes"   style={linkBase}>📑 Reportes</NavLink>
      <NavLink to="/usuarios"   style={linkBase}>👥 Usuarios</NavLink>
      <NavLink to="/config"     style={linkBase}>⚙️ Configuración</NavLink>
    </aside>
  );
}
