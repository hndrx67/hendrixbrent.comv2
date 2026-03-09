import { useEffect, useState } from 'react';
import TierEditor from '../components/TierEditor';
import useSWR from 'swr';
const fetcher = (u, opts) => fetch(u, opts).then(r => r.json());

export default function Dashboard(){
  const { data, mutate } = useSWR('/api/tierlist', fetcher);
  const [message, setMessage] = useState(null);

  async function create(payload){
    const res = await fetch('/api/tierlist', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (!res.ok) {
      const err = await res.json().catch(()=>({}));
      setMessage(err.error || 'Failed');
      return;
    }
    setMessage('Created');
    mutate();
  }

  return (
    <main style={{padding:24}}>
      <h1>Dashboard (admin)</h1>
      <p><a href="/">Home</a></p>
      <section>
        <h2>Create Entry</h2>
        <TierEditor onSave={create} />
        {message && <div style={{marginTop:8}}>{message}</div>}
      </section>
      <section style={{marginTop:20}}>
        <h2>Entries</h2>
        {!data && <div>Loading...</div>}
        {data && data.map(e=> (
          <div key={e._id} style={{border:'1px solid #ddd',padding:8,margin:8}}>
            <div><strong>{e.rank}</strong> — {e.name}</div>
            <div style={{fontSize:12}}>{e.notes}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
