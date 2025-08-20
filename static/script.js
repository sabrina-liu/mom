document.addEventListener('DOMContentLoaded', () => {
  // Update footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Carousel logic with natural 'magnetism' using CSS scroll-snap + arrows
  const viewport = document.querySelector('[data-carousel]');
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');

  if (viewport && prevBtn && nextBtn) {
    const slides = () => Array.from(viewport.querySelectorAll('.slide'));
    let index = 0;

    function goTo(i) {
      const s = slides();
      index = Math.max(0, Math.min(i, s.length - 1));
      s[index].scrollIntoView({behavior: 'smooth', inline: 'start'});
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    // Track current slide by observing scroll position
    viewport.addEventListener('scroll', () => {
      const s = slides();
      const offsets = s.map(slide => Math.abs(slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left));
      index = offsets.indexOf(Math.min(...offsets));
    }, {passive: true});

    // Drag-to-scroll (nice on desktop)
    let isDown = false, startX = 0, startScroll = 0;
    viewport.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      viewport.scrollLeft = startScroll - dx;
    });
    ['pointerup','pointercancel','mouseleave'].forEach(ev => viewport.addEventListener(ev, () => {
      isDown = false;
    }));

    // Keyboard support
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    });
  }

  // IntersectionObserver to show the teacher character when reaching the trigger
  const trigger = document.querySelector('.pop-trigger');
  if (trigger) {
    const img = document.createElement('img');
    img.src = '/static/images/teacher.jpg';
    img.alt = 'Teacher character';
    img.className = 'teacher-pop';
    document.body.appendChild(img);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) img.classList.add('show');
        else img.classList.remove('show');
      });
    }, {threshold: 0.2});
    io.observe(trigger);
  }
});
