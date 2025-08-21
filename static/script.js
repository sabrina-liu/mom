document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== CAROUSEL (looping, multi-slide, click-to-next) =====
  const viewport = document.querySelector('.carousel-viewport');
  if (viewport) {
    const originals = Array.from(viewport.querySelectorAll('.slide')).map(s => s.cloneNode(true));

    let track = viewport.querySelector('.carousel-track');
    if (!track) {
      track = document.createElement('div');
      track.className = 'carousel-track';
      viewport.innerHTML = '';
      viewport.appendChild(track);
    }

    let spv = readSpv();
    let current = 0;
    let timer = null;
    const delay = parseInt(viewport.dataset.autoplay || '3000', 10);

    function readSpv() {
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spv')) || 1;
      return Math.max(1, Math.round(v));
    }
    function build() {
      track.innerHTML = '';
      spv = readSpv();
      const n = originals.length;
      for (let i = n - spv; i < n; i++) track.appendChild(originals[i % n].cloneNode(true));
      originals.forEach(s => track.appendChild(s.cloneNode(true)));
      for (let i = 0; i < spv; i++) track.appendChild(originals[i].cloneNode(true));
      current = spv;
      setTransform(false);
    }
    function slideWidth() { return viewport.clientWidth / spv; }
    function setTransform(animate = true) {
      track.style.transition = animate ? 'transform .5s ease' : 'none';
      track.style.transform = `translate3d(${-current * slideWidth()}px,0,0)`;
    }
    function show(i) { current = i; setTransform(true); }
    function next() { show(current + 1); }

    track.addEventListener('transitionend', () => {
      const n = originals.length;
      if (current >= n + spv) { current = spv; setTransform(false); }
      else if (current < spv) { current = n + spv - 1; setTransform(false); }
    });

    function start() { stop();  next(); timer = setInterval(next, delay); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    viewport.addEventListener('click', next);
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    window.addEventListener('resize', () => { const old = spv, now = readSpv(); if (now !== old) { build(); start(); } else { setTransform(false); } });

    build();
    start();
  }

// Scroll-based pop-up: bottom-right image + quote; click → contact
const trigger = document.querySelector('.pop-trigger');
if (trigger) {
  const wrap = document.createElement('div');
  wrap.className = 'teacher-float';

  const img = document.createElement('img');
  img.src = '/static/images/mom.PNG';
  img.alt = '林老师卡通形象';
  img.className = 'teacher-left';
  img.onerror = () => { img.src = '/static/images/teacher.jpg'; };

  const quoteBox = document.createElement('div');
  quoteBox.className = 'motto-right';
  const q = document.createElement('q');
  q.textContent = document.body.dataset?.motto || '小朋友快坐好！林老师要开始上网课啦！';
  quoteBox.appendChild(q);

  // Order doesn’t matter because CSS uses row-reverse, but this is explicit:
  wrap.appendChild(img);       // right
  wrap.appendChild(quoteBox);  // left
  document.body.appendChild(wrap);

  // Click anywhere on the popup to go to /contact
  const contactUrl = document.body.dataset?.contact || '/contact';
  wrap.addEventListener('click', () => { window.location.href = contactUrl; });

  // Reveal when near viewport bottom
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting){
      wrap.classList.add('show');
      io.disconnect();
    }
  }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
  io.observe(trigger);

  // If already visible on short pages, show immediately
  if (trigger.getBoundingClientRect().top < window.innerHeight) {
    wrap.classList.add('show');
  }
}


  // ===== GALLERY LIGHTBOX =====
  const gallery = document.getElementById('gallery');
  if (gallery) {
    // Ensure lightbox exists; create if missing
    let box = document.getElementById('lightbox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'lightbox';
      box.className = 'lightbox';
      box.hidden = true;
      box.innerHTML = `
        <button class="lightbox-close" aria-label="关闭">×</button>
        <button class="lightbox-nav prev" aria-label="上一张">‹</button>
        <img class="lightbox-img" alt="">
        <button class="lightbox-nav next" aria-label="下一张">›</button>
        <div class="lightbox-counter" aria-live="polite"></div>`;
      document.body.appendChild(box);
    }

    const thumbs  = Array.from(gallery.querySelectorAll('img'));
    const img     = box.querySelector('.lightbox-img');
    const closeBt = box.querySelector('.lightbox-close');
    const prevBt  = box.querySelector('.lightbox-nav.prev');
    const nextBt  = box.querySelector('.lightbox-nav.next');
    const counter = box.querySelector('.lightbox-counter');
    let i = 0;

    function open(idx){
      if (!thumbs.length) return;
      i = ((idx % thumbs.length) + thumbs.length) % thumbs.length;
      img.src = thumbs[i].src;
      img.alt = thumbs[i].alt || '';
      counter.textContent = `${i+1} / ${thumbs.length}`;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function close(){ box.hidden = true; document.body.style.overflow = ''; }
    function next(){ open(i + 1); }
    function prev(){ open(i - 1); }

    thumbs.forEach((t, idx) => { t.style.cursor = 'zoom-in'; t.addEventListener('click', () => open(idx)); });
    closeBt.addEventListener('click', close);
    nextBt.addEventListener('click', next);
    prevBt.addEventListener('click', prev);
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    window.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    }, { passive: true });
  }

  // Bottom CTA reveal
  const cta = document.getElementById('cta-quote');
  if (cta){
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting){
        cta.classList.add('is-inview');
        io.disconnect(); // run once
      }
    }, { threshold: 0.25 });
    io.observe(cta);
  }

});
