document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== CAROUSEL (looping, multi-slide, click-to-next) =====
  const viewport = document.querySelector('.carousel-viewport');
  if (viewport) {
    const originals = Array.from(viewport.querySelectorAll('.slide')).map(s => s.cloneNode(true));
    if (!originals.length) return;                            // no slides: bail

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
    const delay = Math.max(1000, parseInt(viewport.dataset.autoplay || '3000', 10));

    function readSpv() {
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spv')) || 1;
      return Math.max(1, Math.round(v));
    }
    function build() {
      track.innerHTML = '';
      spv = Math.max(1, Math.min(readSpv(), originals.length)); // cap to slide count
      const n = originals.length;

      // prepend last spv clones
      for (let i = n - spv; i < n; i++) track.appendChild(originals[(i + n) % n].cloneNode(true));
      // real slides
      originals.forEach(s => track.appendChild(s.cloneNode(true)));
      // append first spv clones
      for (let i = 0; i < spv; i++) track.appendChild(originals[i % n].cloneNode(true));

      current = spv;   // first real frame
      setTransform(false);
    }
    function slideWidth() { return viewport.clientWidth / spv; }
    function setTransform(animate = true) {
      track.style.transition = animate ? 'transform .5s ease' : 'none';
      track.style.transform = `translate3d(${-current * slideWidth()}px,0,0)`;
    }
    function show(i) { current = i; setTransform(true); }
    function next()  { show(current + 1); }

    track.addEventListener('transitionend', () => {
      const n = originals.length;
      if (current >= n + spv) { current = spv; setTransform(false); }
      else if (current < spv) { current = n + spv - 1; setTransform(false); }
    });

    function start() { stop(); next(); timer = setInterval(next, delay); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    viewport.addEventListener('click', next, { passive: true });
    viewport.addEventListener('mouseenter', stop, { passive: true });
    viewport.addEventListener('mouseleave', start, { passive: true });
    window.addEventListener('resize', () => {
      const old = spv, now = readSpv();
      if (now !== old) { build(); start(); }
      else { setTransform(false); }
    }, { passive: true });

    build();
    start();
  }

  // ===== POPUP (image only), bottom-right =====
  const trigger = document.querySelector('.pop-trigger');
  if (trigger) {
    const wrap = document.createElement('div');
    wrap.className = 'teacher-float';

    const popImg = document.createElement('img');
    popImg.src = '/static/images/hi.png';   // ensure exact filename/case on server
    popImg.alt = '老师形象';
    popImg.className = 'teacher-left';
    popImg.onerror = () => { popImg.src = '/static/images/hi.png'; };

    wrap.appendChild(popImg);
    document.body.appendChild(wrap);

    const contactUrl = document.body.dataset?.contact || '/contact';
    wrap.addEventListener('click', () => { window.location.href = contactUrl; });

    const popIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting){ wrap.classList.add('show'); popIO.disconnect(); }
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
    popIO.observe(trigger);

    // If already in view (very short pages)
    if (trigger.getBoundingClientRect().top < window.innerHeight) wrap.classList.add('show');
  }

  // ===== GALLERY LIGHTBOX =====
  const gallery = document.getElementById('gallery');
  if (gallery) {
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
    const lbImg   = box.querySelector('.lightbox-img');            // renamed to avoid confusion
    const closeBt = box.querySelector('.lightbox-close');
    const prevBt  = box.querySelector('.lightbox-nav.prev');
    const nextBt  = box.querySelector('.lightbox-nav.next');
    const counter = box.querySelector('.lightbox-counter');
    let i = 0;

    function open(idx){
      if (!thumbs.length) return;
      i = ((idx % thumbs.length) + thumbs.length) % thumbs.length;
      lbImg.src = thumbs[i].src;
      lbImg.alt = thumbs[i].alt || '';
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

  // ===== Bottom CTA reveal =====
  const cta = document.getElementById('cta-quote');
  if (cta){
    const ctaIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting){
        cta.classList.add('is-inview');
        ctaIO.disconnect();
      }
    }, { threshold: 0.25 });
    ctaIO.observe(cta);
  }

  // ===== About: collapse/expand =====
  // About: collapse/expand (text + arrow + label swap)
  document.querySelectorAll('.collapse-toggle').forEach(btn => {
    const id = btn.getAttribute('aria-controls');
    const box = document.getElementById(id);
    if (!box) return;

    const labelEl = btn.querySelector('.label');
    const moreTxt = btn.dataset.more || '更多';
    const lessTxt = btn.dataset.less || '更少';

    // initial state
    labelEl.textContent = moreTxt;

    btn.addEventListener('click', () => {
      const open = box.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      labelEl.textContent = open ? lessTxt : moreTxt;
    });
  });

});
