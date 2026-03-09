import { useState } from 'react';
import { useRouter } from 'next/router';
export default function Register(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const r = useRouter();
  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    if (!res.ok) { setErr((await res.json()).error || 'Register failed'); return; }
    r.push('/login');
  }
  return (
    <main style={{padding:24}}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div><button type="submit">Register</button></div>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
    </main>
  );
}
