document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Full-bleed carousel with autoplay every 3s
  const viewport = document.querySelector('.carousel-viewport');
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');
  let index = 0, timer = null, pause = false;

  function slides() { return Array.from(document.querySelectorAll('.slide')); }
  function goTo(i) {
    const s = slides();
    if (!s.length) return;
    index = (i + s.length) % s.length;
    s[index].scrollIntoView({behavior: 'smooth', inline: 'start'});
  }
  function startAutoplay() {
    stopAutoplay();
    const delay = parseInt(viewport?.dataset.autoplay || "3000", 10);
    timer = setInterval(() => { if (!pause) goTo(index + 1); }, delay);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }

  if (viewport) {
    viewport.addEventListener('scroll', () => {
      const s = slides();
      const vp = viewport.getBoundingClientRect();
      const offsets = s.map(slide => Math.abs(slide.getBoundingClientRect().left - vp.left));
      index = offsets.indexOf(Math.min(...offsets));
    }, {passive: true});

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));

    viewport.addEventListener('mouseenter', () => pause = true);
    viewport.addEventListener('mouseleave', () => pause = false);
    viewport.addEventListener('pointerdown', () => pause = true);
    window.addEventListener('blur', () => pause = true);
    window.addEventListener('focus', () => pause = false);

    startAutoplay();
  }

  // Scroll-based pop-up: teacher left + motto right
  const trigger = document.querySelector('.pop-trigger');
  if (trigger) {
    const wrap = document.createElement('div');
    wrap.className = 'teacher-float';

    const left = document.createElement('img');
    left.src = '/static/images/teacher.jpg';
    left.alt = '林老师卡通形象';
    left.className = 'teacher-left';

    const right = document.createElement('div');
    right.className = 'motto-right';
    const q = document.createElement('q');
    q.textContent = document.body.dataset?.motto || "小朋友快坐好！林老师要开始上网课啦！";
    right.appendChild(q);

    wrap.appendChild(left); wrap.appendChild(right);
    document.body.appendChild(wrap);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { wrap.classList.toggle('show', entry.isIntersecting); });
    }, {threshold: 0.2});
    io.observe(trigger);
  }
});
