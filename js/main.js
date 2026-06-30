let DATA = {};

async function loadContent() {
  try {
    const res = await fetch('./content.json?v=' + Date.now());
    DATA = await res.json();
  } catch(e) {
    console.warn('content.json no encontrado, usando datos de fallback');
    DATA = FALLBACK;
  }
  renderAll();
}

function renderAll() {
  renderMeta();
  renderHero();
  renderAbout();
  renderServices();
  renderTestimonials();
  renderContact();
  renderFooter();
  initScrollReveal();
  initNavHighlight();
  initCarousel();
  initNavShrink();
  initParallaxOrbs();
}

/* ── META ── */
function renderMeta() {
  const m = DATA.meta || {};
  document.title = (m.siteName || 'Electrilindas') + ' – ' + (m.tagline || 'Mujeres en oficios');
}

/* ── HERO ── */
function renderHero() {
  const h = DATA.hero || {};
  const c = DATA.contact || {};
  const wa = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hola! Me gustaría solicitar un presupuesto 💜')}`;

  setText('#hero-badge', h.badge);
  setHTML('#hero-title', `${h.titleLine1 || ''}<br><strong>${h.titleLine2 || ''}</strong>`);
  setText('#hero-sub',   h.subtitle);
  setText('#hero-cta-1', h.ctaPrimary   || 'Pedí tu turno');
  setText('#hero-cta-2', h.ctaSecondary || 'Ver servicios ↓');

  const cta1 = document.getElementById('hero-cta-1');
  if (cta1) cta1.href = wa;
}

/* ── ABOUT ── */
function renderAbout() {
  const a = DATA.about || {};
  const h = DATA.hero  || {};

  setText('#about-title', a.title);
  setText('#about-text',  a.text);

  // Values row
  const row = document.getElementById('values-row');
  if (row && a.values) {
    row.innerHTML = (a.values || []).map(v => `
      <div class="value-item reveal">
        <span class="vi-icon">${v.icon}</span>
        <div class="vi-title">${v.title}</div>
        <div class="vi-text">${v.text}</div>
      </div>
    `).join('');
  }

  // Manifesto stats
  const statsEl = document.getElementById('am-stats');
  if (statsEl && h.stats) {
    statsEl.innerHTML = (h.stats || []).map(s => `
      <div class="am-stat">
        <span class="am-stat-num">${s.num}</span>
        <span class="am-stat-label">${s.label}</span>
      </div>
    `).join('');
  }
}

/* ── SERVICES CAROUSEL ── */
const BG_CLASSES = ['sc-bg-a','sc-bg-b','sc-bg-c','sc-bg-d'];

function renderServices() {
  const track = document.getElementById('carousel-track');
  if (!track || !DATA.services) return;
  const c = DATA.contact || {};
  const wa = c.whatsapp || '';

  track.innerHTML = (DATA.services || []).map((s, i) => `
    <div class="svc-card ${BG_CLASSES[i % BG_CLASSES.length]}">
      <div class="sc-top">
        <span class="sc-icon">${s.icon}</span>
        <span class="sc-badge">${s.tag || 'Servicio'}</span>
      </div>
      <div class="sc-body">
        <div class="sc-label">Servicio</div>
        <div class="sc-name">${s.name}</div>
        <div class="sc-desc">${s.desc}</div>
      </div>
      <div class="sc-footer">
        <a href="#contact-section" class="sc-btn sc-btn-outline">saber +</a>
        <a href="https://wa.me/${wa}?text=${encodeURIComponent('Hola! Me interesa el servicio de ' + s.name + ' 💜')}" target="_blank" class="sc-btn sc-btn-fill">consultar</a>
      </div>
    </div>
  `).join('');
}

/* ── TESTIMONIALS ── */
function renderTestimonials() {
  const grid = document.getElementById('test-grid');
  if (!grid || !DATA.testimonials) return;
  const emojis = ['👩‍🔧','👩','👩‍🦱'];

  grid.innerHTML = (DATA.testimonials || []).map((t, i) => `
    <div class="test-card reveal">
      <div class="tc-stars">★★★★★</div>
      <p class="tc-text">"${t.text}"</p>
      <div class="tc-author">
        <div class="tc-avatar">${emojis[i % emojis.length]}</div>
        <div>
          <div class="tc-name">${t.author}</div>
          <div class="tc-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── CONTACT ── */
function renderContact() {
  const c = DATA.contact || {};
  const wa = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hola! Me gustaría solicitar un presupuesto 💜')}`;
  const ig = `https://instagram.com/${c.instagram}`;

  const ctaWa = document.getElementById('cta-wa');
  if (ctaWa) ctaWa.href = wa;
  const ctaIg = document.getElementById('cta-ig');
  if (ctaIg) ctaIg.href = ig;
  setText('#cta-ig-handle', '@' + (c.instagram || 'electrilindas'));
  setText('#cta-address',   c.address || 'Buenos Aires, Argentina');

  const fIg = document.getElementById('footer-ig');
  if (fIg) fIg.href = ig;
  const fWa = document.getElementById('footer-wa');
  if (fWa) fWa.href = wa;
}

/* ── FOOTER ── */
function renderFooter() {
  const m = DATA.meta    || {};
  const c = DATA.contact || {};
  setText('#footer-copy', m.footerText || `© 2025 ${m.siteName || 'Electrilindas'}`);
}

/* ── WHATSAPP FORM ── */
window.sendWhatsApp = function() {
  const c = DATA.contact || {};
  const name    = document.getElementById('f-name')?.value?.trim()    || '';
  const phone   = document.getElementById('f-phone')?.value?.trim()   || '';
  const service = document.getElementById('f-service')?.value         || '';
  const msg     = document.getElementById('f-msg')?.value?.trim()     || '';

  if (!name) { alert('Por favor ingresá tu nombre.'); return; }

  const text = `¡Hola Electrilindas! 💜\n\nNombre: ${name}\nTeléfono: ${phone || 'No indicado'}\nServicio: ${service || 'No especificado'}\nMensaje: ${msg || 'Sin mensaje adicional.'}`;
  window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
};

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observe = (selector) => {
    document.querySelectorAll(selector).forEach(el => io.observe(el));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // also re-observe after render (values, cards etc are added dynamically)
  setTimeout(() => {
    observe('.reveal');
    observe('.reveal-left');
  }, 100);
}

/* ── CAROUSEL ── */
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prev  = document.getElementById('c-prev');
  const next  = document.getElementById('c-next');
  if (!track || !prev || !next) return;

  const SCROLL = 320;
  next.addEventListener('click', () => { track.scrollLeft += SCROLL; });
  prev.addEventListener('click', () => { track.scrollLeft -= SCROLL; });
}

