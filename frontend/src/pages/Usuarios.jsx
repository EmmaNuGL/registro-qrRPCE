import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Usuarios(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ username:'', role:'Usuario', email:'' });

  async function load(){
    const res = await api.get('/users');
    setList(res.data || []);
  }
  useEffect(()=>{ load(); }, []);

  async function add(){
    if(!form.username) return alert('Usuario requerido');
    await api.post('/users', form);
    setForm({ username:'', role:'Usuario', email:'' });
    load();
  }
  async function remove(id){
    if(!confirm('Eliminar usuario?')) return;
    await api.delete(`/users/${id}`);
    load();
  }

  return (
    <>
      <h2>Usuarios</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Usuario" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option>Administrador</option>
          <option>Usuario</option>
        </select>
        <button onClick={add}>Agregar</button>
      </div>

      <table style={{width:'100%', background:'#fff', borderRadius:10, overflow:'hidden'}}>
        <thead>
          <tr><th>Usuario</th><th>Email</th><th>Rol</th><th></th></tr>
        </thead>
        <tbody>
          {list.map(u=>(
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email || '—'}</td>
              <td>{u.role}</td>
              <td><button onClick={()=>remove(u._id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
