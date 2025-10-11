/* Understanding Virtual/Visual Texts - Logic */
(function(){
  const $ = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>Array.from(el.querySelectorAll(s));

  const state = JSON.parse(localStorage.getItem('uvt-state')||'{}');
  state.scores = state.scores || { activities: 0, tests: 0 };
  state.max = { activities: 0, tests: 0 };

  function save(){ localStorage.setItem('uvt-state', JSON.stringify(state)); }

  function switchTab(id){
    $$('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===id));
    $$('.tab-panel').forEach(p=>p.style.display = (p.id===id)?'block':'none');
    save();
  }

  function initTabs(){
    const initial = state.activeTab || 'overview';
    $$('.tab').forEach(t=> t.addEventListener('click',()=>{ state.activeTab=t.dataset.tab; switchTab(state.activeTab);}));
    switchTab(initial);
  }

  // Activities: Identify types of virtual texts
  function initActivities(){
    // Multiple choice
    $$('.activity .choice').forEach(ch=>{
      ch.addEventListener('click',()=>{
        const correct = ch.dataset.correct==='true';
        const group = ch.closest('.activity');
        if(group.dataset.done==='true') return;
        $$('.choice', group).forEach(c=>c.classList.remove('correct','wrong'));
        ch.classList.add(correct? 'correct':'wrong');
        group.dataset.done='true';
        state.max.activities += 1;
        if(correct) state.scores.activities += 1;
        updateScores(); save();
      });
    });

    // Match (drag and drop)
    $$('.match').forEach(board=>{
      const items = $$('.item', board);
      const targets = $$('.target', board);
      items.forEach(i=>{
        i.draggable=true;
        i.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text/plain', i.dataset.word) });
      });
      targets.forEach(t=>{
        t.addEventListener('dragover', e=>e.preventDefault());
        t.addEventListener('drop', e=>{
          e.preventDefault();
          const w = e.dataTransfer.getData('text/plain');
          if(!t.classList.contains('filled')){
            t.textContent = w; t.classList.add('filled');
            state.max.activities += 1;
            if(w===t.dataset.accept) state.scores.activities += 1;
            updateScores(); save();
          }
        });
      });
    });
  }

  // Tests (MCQs)
  function initTests(){
    $$('.test .choice').forEach(ch=>{
      ch.addEventListener('click',()=>{
        const correct = ch.dataset.correct==='true';
        const q = ch.closest('.test');
        if(q.dataset.done==='true') return;
        $$('.choice', q).forEach(c=>c.classList.remove('correct','wrong'));
        ch.classList.add(correct? 'correct':'wrong');
        q.dataset.done='true';
        state.max.tests += 1;
        if(correct) state.scores.tests += 1;
        updateScores(); save();
      });
    });
  }

  function updateScores(){
    const a = state.scores.activities, am = Math.max(1, state.max.activities);
    const t = state.scores.tests, tm = Math.max(1, state.max.tests);
    const at = ((a/am)*100)|0; const tt = ((t/tm)*100)|0;
    const total = ((a+t)/(am+tm))*100 | 0;
    const s = $('#scores');
    if(s){
      $('.score-activities', s).textContent = `${a} / ${am} (${at}%)`;
      $('.score-tests', s).textContent = `${t} / ${tm} (${tt}%)`;
      $('.score-total', s).textContent = `${total}%`;
    }
  }

  function initPrint(){
    $('#printScores')?.addEventListener('click',()=>{
      window.print();
    });
    $('#resetScores')?.addEventListener('click',()=>{
      state.scores = {activities:0, tests:0}; state.max = {activities:0, tests:0}; save(); updateScores();
      alert('Scores reset. You can re-take activities and tests.');
      location.reload();
    });
  }

  function initVideos(){
    // Use search-based embeds so videos stay available
    $$('.video iframe').forEach(f=>{
      // noop - already set in HTML
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initTabs();
    initActivities();
    initTests();
    updateScores();
    initPrint();
    initVideos();
  });
})();
