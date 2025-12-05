/* =========================================================================
   app.js – Script principal (module ES)
   - Thème clair/sombre (persisté)
   - Animations "reveal" (IntersectionObserver + fallback)
   - Lien actif dans la navbar
   - Tooltips & toasts Bootstrap
   - Défilement fluide vers les ancres
   - Dispatcher JS par page (imports dynamiques robustes)
   ========================================================================= */

/* ==========
   Utilitaires DOM
========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ==========
   Thème (light/dark) avec persistance
========== */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const btn = $('#themeToggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

function toggleTheme() {
    const current = localStorage.getItem('theme')
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(current === 'light' ? 'dark' : 'light');
}

/* ==========
   Reveal on scroll (apparition douce des éléments)
========== */
function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;

    // Fallback si IntersectionObserver indisponible
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('active'));
        return;
    }

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('active');
                io.unobserve(e.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    els.forEach(el => io.observe(el));
}

/* ==========
   Navbar : lien actif
========== */
function initActiveNav() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    $$('.navbar .nav-link').forEach(a => {
        const href = a.getAttribute('href') || '';
        const normalized = href.replace(/\/+$/, '') || '/';
        if (normalized === path) a.classList.add('active');
    });
}

/* ==========
   Bootstrap helpers (tooltips + toast programmatique)
========== */
function initTooltips() {
    if (!window.bootstrap) return;
    $$('.tt').forEach(el => new bootstrap.Tooltip(el));
}

function showToast(message, type = 'primary', delay = 2500) {
    // Conteneur toast (un par page)
    let container = $('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
    }

    // Élément toast
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="toast align-items-center text-bg-${type} border-0" role="status" aria-live="polite" aria-atomic="true" data-bs-delay="${delay}">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
      </div>
    </div>
  `;
    const toastEl = wrapper.firstElementChild;
    container.appendChild(toastEl);

    if (window.bootstrap) {
        const t = new bootstrap.Toast(toastEl);
        t.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
}

/* ==========
   Défilement fluide vers les ancres
========== */
function initSmoothAnchors() {
    $$('.smooth[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const id = a.getAttribute('href');
            const target = id ? document.querySelector(id) : null;
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ==========
   Import dynamique robuste (chemin relatif au présent fichier)
========== */
const importRel = relPath => import(new URL(relPath, import.meta.url));

/* ==========
   Boot
========== */
document.addEventListener('DOMContentLoaded', () => {
    // Thème initial (préférence stockée ou OS)
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

    // Toggle du thème
    $('#themeToggle')?.addEventListener('click', toggleTheme);

    // UI init
    initReveal();
    initActiveNav();
    initTooltips();
    initSmoothAnchors();

    // Dispatcher JS par page (voir block Twig data-page dans base.html.twig)
    const page = document.body.dataset.page;

    if (page === 'quiz') {
        importRel('./quiz.js').then(m => m.initQuiz?.(showToast)).catch(() => showToast('Erreur chargement quiz.js', 'danger'));
    }

    if (page === 'challenges') {
        importRel('./challenges.js').then(m => m.initChallenges?.(showToast)).catch(() => showToast('Erreur chargement challenges.js', 'danger'));
    }

    if (page === 'resources') {
        importRel('./resources.js').then(m => m.initResources?.(showToast)).catch(() => showToast('Erreur chargement resources.js', 'danger'));
    }

    // Message console utile en dev
    console.log('%cNIRD – app.js chargé', 'color:#1cc88a;font-weight:bold');
});
