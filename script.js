/* ═══════════════════════════════════════
   XEX Extra Xone — script.js  v5
═══════════════════════════════════════ */

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
  document.querySelectorAll('a, button, .pcard, .coll-card, .lbcard, .ls-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  /* ── About modal ── */
  const modal    = document.getElementById('about-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const trigger  = document.getElementById('about-trigger');
  const ftAbout  = document.getElementById('ft-about');

  const openModal  = () => { modal.classList.add('open');  document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };

  trigger?.addEventListener('click', openModal);
  ftAbout?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Header on scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('elevated', scrollY > 10);
  }, { passive: true });

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

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
  const abar   = document.querySelector('.announce-bar');
  const atrack = document.querySelector('.announce-track');
  if (abar && atrack) {
    abar.addEventListener('mouseenter', () => atrack.style.animationPlayState = 'paused');
    abar.addEventListener('mouseleave', () => atrack.style.animationPlayState = 'running');
  }

  /* ── Marquee pause ── */
  const mq = document.querySelector('.marquee');
  const mi = document.querySelector('.marquee-inner');
  if (mq && mi) {
    mq.addEventListener('mouseenter', () => mi.style.animationPlayState = 'paused');
    mq.addEventListener('mouseleave', () => mi.style.animationPlayState = 'running');
  }

  /* ── Email subscribe ── */
  const sigBtn   = document.getElementById('sig-submit');
  const sigInput = document.querySelector('.sig-input');
  if (sigBtn && sigInput) {
    const submit = () => {
      const val = sigInput.value.trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        sigBtn.querySelector('span').textContent = 'Done ✓';
        sigBtn.style.background = '#e03030';
        sigInput.value = '';
        sigInput.placeholder = "You're on the list.";
        setTimeout(() => {
          sigBtn.querySelector('span').textContent = 'Join';
          sigBtn.style.background = '';
          sigInput.placeholder = 'your@email.com';
        }, 4000);
      } else {
        sigInput.style.borderColor = '#8b0000';
        sigInput.placeholder = 'Enter a valid email address';
        sigInput.value = '';
        setTimeout(() => {
          sigInput.style.borderColor = '';
          sigInput.placeholder = 'your@email.com';
        }, 2500);
      }
    };
    sigBtn.addEventListener('click', submit);
    sigInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

});
