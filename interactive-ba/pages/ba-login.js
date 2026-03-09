import { useState } from 'react';
import { useRouter } from 'next/router';

export default function BALogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setErr(body.error || 'Login failed');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main style={{fontFamily:'system-ui',padding:24,maxWidth:760,margin:'0 auto'}}>
      <header style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/ba/KISAKI-BANNER%20LD2.png" alt="BA" style={{height:64,objectFit:'contain'}} onError={(e)=>{e.target.style.display='none'}} />
        <h1 style={{margin:0}}>Blue Archive — Manage Tier List</h1>
      </header>

      <p style={{color:'#444'}}>Login to manage the interactive Blue Archive tier list. Only admins can create or edit entries.</p>

      <form onSubmit={submit} style={{display:'grid',gap:12,marginTop:8}}>
        <label>
          Email
          <input value={email} onChange={(e)=>setEmail(e.target.value)} style={{width:'100%'}} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:'100%'}} />
        </label>
        <div>
          <button type="submit" disabled={loading} style={{padding:'8px 12px'}}>Login</button>
          <a href="/register" style={{marginLeft:12}}>Register</a>
        </div>
        {err && <div style={{color:'crimson'}}>{err}</div>}
      </form>

      <section style={{marginTop:18,fontSize:13,color:'#666'}}>
        <strong>Local testing:</strong> If you're running the static site separately, open <code>http://localhost:3001/ba-login</code> (Next dev runs on port 3001 in this project).
      </section>
    </main>
  );
}
