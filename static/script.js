document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const viewport = document.querySelector('.carousel-viewport');
  if (!viewport) return;

  // 1) Capture original slides, then rebuild track with edge clones
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
    // --spv is set in CSS and may change via media queries
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spv')) || 1;
    return Math.max(1, Math.round(v));
  }

  function build() {
    track.innerHTML = '';
    spv = readSpv();
    const n = originals.length;

    // prepend last spv as clones
    for (let i = n - spv; i < n; i++) track.appendChild(originals[i % n].cloneNode(true));
    // real slides
    originals.forEach(s => track.appendChild(s.cloneNode(true)));
    // append first spv as clones
    for (let i = 0; i < spv; i++) track.appendChild(originals[i].cloneNode(true));

    current = spv;          // start at first real frame
    setTransform(false);    // jump without animation
  }

  function slideWidth() { return viewport.clientWidth / spv; }
  function setTransform(animate = true) {
    track.style.transition = animate ? 'transform .5s ease' : 'none';
    track.style.transform = `translate3d(${-current * slideWidth()}px,0,0)`;
  }

  function show(i) { current = i; setTransform(true); }
  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  // 2) Loop correction after each animated slide
  track.addEventListener('transitionend', () => {
    const n = originals.length;
    if (current >= n + spv) {         // past the last real frame (in trailing clones)
      current = spv;                  // snap to first real frame
      setTransform(false);
    } else if (current < spv) {       // before the first real frame (in leading clones)
      current = n + spv - 1;          // snap to last real frame
      setTransform(false);
    }
  });

  // 3) Autoplay + click-to-advance (no scroll)
  function start() { stop(); timer = setInterval(next, delay); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }

  viewport.addEventListener('click', next);
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  window.addEventListener('resize', () => {
    const old = spv, now = readSpv();
    if (now !== old) { build(); start(); } else { setTransform(false); }
  });

  build();
  start();

  // Scroll-based pop-up: teacher left + motto right
  const trigger = document.querySelector('.pop-trigger');
  if (trigger) {
    const wrap = document.createElement('div');
    wrap.className = 'teacher-float';

    const left = document.createElement('img');
    left.src = '/static/images/mom.PNG';
    left.alt = '林老师卡通形象';
    left.className = 'teacher-left';
    left.onerror = () => { left.src = '/static/images/teacher.jpg'; }; // fallback

    const right = document.createElement('div');
    right.className = 'motto-right';
    const q = document.createElement('q');
    q.textContent = document.body.dataset?.motto || '小朋友快坐好！林老师要开始上网课啦！';
    right.appendChild(q);

    wrap.appendChild(left); wrap.appendChild(right);
    document.body.appendChild(wrap);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { wrap.classList.toggle('show', entry.isIntersecting); });
    }, { threshold: 0.2 });
    io.observe(trigger);
  }
});
