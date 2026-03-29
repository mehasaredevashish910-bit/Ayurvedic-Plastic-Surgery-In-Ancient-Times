
// ── PROGRESS BAR ──
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ── CANVAS ANIMATIONS ──

function parchmentBg(ctx, w, h, col1 = '#F5ECD7', col2 = '#E8D5B0') {
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0, col1); g.addColorStop(1, col2);
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
}

// ── C1: Patient Prep — Mandala + Oil drops ──
(function() {
  const cv = document.getElementById('c1');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440, cx = 220, cy = 220;
  let t = 0;

  function drawLotus(ctx, x, y, r, angle, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); ctx.rotate(angle);
    for (let i = 0; i < 8; i++) {
      ctx.save(); ctx.rotate(i * Math.PI/4);
      ctx.beginPath();
      ctx.ellipse(0, -r*0.7, r*0.25, r*0.6, 0, 0, Math.PI*2);
      ctx.fillStyle = i%2===0 ? '#E8750A' : '#F0A500';
      ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#2C1810', '#1a0a05');
    t++;

    // Mandala rings
    for (let r = 30; r <= 180; r += 30) {
      ctx.beginPath();
      ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle = `rgba(201,148,26,${0.15 + 0.05*Math.sin(t/60+r)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Rotating lotus
    drawLotus(ctx, cx, cy, 80, t*0.005, 0.9);

    // Oil drops falling
    for (let i = 0; i < 5; i++) {
      const y = ((t * 1.5 + i * 80) % 300) + 80;
      const x = 80 + i * 70;
      const a = 0.7 * Math.abs(Math.sin((t + i * 30) / 60));
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 8, 0, 0, Math.PI*2);
      ctx.fillStyle = `rgba(181,101,29,${a})`;
      ctx.fill();
      // ripple at bottom
      if (y > 350) {
        ctx.beginPath();
        ctx.ellipse(x, 370, (y-350)*0.5, 3, 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(240,165,0,${0.5 - (y-350)/100})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Sanskrit text
    ctx.save();
    ctx.font = '18px "Tiro Devanagari Sanskrit"';
    ctx.fillStyle = 'rgba(240,165,0,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('स्नेहन', cx, cy + 130);
    ctx.restore();

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C2: Anaesthesia — Smoke / vapour ──
(function() {
  const cv = document.getElementById('c2');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440;
  let t = 0;
  const particles = [];

  class Smoke {
    constructor() { this.reset(); }
    reset() {
      this.x = 180 + Math.random()*80;
      this.y = 320;
      this.vx = (Math.random()-0.5)*0.8;
      this.vy = -(0.5 + Math.random()*1.5);
      this.r = 8 + Math.random()*20;
      this.a = 0.4 + Math.random()*0.3;
      this.life = 0;
      this.maxLife = 120 + Math.random()*80;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vx += (Math.random()-0.5)*0.05;
      this.r += 0.3;
      this.life++;
      this.a = (1 - this.life/this.maxLife) * 0.35;
      if (this.life > this.maxLife) this.reset();
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(100,80,60,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 30; i++) { const s = new Smoke(); s.life = Math.random()*100; particles.push(s); }

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#1a0a05', '#2C1810');
    t++;

    // Bowl
    ctx.beginPath();
    ctx.ellipse(220, 340, 70, 18, 0, 0, Math.PI*2);
    ctx.fillStyle = '#5C3317'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(150, 340); ctx.quadraticCurveTo(220, 390, 290, 340);
    ctx.closePath(); ctx.fillStyle = '#3d1f0a'; ctx.fill();

    // Glow in bowl
    const grd = ctx.createRadialGradient(220,335,2,220,335,60);
    grd.addColorStop(0,'rgba(255,150,0,0.4)');
    grd.addColorStop(1,'rgba(255,80,0,0)');
    ctx.fillStyle = grd; ctx.fillRect(140,300,160,60);

    // Smoke particles
    particles.forEach(p => { p.update(); p.draw(ctx); });

    // Herb elements
    for (let i = 0; i < 5; i++) {
      const hx = 140 + i*28, hy = 330;
      ctx.beginPath();
      ctx.ellipse(hx, hy, 10, 5, Math.sin(t/40+i)*0.5, 0, Math.PI*2);
      ctx.fillStyle = i%2===0 ? '#4a7a20' : '#7aaa30'; ctx.fill();
    }

    // Floating ZZZ for sleep
    const zs = ['Z','z','Z'];
    zs.forEach((z,i) => {
      const zx = 260 + i*20;
      const zy = 200 - ((t*0.5 + i*40) % 120);
      const za = 1 - (zy - 80) / 120;
      ctx.save();
      ctx.globalAlpha = Math.max(0,za);
      ctx.font = `${14+i*4}px serif`;
      ctx.fillStyle = '#C9941A';
      ctx.fillText(z, zx, zy);
      ctx.restore();
    });

    ctx.font = '16px "Tiro Devanagari Sanskrit"';
    ctx.fillStyle = 'rgba(240,165,0,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('सम्मोहिनी', 220, 400);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C3: Instruments — rotating display ──
(function() {
  const cv = document.getElementById('c3');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440, cx = 220, cy = 220;
  let t = 0;
  const tools = [
    { name: 'Mandalagra', shape: 'scalpel' },
    { name: 'Suci', shape: 'needle' },
    { name: 'Sandamsa', shape: 'forceps' },
    { name: 'Shalaka', shape: 'probe' },
    { name: 'Shastrika', shape: 'scissors' },
    { name: 'Svastika', shape: 'speculum' },
  ];

  function drawTool(ctx, x, y, type, angle, active) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    const col = active ? '#E8750A' : '#8B4513';
    const glow = active ? 0.8 : 0.4;
    ctx.strokeStyle = col; ctx.lineWidth = active ? 3 : 2;
    ctx.globalAlpha = glow;
    if (type === 'scalpel') {
      ctx.beginPath(); ctx.moveTo(-30,0); ctx.lineTo(20,0);
      ctx.moveTo(20,0); ctx.lineTo(30,-8); ctx.lineTo(25,0); ctx.lineTo(30,8); ctx.closePath();
      ctx.stroke();
    } else if (type === 'needle') {
      ctx.beginPath(); ctx.moveTo(-25,-5); ctx.bezierCurveTo(-10,-5,10,5,25,5); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-22,0,4,3,0,0,Math.PI*2); ctx.stroke();
    } else if (type === 'forceps') {
      ctx.beginPath(); ctx.moveTo(-5,-30); ctx.lineTo(0,0); ctx.lineTo(5,-30); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-2,5); ctx.lineTo(-8,25); ctx.moveTo(2,5); ctx.lineTo(8,25); ctx.stroke();
    } else if (type === 'probe') {
      ctx.beginPath(); ctx.moveTo(-30,0); ctx.lineTo(28,0);
      ctx.arc(28,0,3,0,Math.PI*2); ctx.stroke();
    } else if (type === 'scissors') {
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-20,-20);
      ctx.moveTo(0,0); ctx.lineTo(-20,20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(25,0); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.ellipse(0,0,20,12,0,0,Math.PI*2);
      ctx.moveTo(-20,0); ctx.lineTo(-30,0); ctx.moveTo(20,0); ctx.lineTo(30,0); ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#F5ECD7', '#E8D5B0');
    t++;

    // Outer circle
    ctx.beginPath(); ctx.arc(cx,cy,170,0,Math.PI*2);
    ctx.strokeStyle = 'rgba(181,101,29,0.2)'; ctx.lineWidth = 1; ctx.stroke();

    tools.forEach((tool, i) => {
      const a = (i / tools.length) * Math.PI*2 + t*0.008;
      const x = cx + Math.cos(a)*140;
      const y = cy + Math.sin(a)*140;
      const active = Math.floor(t/90) % tools.length === i;
      drawTool(ctx, x, y, tool.shape, a, active);
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.font = '11px "Cormorant Garamond"';
      ctx.fillStyle = '#5C3317';
      ctx.textAlign = 'center';
      ctx.fillText(tool.name, x, y + 30);
      ctx.restore();
    });

    // Center decoration
    ctx.beginPath(); ctx.arc(cx,cy,30,0,Math.PI*2);
    ctx.fillStyle = 'rgba(232,117,10,0.1)'; ctx.fill();
    ctx.strokeStyle = '#C9941A'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '20px "Tiro Devanagari Sanskrit"';
    ctx.fillStyle = '#8B1A1A'; ctx.textAlign = 'center';
    ctx.fillText('शस्त्र', cx, cy+8);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C4: Incision — leaf template + cut line ──
(function() {
  const cv = document.getElementById('c4');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440;
  let t = 0, phase = 0, cutProgress = 0;

  function drawFace(ctx) {
    // simple face silhouette
    ctx.save();
    // Head outline
    ctx.beginPath();
    ctx.ellipse(220, 200, 100, 130, 0, 0, Math.PI*2);
    ctx.fillStyle = '#D4956A'; ctx.fill();
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2; ctx.stroke();
    // Forehead marking area
    ctx.beginPath();
    ctx.ellipse(220, 130, 45, 30, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(232,117,10,0.25)'; ctx.fill();
    ctx.setLineDash([4,4]);
    ctx.strokeStyle = '#E8750A'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);
    // Nose area
    ctx.beginPath();
    ctx.moveTo(205,200); ctx.lineTo(220,240); ctx.lineTo(235,200);
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2; ctx.stroke();
    // Eyes
    ctx.beginPath(); ctx.ellipse(195, 170, 12, 8, 0, 0, Math.PI*2);
    ctx.fillStyle = '#3d1f0a'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(245, 170, 12, 8, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#FDF6E8', '#F0E0B8');
    t++;

    drawFace(ctx);

    // Animated leaf template
    const leafY = 130 + Math.sin(t/60)*5;
    ctx.save();
    ctx.translate(220, leafY);
    ctx.rotate(Math.sin(t/80)*0.1);
    ctx.beginPath();
    ctx.moveTo(0,-22); ctx.bezierCurveTo(20,-15,20,15,0,22);
    ctx.bezierCurveTo(-20,15,-20,-15,0,-22);
    ctx.fillStyle = 'rgba(74,122,32,0.5)'; ctx.fill();
    ctx.strokeStyle = '#4a7a20'; ctx.lineWidth = 1.5; ctx.stroke();
    // leaf vein
    ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(0,20);
    ctx.strokeStyle = 'rgba(74,122,32,0.7)'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.restore();

    // Incision line drawing animation
    if (t > 100) {
      cutProgress = Math.min(1, (t-100)/80);
      const startX = 190, startY = 115;
      const endX = 250, endY = 115;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + (endX-startX)*cutProgress, startY + (endY-startY)*cutProgress);
      ctx.strokeStyle = '#8B1A1A'; ctx.lineWidth = 2.5;
      ctx.setLineDash([]); ctx.stroke();
      // blood drop at tip
      if (cutProgress > 0.1) {
        const dx = startX + (endX-startX)*cutProgress;
        ctx.beginPath(); ctx.arc(dx, startY+4, 3, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(139,26,26,0.8)'; ctx.fill();
      }
    }

    // Loop
    if (t > 200) t = 50;

    ctx.font = '14px "Cormorant Garamond"';
    ctx.fillStyle = '#5C3317'; ctx.textAlign = 'center';
    ctx.fillText('Leaf template measurement', 220, 400);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C5: Flap Harvest — animated pedicle flap ──
(function() {
  const cv = document.getElementById('c5');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440;
  let t = 0;

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#2C1810', '#3d2010');
    t++;

    const flap = Math.min(1, t / 150);
    const pulse = 0.05 * Math.sin(t / 20);

    // Forehead silhouette
    ctx.beginPath();
    ctx.ellipse(220, 160, 110, 80, 0, 0, Math.PI);
    ctx.fillStyle = '#D4956A'; ctx.fill();

    // Pedicle flap lifting
    ctx.save();
    const flapAngle = flap * 0.8;
    ctx.translate(220, 155);
    ctx.rotate(-flapAngle);

    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.quadraticCurveTo(-40, -60, 0, -70);
    ctx.quadraticCurveTo(40, -60, 40, 0);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,140,80,${0.7 + pulse})`;
    ctx.fill();
    ctx.strokeStyle = '#8B1A1A'; ctx.lineWidth = 2; ctx.stroke();

    // Underside vessels
    ctx.beginPath();
    ctx.moveTo(0,0); ctx.lineTo(0,-60);
    ctx.strokeStyle = 'rgba(139,26,26,0.8)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();

    // Nose defect area
    ctx.beginPath();
    ctx.ellipse(220, 290, 35, 28, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(139,26,26,0.3)'; ctx.fill();
    ctx.setLineDash([5,5]);
    ctx.strokeStyle = '#E8750A'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);

    // Arrow if flap lifted enough
    if (flap > 0.5) {
      const arrowA = Math.max(0, (flap - 0.5)*2);
      ctx.save(); ctx.globalAlpha = arrowA;
      ctx.beginPath();
      ctx.moveTo(220, 220); ctx.lineTo(220, 265);
      ctx.strokeStyle = '#F0A500'; ctx.lineWidth = 2;
      ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(213,258); ctx.lineTo(220,268); ctx.lineTo(227,258);
      ctx.fillStyle = '#F0A500'; ctx.fill();
      ctx.restore();
    }

    if (t > 220) t = 30;

    ctx.font = '14px "Cormorant Garamond"';
    ctx.fillStyle = 'rgba(245,236,215,0.8)'; ctx.textAlign = 'center';
    ctx.fillText('Pedicle flap raised — blood supply preserved', 220, 415);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C6: Suturing — animated needle & thread ──
(function() {
  const cv = document.getElementById('c6');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440;
  let t = 0;

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#F5ECD7', '#E8D5B0');
    t++;

    // Nose shape (reconstructed)
    ctx.beginPath();
    ctx.moveTo(185, 200);
    ctx.quadraticCurveTo(185, 280, 220, 300);
    ctx.quadraticCurveTo(255, 280, 255, 200);
    ctx.fillStyle = '#D4956A'; ctx.fill();
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2; ctx.stroke();

    // Suture points and thread
    const sutures = [
      [185,200],[190,230],[195,260],[210,285],[220,300],[230,285],[245,260],[250,230],[255,200]
    ];

    // Draw completed sutures
    const progress = (t % 300) / 300;
    const done = Math.floor(progress * sutures.length);

    for (let i = 0; i < done - 1; i++) {
      const [x1,y1] = sutures[i];
      const [x2,y2] = sutures[i+1];
      ctx.beginPath();
      ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle = '#C9941A'; ctx.lineWidth = 1.5;
      ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
      // Dot
      ctx.beginPath(); ctx.arc(x1,y1,3,0,Math.PI*2);
      ctx.fillStyle = '#8B1A1A'; ctx.fill();
    }

    // Animated needle
    if (done < sutures.length) {
      const [nx,ny] = sutures[done];
      const pulse = Math.sin(t/10)*3;
      ctx.beginPath();
      ctx.moveTo(nx-15+pulse, ny-15);
      ctx.bezierCurveTo(nx-5,ny-10,nx+5,ny-5,nx,ny);
      ctx.strokeStyle = '#888'; ctx.lineWidth = 2.5; ctx.stroke();
      // Thread trail
      if (done > 0) {
        const [px,py] = sutures[done-1];
        ctx.beginPath(); ctx.moveTo(px,py);
        ctx.bezierCurveTo(px-20,py-20,nx-20,ny-20,nx,ny);
        ctx.strokeStyle = '#C9941A'; ctx.lineWidth = 1;
        ctx.setLineDash([3,4]); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    // Reed stents
    ctx.beginPath(); ctx.ellipse(208,252,6,15,0,0,Math.PI*2);
    ctx.strokeStyle = '#7aaa30'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(232,252,6,15,0,0,Math.PI*2);
    ctx.stroke();

    ctx.font = '13px "Cormorant Garamond"';
    ctx.fillStyle = '#5C3317'; ctx.textAlign = 'center';
    ctx.fillText('Hemp sutures with reed stents', 220, 400);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C7: Wound dressing — bandage wrapping ──
(function() {
  const cv = document.getElementById('c7');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440;
  let t = 0;

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#FDF6E8', '#F0E0B8');
    t++;

    // Head
    ctx.beginPath(); ctx.ellipse(220,200,100,130,0,0,Math.PI*2);
    ctx.fillStyle = '#D4956A'; ctx.fill();
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2; ctx.stroke();

    // Bandage wrapping animation
    const wraps = 5;
    const progress = Math.min(1, (t % 200) / 180);
    const bandageAngle = progress * wraps * Math.PI * 2;

    ctx.save();
    ctx.translate(220,200);
    ctx.beginPath();
    for (let a = 0; a <= bandageAngle; a += 0.05) {
      const r = 80 + (a/(wraps*Math.PI*2))*20;
      const spiral_y = -40 + (a/(wraps*Math.PI*2))*80;
      const x = Math.cos(a) * r * 0.9;
      const y = spiral_y + Math.sin(a)*20;
      a === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.strokeStyle = 'rgba(245,236,215,0.9)'; ctx.lineWidth = 8;
    ctx.lineCap = 'round'; ctx.stroke();
    ctx.strokeStyle = 'rgba(181,101,29,0.3)'; ctx.lineWidth = 8.5; ctx.stroke();
    ctx.restore();

    // Oil drip
    const oilY = 60 + ((t*0.8) % 120);
    ctx.beginPath(); ctx.ellipse(300, oilY, 4, 7, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(184,142,74,0.8)'; ctx.fill();

    // Herb label
    const herbs = ['Ghrita','Tila','Neem','Turmeric'];
    herbs.forEach((h,i) => {
      const visible = Math.floor(t/80) % herbs.length === i;
      ctx.save(); ctx.globalAlpha = visible ? 1 : 0.2;
      ctx.font = '13px "Cormorant Garamond"';
      ctx.fillStyle = '#4a7a20';
      ctx.textAlign = 'center';
      ctx.fillText('🌿 ' + h, 330, 180 + i*30);
      ctx.restore();
    });

    ctx.font = '13px "Cormorant Garamond"';
    ctx.fillStyle = '#5C3317'; ctx.textAlign = 'center';
    ctx.fillText('Medicated Shiroband dressing', 220, 400);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── C8: Recovery — blooming lotus / healing ──
(function() {
  const cv = document.getElementById('c8');
  const ctx = cv.getContext('2d');
  const W = 440, H = 440;
  let t = 0;

  function drawPetal(ctx, cx, cy, r, angle, open, col) {
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -r*open*0.5, r*0.2*open, r*open, 0, 0, Math.PI*2);
    ctx.fillStyle = col; ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    parchmentBg(ctx, W, H, '#1a0a05', '#2C1810');
    t++;

    const bloom = (Math.sin(t/120)+1)/2;
    const cx = 220, cy = 200;

    // Water ripples
    for (let r = 20; r < 180; r += 25) {
      const wr = r + Math.sin(t/40+r)*3;
      ctx.beginPath(); ctx.arc(cx,cy+60,wr,0,Math.PI*2);
      ctx.strokeStyle = `rgba(74,122,200,${0.15 - r/1500})`; ctx.lineWidth = 1; ctx.stroke();
    }

    // Stem
    ctx.beginPath(); ctx.moveTo(cx,cy+30); ctx.lineTo(cx,cy+120);
    ctx.strokeStyle = '#4a7a20'; ctx.lineWidth = 4; ctx.stroke();

    // Petals
    const cols = ['#E8750A','#F0A500','#D4526A','#F0A500','#E8750A','#F0A500','#D4526A','#F0A500'];
    for (let i = 0; i < 8; i++) {
      drawPetal(ctx, cx, cy, 70*bloom, (i/8)*Math.PI*2, bloom, cols[i]);
    }

    // Inner petals
    for (let i = 0; i < 6; i++) {
      drawPetal(ctx, cx, cy, 45*bloom, (i/6)*Math.PI*2+0.3, bloom*0.8, '#F5C842');
    }

    // Center
    ctx.beginPath(); ctx.arc(cx,cy,12*bloom+3,0,Math.PI*2);
    const g2 = ctx.createRadialGradient(cx,cy,0,cx,cy,15);
    g2.addColorStop(0,'#FFF5A0'); g2.addColorStop(1,'#C9941A');
    ctx.fillStyle = g2; ctx.fill();

    // Healing sparks
    for (let i = 0; i < 6; i++) {
      const sa = (t/40 + i*(Math.PI/3));
      const sr = 30 + bloom*50;
      const sx = cx + Math.cos(sa)*sr;
      const sy = cy + Math.sin(sa)*sr;
      ctx.beginPath(); ctx.arc(sx,sy,2+bloom*2,0,Math.PI*2);
      ctx.fillStyle = `rgba(240,165,0,${bloom*0.8})`; ctx.fill();
    }

    // Text
    ctx.font = '16px "Tiro Devanagari Sanskrit"';
    ctx.fillStyle = 'rgba(240,165,0,0.8)'; ctx.textAlign = 'center';
    ctx.fillText('आरोग्यम् — Healing', cx, 390);

    requestAnimationFrame(draw);
  }
  draw();
})();
