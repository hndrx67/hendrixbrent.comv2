import { useState } from 'react';
export default function TierEditor({ initial, onSave }){
  const [form, setForm] = useState(initial || { rank:'', name:'', notes:'', corrections:0, trend:'' });
  return (
    <form onSubmit={e=>{e.preventDefault(); onSave(form);}} style={{border:'1px solid #ccc',padding:12}}>
      <div><label>Rank<br/><input value={form.rank} onChange={e=>setForm({...form,rank:e.target.value})} /></label></div>
      <div><label>Name<br/><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></label></div>
      <div><label>Notes<br/><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></label></div>
      <div><label>Corrections<br/><input type="number" value={form.corrections} onChange={e=>setForm({...form,corrections: Number(e.target.value)})} /></label></div>
      <div><label>Trend<br/><input value={form.trend} onChange={e=>setForm({...form,trend:e.target.value})} /></label></div>
      <div style={{marginTop:8}}><button type="submit">Save</button></div>
    </form>
  );
}
