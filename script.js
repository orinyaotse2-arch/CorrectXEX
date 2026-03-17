/* ═══════════════════════════════════════════
   XEX — FUTURE WEAR  |  script.js
   © 2026 XEX. All rights reserved.
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     CUSTOM CURSOR
     Two-layer cursor: dot + lagging ring
  ────────────────────────────────────── */
  const cur  = document.getElementById('cur');
  const curO = document.getElementById('cur-o');

  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let ox = mx, oy = my;

  // Snap dot to mouse immediately
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Lag outer ring behind with lerp
  (function loop() {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
    ox += (mx - ox) * 0.1;
    oy += (my - oy) * 0.1;
    curO.style.left = ox + 'px';
    curO.style.top  = oy + 'px';
    requestAnimationFrame(loop);
  })();

  // Expand cursor on hover over interactive elements
  document.querySelectorAll('a, button, .pcard, .coll-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });


  /* ──────────────────────────────────────
     NAVIGATION — Frosted glass on scroll
  ────────────────────────────────────── */
  const navEl = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ──────────────────────────────────────
     PRODUCT CARDS
     3D tilt + cursor-tracked light scatter
  ────────────────────────────────────── */
  document.querySelectorAll('.pcard').forEach(card => {
    const inner = card.querySelector('.pcard-inner');

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;

      // Light scatter origin (CSS custom property)
      card.style.setProperty('--cx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--cy', (y * 100).toFixed(1) + '%');

      // 3D tilt — max ±6deg horizontal, ±4deg vertical
      inner.style.transform = `rotateY(${(x - 0.5) * 6}deg) rotateX(${-(y - 0.5) * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateY(0) rotateX(0)';
    });
  });


  /* ──────────────────────────────────────
     SCROLL REVEAL
     Generic .r elements fade + slide up
  ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.r').forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────
     MANIFESTO TEXT REVEAL
     Clip-path style slide-up from overflow
  ────────────────────────────────────── */
  const manifestoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        manifestoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.mfst-line, .mfst-sub').forEach(el => {
    manifestoObserver.observe(el);
  });


  /* ──────────────────────────────────────
     COLLECTIONS — Drag to scroll
  ────────────────────────────────────── */
  const scrollEl = document.querySelector('.coll-scroll');

  if (scrollEl) {
    let isDown    = false;
    let startX;
    let scrollLeft;

    scrollEl.addEventListener('mousedown', e => {
      isDown     = true;
      startX     = e.pageX - scrollEl.offsetLeft;
      scrollLeft = scrollEl.scrollLeft;
    });
    scrollEl.addEventListener('mouseleave', () => { isDown = false; });
    scrollEl.addEventListener('mouseup',    () => { isDown = false; });
    scrollEl.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x     = e.pageX - scrollEl.offsetLeft;
      const delta = (x - startX) * 1.2;
      scrollEl.scrollLeft = scrollLeft - delta;
    });
  }


  /* ──────────────────────────────────────
     TICKER — Pause on hover
  ────────────────────────────────────── */
  const tickerInner = document.querySelector('.ticker-inner');

  if (tickerInner) {
    tickerInner.parentElement.addEventListener('mouseenter', () => {
      tickerInner.style.animationPlayState = 'paused';
    });
    tickerInner.parentElement.addEventListener('mouseleave', () => {
      tickerInner.style.animationPlayState = 'running';
    });
  }


  /* ──────────────────────────────────────
     PAYSTACK — All buy links
     .pcard-add elements are native <a> tags
     pointing to https://paystack.shop/pay/xex-store
     Clicking anywhere else on the card also goes there.
  ────────────────────────────────────── */
  const PAYSTACK_URL = 'https://paystack.shop/pay/xex-store';

  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('click', e => {
      if (!e.target.closest('.pcard-add')) {
        window.open(PAYSTACK_URL, '_blank', 'noopener,noreferrer');
      }
    });
  });


  /* ──────────────────────────────────────
     NEWSLETTER — Basic submit feedback
  ────────────────────────────────────── */
  const signalBtn   = document.querySelector('.signal-btn');
  const signalInput = document.querySelector('.signal-input');

  if (signalBtn && signalInput) {
    signalBtn.addEventListener('click', () => {
      const email = signalInput.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (isValid) {
        signalBtn.querySelector('span').textContent = 'Subscribed ✓';
        signalBtn.style.background = 'var(--accent)';
        signalInput.value = '';
        signalInput.placeholder = 'You\'re on the list.';
      } else {
        signalInput.style.borderColor = '#ff4444';
        signalInput.placeholder = 'Enter a valid email';
        signalInput.value = '';
        setTimeout(() => {
          signalInput.style.borderColor = '';
          signalInput.placeholder = 'your@email.com';
        }, 2000);
      }
    });
  }

}); // end DOMContentLoaded
