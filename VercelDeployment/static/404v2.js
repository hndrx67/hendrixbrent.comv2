(() => {
  const canvas = document.getElementById('spiral-canvas');
  if (!canvas) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawSpiral();
  }

  let baseImage = null;
  function drawSpiral(){
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0,0,w,h);

    // center
    ctx.save();
    ctx.translate(w/2, h/2);

    const turns = 6.5;
    const maxR = Math.min(w,h) * 0.6;
    ctx.lineWidth = 2.2;
    for(let i=0;i<1200;i++){
      const t = i/1200;
      const angle = t * turns * Math.PI * 2;
      const r = t * maxR;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if(i===0) ctx.beginPath(), ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }

    // gradient stroke
    const grad = ctx.createLinearGradient(-maxR, -maxR, maxR, maxR);
    grad.addColorStop(0,'rgba(122,252,255,0.14)');
    grad.addColorStop(0.5,'rgba(122,252,255,0.06)');
    grad.addColorStop(1,'rgba(122,252,255,0.02)');
    ctx.strokeStyle = grad;
    ctx.stroke();

    // additional subtle rings
    for(let k=1;k<=6;k++){
      ctx.beginPath();
      ctx.arc(0,0,(maxR/k)*1.1,0,Math.PI*2);
      ctx.strokeStyle = `rgba(122,252,255,${0.02 * (7-k)})`;
      ctx.lineWidth = 1 + (k%2);
      ctx.stroke();
    }

    ctx.restore();

    // cache for rotation animation
    baseImage = ctx.getImageData(0,0,w,h);
  }

  let angle = 0;
  function animate(){
    if (!baseImage) return requestAnimationFrame(animate);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.rotate(angle);
    ctx.translate(-w/2, -h/2);
    ctx.putImageData(baseImage, 0, 0);
    ctx.restore();
    angle += 0.0009; // slow rotation
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, {passive:true});
  resize();
  requestAnimationFrame(animate);

  // small interactive pulse when hovering the card
  const card = document.querySelector('.card');
  if(card){
    card.addEventListener('pointerenter', ()=>{ card.style.transform = 'translateY(-6px) scale(1.01)'; });
    card.addEventListener('pointerleave', ()=>{ card.style.transform = ''; });
  }

})();
