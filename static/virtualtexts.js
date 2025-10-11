/* Virtual/Visual Texts lesson JS */
(function(){
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));
  const TAB_KEY = 'vvtexts-scores-v1';

  // Tabs
  function activateTab(id){
    $$('.tab').forEach(t=>{
      const active = t.dataset.tab===id;
      t.classList.toggle('active',active);
      t.setAttribute('aria-selected',active?'true':'false');
    });
    $$('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===id));
  }
  $$('.tab').forEach(btn=>btn.addEventListener('click',()=>activateTab(btn.dataset.tab)));
  const gotoHandlers = $$('[data-goto]');
  gotoHandlers.forEach(b=>{
    const handler = ()=>activateTab(b.dataset.goto);
    b.addEventListener('click', handler);
    b.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); }});
  });

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Activities scoring helpers
  const scores = loadScores();
  function loadScores(){
    try{
      const raw = localStorage.getItem(TAB_KEY);
      return raw? JSON.parse(raw): {activities:{}, quiz:null, attempts:0, history:[]};
    }catch(e){
      return {activities:{}, quiz:null, attempts:0, history:[]};
    }
  }
  function saveScores(){
    localStorage.setItem(TAB_KEY, JSON.stringify(scores));
    renderScores();
  }

  // Activity 1
  const act1 = $('#activity1');
  if(act1){
    act1.addEventListener('submit', (e)=>{
      e.preventDefault();
      const values = $$('#activity1 input[type="checkbox"]:checked').map(c=>c.value);
      const correct = ['website','ebook','blog','social'];
      const incorrect = values.filter(v=>!correct.includes(v));
      const missed = correct.filter(v=>!values.includes(v));
      const ok = incorrect.length===0 && missed.length===0;
      $('#activity1-result').textContent = ok? 'Great! Those are all digital texts.' :
        `Keep trying. Missed: ${missed.length}; Incorrect: ${incorrect.length}`;
      scores.activities.activity1 = ok? 1: 0;
      saveScores();
    });
  }

  // Activity 2
  const act2 = $('#activity2');
  if(act2){
    act2.addEventListener('submit',(e)=>{
      e.preventDefault();
      const q1 = $('input[name="q1"]:checked', act2)?.value;
      const q2 = $('input[name="q2"]:checked', act2)?.value;
      const ok1 = q1==='nectar';
      const ok2 = q2==='describe';
      const score = (ok1?0.5:0) + (ok2?0.5:0);
      $('#activity2-result').textContent = score===1? 'Perfect!' : score===0.5? 'Almost there!' : 'Try again.';
      scores.activities.activity2 = score; // 0 to 1
      saveScores();
    });
  }

  // Quiz
  const quizForm = $('#quiz-form');
  const quizSubmit = $('#quiz-submit');
  const quizReset = $('#quiz-reset');

  const quizQuestions = [
    {
      id:'q1',
      type:'single',
      text:'Which is a feature of a virtual text that opens a new page?',
      options:[
        {v:'caption', t:'Caption'},
        {v:'heading', t:'Heading'},
        {v:'link', t:'Link'},
      ],
      answer:'link'
    },
    {
      id:'q2',
      type:'single',
      text:'What do captions usually do?',
      options:[
        {v:'describe', t:'Describe images or videos'},
        {v:'search', t:'Search the web'},
        {v:'advertise', t:'Show an advertisement'},
      ],
      answer:'describe'
    },
    {
      id:'q3',
      type:'multi',
      text:'Select all that are virtual texts:',
      options:[
        {v:'ebook', t:'E‑book'},
        {v:'website', t:'Website'},
        {v:'paperbook', t:'Paper book'},
        {v:'blog', t:'Blog post'},
      ],
      answer:['ebook','website','blog']
    },
    {
      id:'q4',
      type:'single',
      text:'A button with a triangle ▶ icon most likely will…',
      options:[
        {v:'pause', t:'Pause the page'},
        {v:'play', t:'Play a video'},
        {v:'print', t:'Print the page'},
      ],
      answer:'play'
    }
  ];

  function renderQuiz(){
    if(!quizForm) return;
    quizForm.innerHTML = quizQuestions.map((q,idx)=>{
      const name = q.id;
      if(q.type==='single'){
        return `
          <fieldset class="card" aria-labelledby="${name}-label">
            <legend id="${name}-label">${idx+1}. ${q.text}</legend>
            ${q.options.map(o=>`
              <label><input type="radio" name="${name}" value="${o.v}"> ${o.t}</label>
            `).join('')}
          </fieldset>`;
      }else{ // multi
        return `
          <fieldset class="card" aria-labelledby="${name}-label">
            <legend id="${name}-label">${idx+1}. ${q.text}</legend>
            ${q.options.map(o=>`
              <label><input type="checkbox" name="${name}" value="${o.v}"> ${o.t}</label>
            `).join('')}
          </fieldset>`;
      }
    }).join('');
  }

  function scoreQuiz(){
    let score = 0;
    quizQuestions.forEach(q=>{
      if(q.type==='single'){
        const v = $(`input[name="${q.id}"]:checked`)?.value;
        if(v===q.answer) score += 1;
      }else{
        const values = $$(`input[name="${q.id}"]:checked`).map(c=>c.value);
        const setA = new Set(values);
        const setB = new Set(q.answer);
        const same = values.length===q.answer.length && [...setA].every(v=>setB.has(v));
        if(same) score += 1;
      }
    });
    return score;
  }

  function renderScores(){
    const wrap = $('#scores-table-wrap');
    if(!wrap) return;
    const a1 = scores.activities.activity1 ?? 0;
    const a2 = scores.activities.activity2 ?? 0;
    const q = scores.quiz ?? null;
    const total = a1 + a2 + (q?.score ?? 0);
    const max = 1 + 1 + quizQuestions.length; // activities (1+1) + quiz

    const historyRows = (scores.history||[]).map(h=>`
      <tr><td>${new Date(h.date).toLocaleString()}</td><td>${h.quizScore}/${quizQuestions.length}</td></tr>
    `).join('') || '<tr><td colspan="2">No quiz attempts yet.</td></tr>';

    wrap.innerHTML = `
      <div class="card">
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr><th>Activity 1</th><td>${(a1*100).toFixed(0)}%</td></tr>
            <tr><th>Activity 2</th><td>${(a2*100).toFixed(0)}%</td></tr>
            <tr><th>Quiz</th><td>${q? `${q.score}/${quizQuestions.length} (${Math.round(q.score/quizQuestions.length*100)}%)` : '—'}</td></tr>
            <tr><th>Total (Activities + Quiz)</th><td>${total}/${max}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>Quiz History</h3>
        <table>
          <thead><tr><th>Date</th><th>Score</th></tr></thead>
          <tbody>${historyRows}</tbody>
        </table>
      </div>
    `;
  }

  if(quizForm){
    renderQuiz();
    quizSubmit?.addEventListener('click',(e)=>{
      e.preventDefault();
      const score = scoreQuiz();
      const msg = `You scored ${score}/${quizQuestions.length}`;
      $('#quiz-result').textContent = msg;
      scores.quiz = {score, date: Date.now()};
      scores.attempts = (scores.attempts||0)+1;
      (scores.history = scores.history||[]).unshift({date: Date.now(), quizScore: score});
      saveScores();
      activateTab('scores');
    });

    quizReset?.addEventListener('click',()=>{
      $$('input[type="radio"], input[type="checkbox"]', quizForm).forEach(i=>{i.checked=false});
      $('#quiz-result').textContent = '';
    });
  }

  // Scores actions
  $('#print-scores')?.addEventListener('click',()=>{
    activateTab('scores');
    window.print();
  });
  $('#reset-scores')?.addEventListener('click',()=>{
    if(confirm('Clear all saved scores?')){
      localStorage.removeItem(TAB_KEY);
      const cleared = {activities:{}, quiz:null, attempts:0, history:[]};
      Object.assign(scores, cleared);
      renderScores();
    }
  });

  // Initial render
  renderScores();
})();
