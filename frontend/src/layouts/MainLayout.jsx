import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout(){
  return (
    <div className="app-shell" style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100vh'}}>
      <Sidebar />
      <div>
        <Header />
        <main className="main-content" style={{padding:'1.5rem'}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
