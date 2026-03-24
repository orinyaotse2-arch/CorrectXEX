/* ═══════════════════════════════════════════
   XEX Extra Xone — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom cursor ── */
  const dot   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let tx = mx, ty = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerp() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(lerp);
  })();

  const interactables = 'a, button, .product-card, .coll-card';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  /* ── About modal ── */
  const modal   = document.getElementById('about-modal');
  const trigger = document.getElementById('about-trigger');
  const ftAbout = document.getElementById('ft-about');
  const closeBtn= document.getElementById('modal-close');
  const backdrop= document.getElementById('modal-backdrop');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  trigger?.addEventListener('click', openModal);
  ftAbout?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Scroll reveal ── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  /* ── Header elevation on scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('elevated', scrollY > 10);
  }, { passive: true });

  /* ── Collection drag scroll ── */
  const cscroll = document.querySelector('.coll-scroll');
  if (cscroll) {
    let down = false, sx = 0, sl = 0;
    cscroll.addEventListener('mousedown',  e => { down = true; sx = e.pageX - cscroll.offsetLeft; sl = cscroll.scrollLeft; });
    cscroll.addEventListener('mouseleave', () => down = false);
    cscroll.addEventListener('mouseup',    () => down = false);
    cscroll.addEventListener('mousemove',  e => {
      if (!down) return;
      e.preventDefault();
      cscroll.scrollLeft = sl - (e.pageX - cscroll.offsetLeft - sx) * 1.2;
    });
  }

  /* ── Announcement bar pause ── */
  const abar = document.querySelector('.announce-bar');
  const atrack = document.querySelector('.announce-track');
  if (abar && atrack) {
    abar.addEventListener('mouseenter', () => atrack.style.animationPlayState = 'paused');
    abar.addEventListener('mouseleave', () => atrack.style.animationPlayState = 'running');
  }

  /* ── Marquee pause ── */
  const mqwrap = document.querySelector('.marquee');
  const mqinner = document.querySelector('.marquee-inner');
  if (mqwrap && mqinner) {
    mqwrap.addEventListener('mouseenter', () => mqinner.style.animationPlayState = 'paused');
    mqwrap.addEventListener('mouseleave', () => mqinner.style.animationPlayState = 'running');
  }

  /* ── Email subscribe ── */
  const sigBtn   = document.getElementById('sig-submit');
  const sigInput = document.querySelector('.sig-input');
  if (sigBtn && sigInput) {
    sigBtn.addEventListener('click', () => {
      const val = sigInput.value.trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        sigBtn.querySelector('span').textContent = 'Done ✓';
        sigBtn.style.background = '#ecd060';
        sigInput.value = '';
        sigInput.placeholder = "You're on the list.";
        setTimeout(() => {
          sigBtn.querySelector('span').textContent = 'Join';
          sigBtn.style.background = '';
          sigInput.placeholder = 'your@email.com';
        }, 4000);
      } else {
        sigInput.style.borderColor = '#8b2e2e';
        sigInput.placeholder = 'Enter a valid email address';
        sigInput.value = '';
        setTimeout(() => {
          sigInput.style.borderColor = '';
          sigInput.placeholder = 'your@email.com';
        }, 2500);
      }
    });

    sigInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sigBtn.click();
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
