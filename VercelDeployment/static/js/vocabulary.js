/* Interactive logic for Vocabulary site */
(function(){
  const $ = (sel, el=document)=>el.querySelector(sel);
  const $$ = (sel, el=document)=>Array.from(el.querySelectorAll(sel));

  // Bubbles background generator
  function makeBubbles(){
    const wrap = $('.bubbles');
    if(!wrap) return;
    for(let i=0;i<18;i++){
      const s=document.createElement('span');
      const size = Math.random()*80+20; // 20-100
      s.style.width=size+'px'; s.style.height=size+'px';
      s.style.left = Math.random()*100+'%';
      s.style.bottom = (-10 - Math.random()*40)+'px';
      const colors=['#a0e9ff','#ffd6e8','#ffe29a','#c8ffdf','#e5d1ff'];
      s.style.background = colors[Math.floor(Math.random()*colors.length)];
      s.style.animationDuration = (10+Math.random()*14)+'s';
      s.style.animationDelay = (Math.random()*4)+'s';
      wrap.appendChild(s);
    }
  }

  function confettiBurst(x=window.innerWidth/2, y=120){
    const c = document.createElement('div');
    c.style.position='fixed'; c.style.left=x+'px'; c.style.top=y+'px';
    c.style.pointerEvents='none'; c.style.zIndex=9999;
    document.body.appendChild(c);
    const colors=['#ff7675','#55efc4','#74b9ff','#ffeaa7','#a29bfe'];
    for(let i=0;i<30;i++){
      const p=document.createElement('i');
      p.style.position='absolute'; p.style.width='8px'; p.style.height='8px';
      p.style.background=colors[i%colors.length]; p.style.transform=`translate(-50%,-50%) rotate(${Math.random()*360}deg)`;
      const dx = (Math.random()-0.5)*200; const dy = (Math.random()-0.5)*160;
      p.animate([
        { transform:`translate(0,0)`, opacity:1 },
        { transform:`translate(${dx}px, ${dy}px)`, opacity:0 }
      ], { duration: 900+Math.random()*500, easing:'ease-out' });
      c.appendChild(p);
    }
    setTimeout(()=>c.remove(), 1500);
  }

  // Level toggle
  function setupLevelToggle(){
    const buttons = $$('.level-toggle button');
    const sections = $$('.level-section');
    const on = (level)=>{
      buttons.forEach(b=>b.classList.toggle('active', b.dataset.level===level));
      sections.forEach(s=>{
        s.style.display = (s.dataset.level===level)?'block':'none';
      });
      localStorage.setItem('vocab-level', level);
    };
    buttons.forEach(b=>b.addEventListener('click',()=>on(b.dataset.level)));
    on(localStorage.getItem('vocab-level')||'elementary');
  }

  // Flashcards
  function setupFlashcards(){
    $$('.flashcards .card').forEach(card=>{
      const inner = card.querySelector('.card-inner');
      // ensure pointer cursor and disable text selection side-effects
      card.style.cursor = 'pointer';
      card.setAttribute('tabindex','0');
      card.addEventListener('click', ()=>{
        inner.style.transform = inner.style.transform? '' : 'rotateY(180deg)';
      });
      card.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          inner.style.transform = inner.style.transform? '' : 'rotateY(180deg)';
        }
      });
    });
  }

  // Quiz
  function setupQuizzes(){
    $$('.quiz').forEach(q=>{
      const answer = q.dataset.answer?.toLowerCase().trim();
      $$('.choice', q).forEach(choice=>{
        choice.addEventListener('click',()=>{
          const correct = choice.dataset.choice?.toLowerCase().trim() === answer;
          $$('.choice', q).forEach(c=>c.classList.remove('correct','wrong'));
          choice.classList.add(correct? 'correct':'wrong');
          if(correct) confettiBurst();
        });
      });
    });
  }

  // Match Game (drag-drop)
  function setupMatch(){
    $$('.match').forEach(board=>{
      const items = $$('.item', board);
      const targets = $$('.target', board);
      items.forEach(item=>{
        item.draggable = true;
        item.addEventListener('dragstart', e=>{
          e.dataTransfer.setData('text/plain', item.dataset.word);
          e.dataTransfer.effectAllowed='move';
        });
      });
      targets.forEach(t=>{
        t.addEventListener('dragover', e=>e.preventDefault());
        t.addEventListener('drop', e=>{
          e.preventDefault();
          const w = e.dataTransfer.getData('text/plain');
          if(w && w===t.dataset.accept){
            t.textContent = w; t.classList.add('filled');
            confettiBurst();
          } else {
            t.animate([{transform:'scale(1)'},{transform:'scale(1.05)'},{transform:'scale(1)'}], {duration:250});
          }
        });
      });
    });
  }

  // Scramble
  function setupScramble(){
    $$('.scramble').forEach(s=>{
      const word = s.dataset.word || '';
      const letters = word.split('').sort(()=>Math.random()-.5);
      const container = $('.letters', s);
      let answer = '';
      letters.forEach(ch=>{
        const l = document.createElement('button');
        l.className='letter'; l.type='button'; l.textContent=ch.toUpperCase();
        l.addEventListener('click',()=>{
          answer += ch;
          $('.answer', s).textContent = answer.toUpperCase();
          l.disabled = true; l.style.opacity=.5;
          if(answer.length===word.length){
            if(answer===word){ confettiBurst(); $('.result', s).textContent='Great job!'; }
            else { $('.result', s).textContent='Try again!'; }
          }
        });
        container.appendChild(l);
      });
      $('.reset', s)?.addEventListener('click',()=>window.location.reload());
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    makeBubbles();
    setupLevelToggle();
    setupFlashcards();
    setupQuizzes();
    setupMatch();
    setupScramble();
  });
})();
