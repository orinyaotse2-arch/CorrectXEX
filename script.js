/* ═══════════════════════════════════════
   XEX — script.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tick() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  const interactives = 'a, button, .pcard, .coll-item, .stat';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });

  /* ── Header on scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });

  /* ── Product card: cursor-tracked glow ── */
  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.querySelector('.pcard-glow')?.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.querySelector('.pcard-glow')?.style.setProperty('--gy', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ── Collection drag-scroll ── */
  const rail = document.querySelector('.coll-rail');
  if (rail) {
    let down = false, sx, sl;
    rail.addEventListener('mousedown',  e => { down = true; sx = e.pageX - rail.offsetLeft; sl = rail.scrollLeft; });
    rail.addEventListener('mouseleave', () => down = false);
    rail.addEventListener('mouseup',    () => down = false);
    rail.addEventListener('mousemove',  e => {
      if (!down) return;
      e.preventDefault();
      rail.scrollLeft = sl - (e.pageX - rail.offsetLeft - sx) * 1.2;
    });
  }

  /* ── Marquee pause on hover ── */
  const track = document.querySelector('.marquee-track');
  if (track) {
    track.parentElement.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.parentElement.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ── Email subscribe ── */
  const btn   = document.querySelector('.signal-btn');
  const input = document.querySelector('.signal-input');
  if (btn && input) {
    btn.addEventListener('click', () => {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (ok) {
        btn.querySelector('span').textContent = 'Done ✓';
        btn.style.background = '#e8cc6a';
        input.value = '';
        input.placeholder = "You're on the list.";
      } else {
        input.style.borderColor = '#8b3a3a';
        input.placeholder = 'Please enter a valid email';
        input.value = '';
        setTimeout(() => { input.style.borderColor = ''; input.placeholder = 'your@email.com'; }, 2200);
      }
    });
  }

});
