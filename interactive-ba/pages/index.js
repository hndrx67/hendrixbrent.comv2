import useSWR from 'swr';
const fetcher = (u) => fetch(u).then(r=>r.json());
export default function Home(){
  const { data } = useSWR('/api/tierlist', fetcher);
  return (
    <main style={{padding:'24px',fontFamily:'system-ui'}}>
      <h1>Blue Archive Tier List (Interactive)</h1>
      <p><a href="/login">Login</a> · <a href="/register">Register</a> · <a href="/dashboard">Dashboard</a></p>
      <section>
        {!data && <p>Loading...</p>}
        {data && data.length===0 && <p>No entries yet.</p>}
        {data && data.map(item => (
          <div key={item._id} style={{border:'1px solid #ddd',padding:12,margin:8}}>
            <strong>{item.rank}</strong> — {item.name}
            <div style={{fontSize:12,color:'#444'}}>{item.notes}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
