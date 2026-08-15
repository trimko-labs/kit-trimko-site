/* ========================================
   Trimko - Remise en état de parc - JS principal
   Thème clair/sombre, accordéon FAQ, ombre du header au scroll
======================================== */

// ---- Thème clair / sombre ----

const THEME_KEY = 'prk-theme';

function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
}

function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // Clair par défaut : le site s'adresse à un décideur, pas à un public technique
    return 'light';
}

// Appliqué immédiatement avant le rendu pour éviter le flash
(function () {
    applyTheme(getInitialTheme());
})();

document.addEventListener('DOMContentLoaded', function () {

    // ---- Initialisation du thème ----
    applyTheme(getInitialTheme());

    const themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
        });
    }

    // ---- Header : ombre au scroll ----
    const header = document.getElementById('site-header');
    if (header) {
        const onScroll = function () {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ---- Accordéon FAQ ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', function () {
            const isOpen = item.classList.contains('is-open');

            // Fermer tous les autres
            faqItems.forEach(function (other) {
                if (other !== item) {
                    other.classList.remove('is-open');
                    const q = other.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                }
            });

            // Basculer l'état courant
            item.classList.toggle('is-open', !isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
        });
    });
});
