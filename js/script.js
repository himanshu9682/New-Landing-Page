/* =========================================
   Hero countdown timer
========================================= */
(function () {
  const target = new Date();
  target.setDate(target.getDate() + 2);
  function pad(n) { return String(n).padStart(2, '0'); }
  function update() {
    const diff = Math.max(0, target.getTime() - Date.now());
    document.getElementById('cd-days').textContent    = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-hours').textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById('cd-minutes').textContent = pad(Math.floor((diff % 3600000) / 60000));
    document.getElementById('cd-seconds').textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  update();
  setInterval(update, 1000);
})();

/* =========================================
   Mastermind countdown timer (5 min)
========================================= */
(function() {
  const el = document.getElementById('stripTimer');
  if (!el) return;
  let secs = 5 * 60;
  function tick() {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    el.textContent = `Offer expires in ${m}:${s}`;
    if (secs > 0) { secs--; setTimeout(tick, 1000); }
    else { el.textContent = 'Offer expired'; }
  }
  tick();
})();

/* =========================================
   Navbar scroll + countdown strip sticky
========================================= */
const navbar = document.getElementById('navbar');
const countdownStrip = document.getElementById('countdownStrip');

let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 10);
  navbar.classList.toggle('hide', y > lastY && y > navbar.offsetHeight);
  lastY = y;
});

if (countdownStrip) {
  const triggerY = countdownStrip.getBoundingClientRect().top + window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 992) {
      if (countdownStrip.classList.contains('is-sticky')) {
        countdownStrip.classList.remove('is-sticky');
        countdownStrip.style.width = '';
        countdownStrip.style.height = '';
      }
      return;
    }
    const shouldStick = window.scrollY > triggerY;
    if (shouldStick && !countdownStrip.classList.contains('is-sticky')) {
      const rect = countdownStrip.getBoundingClientRect();
      countdownStrip.style.width = rect.width + 'px';
      countdownStrip.style.height = rect.height + 'px';
      countdownStrip.classList.add('is-sticky');
    } else if (!shouldStick && countdownStrip.classList.contains('is-sticky')) {
      countdownStrip.classList.remove('is-sticky');
      countdownStrip.style.width = '';
      countdownStrip.style.height = '';
    }
  }, { passive: true });
}

/* =========================================
   Mobile menu
========================================= */
const hamburger = document.getElementById('hamburger');
hamburger?.addEventListener('click', () => {
  const cta = document.querySelector('.nav-cta');
  const open = cta.style.display === 'inline-flex';
  cta.style.display = open ? 'none' : 'inline-flex';
  hamburger.setAttribute('aria-expanded', !open);
});

/* =========================================
   Smooth scroll for [data-scroll-to]
========================================= */
document.querySelectorAll('[data-scroll-to]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.scrollTo);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =========================================
   Testimonial slider
========================================= */
(function initSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('sliderDots');
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');
  let index = 0;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  go(0);
  setInterval(() => go(index + 1), 5000);
})();

/* =========================================
   Accordion (FAQ)
========================================= */
document.querySelectorAll('.acc-head').forEach(head => {
  head.addEventListener('click', () => {
    head.parentElement.classList.toggle('open');
  });
});

/* =========================================
   Reveal on scroll (IntersectionObserver)
========================================= */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* =========================================
   Counters
========================================= */
const counters = document.querySelectorAll('.count');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur.toLocaleString();
    }, 20);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));

/* =========================================
   Back to top
========================================= */
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backBtn.classList.toggle('show', window.scrollY > 400);
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =========================================
   Form validation
========================================= */
const form = document.getElementById('registerForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  const fields = form.querySelectorAll('input[required], select[required]');
  fields.forEach(f => {
    const val = f.value.trim();
    let valid = !!val;
    if (f.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (f.type === 'tel') valid = /^\d{7,15}$/.test(val);
    if (f.type === 'checkbox') valid = f.checked;
    f.classList.toggle('error', !valid);
    if (!valid) ok = false;
  });
  if (ok) {
    form.innerHTML = '<div style="text-align:center;padding:40px 10px"><i class="fa-solid fa-circle-check" style="font-size:48px;color:#16a34a"></i><h3 style="margin-top:12px">Registered!</h3><p class="muted">See you on 9th July at 7:30 PM.</p></div>';
  }
});