/* ── NAV ACTIVE HIGHLIGHT ── */
function initNavHighlight() {
  const links = document.querySelectorAll('.nav-links a[data-section]');
  const sections = ['about','services','testimonials'];

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[data-section="${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

/* ── NAVBAR SHRINK ── */
function initNavShrink() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.14)';
    } else {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    }
  }, { passive: true });
}

/* ── PARALLAX ORBS ── */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero-orb');
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((o, i) => {
      const d = (i + 1) * 18;
      o.style.transform = `translate(${dx * d}px, ${dy * d}px)`;
    });
  }, { passive: true });
}

/* ── HELPERS ── */
function setText(sel, val) {
  const el = document.querySelector(sel);
  if (el && val !== undefined) el.textContent = val;
}
function setHTML(sel, val) {
  const el = document.querySelector(sel);
  if (el && val !== undefined) el.innerHTML = val;
}

/* ── FALLBACK DATA (si no carga content.json) ── */
const FALLBACK = {
  hero: {
    badge: 'Mujeres en oficios · Buenos Aires',
    titleLine1: 'Hacemos el trabajo,',
    titleLine2: 'y lo hacemos bien.',
    subtitle: 'Electricistas, gasistas, plomeras, albañilas y más. Mujeres matriculadas al servicio de tu hogar.',
    ctaPrimary: 'Pedí tu turno',
    ctaSecondary: 'Ver servicios ↓',
    stats: [
      { num: '+50',  label: 'Profesionales' },
      { num: '10+',  label: 'Oficios' },
      { num: '+300', label: 'Trabajos' },
      { num: '100%', label: 'Matriculadas' }
    ]
  },
  about: {
    title: 'Quiénes somos.',
    text: 'Electrilindas nació para darle espacio a mujeres que quieren trabajar en oficios y muchas veces se encuentran con puertas cerradas.',
    values: [
      { icon:'🤝', title:'Compañerismo', text:'Nos apoyamos entre nosotras.' },
      { icon:'🛡️', title:'Seguridad',    text:'Trabajo certificado y matriculado.' },
      { icon:'💜', title:'Confianza',    text:'Transparencia en cada presupuesto.' },
      { icon:'✅', title:'Responsabilidad', text:'Cumplimos tiempos y resultados.' }
    ]
  },
  services: [
    { icon:'⚡', name:'Electricistas', desc:'Instalaciones domiciliarias, tableros y más.', tag:'Matriculadas' },
    { icon:'🔥', name:'Gasistas',      desc:'Cañerías, artefactos y conexiones de gas.',  tag:'Habilitadas' },
    { icon:'🔧', name:'Plomeras',      desc:'Destapes, sanitarias y reparación de pérdidas.', tag:'Domiciliario' },
    { icon:'🏗️', name:'Arquitectas',  desc:'Dirección de obra, reformas y presupuestos.', tag:'Profesional' },
    { icon:'🎨', name:'Pintoras',      desc:'Interior y exterior con terminaciones de calidad.', tag:'Interior/Exterior' },
    { icon:'🧱', name:'Albañilas',     desc:'Revoques, cerámicos y albañilería general.', tag:'Reformas' },
    { icon:'🔑', name:'Cerrajeras',    desc:'Apertura de puertas, bombines y llaves.',   tag:'24 hs' },
    { icon:'🌿', name:'Jardineras',    desc:'Diseño y mantenimiento de jardines.',        tag:'Exterior' },
    { icon:'🪵', name:'Carpinteras',   desc:'Muebles a medida e instalación de pisos.',  tag:'A medida' },
    { icon:'🪟', name:'Herreras',      desc:'Rejas, portones y estructuras metálicas.',  tag:'A medida' }
  ],
  testimonials: [
    { text: 'Llamé a Electrilindas para el tablero y llegó una electricista en dos horas. Profesional, rápida y súper amable.', author: 'Mariana Ríos',    role: 'Clienta · CABA' },
    { text: 'Me hicieron toda la pintura del departamento. Quedó impecable y respetaron los tiempos al pie de la letra.',       author: 'Lucía Fernández', role: 'Clienta · Palermo' },
    { text: 'La gasista me explicó todo, me dio un presupuesto claro y solucionó el problema ese mismo día.',                   author: 'Claudia Méndez',  role: 'Clienta · Caballito' }
  ],
  contact: {
    whatsapp: '5491158708626',
    instagram: 'electrilindas',
    email: '',
    address: 'Buenos Aires, Argentina'
  },
  meta: {
    siteName: 'Electrilindas',
    tagline: 'Mujeres en oficios',
    footerText: '© 2025 Electrilindas · Mujeres en oficios · Buenos Aires'
  }
};

document.addEventListener('DOMContentLoaded', loadContent);
