/* ========================================
   PC-Refresh-Kit - JS principal
   Thème dark/light, accordéon FAQ, terminal animé, header scroll
======================================== */

// ---- Thème dark / light ----

const THEME_KEY = 'prk-theme';

function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
}

function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // Dark par défaut (outil technique, public tech)
    return 'dark';
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

    // ---- Terminal animé (hero) ----
    animateTerminal();

    // ---- Animations au scroll (IntersectionObserver) ----
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        animatedEls.forEach(function (el) {
            observer.observe(el);
        });
    }
});

// ---- Terminal simulé ----

function animateTerminal() {
    const body = document.getElementById('terminal-body');
    if (!body) return;

    // Séquence de lignes à afficher en boucle
    const lines = [
        { cls: 'terminal-line--prompt', text: '.\\Lancer.bat' },
        { cls: 'terminal-line--accent',  text: '  PC-Refresh-Kit v2.0 - demarrage...' },
        { cls: 'terminal-line--dim',     text: '' },
        { cls: 'terminal-line--info',    text: '  [00] Diagnostic systeme' },
        { cls: 'terminal-line--ok',      text: '       OK  CPU: AMD Ryzen 5, RAM: 16 Go, SSD: 512 Go' },
        { cls: 'terminal-line--info',    text: '  [01] Point de restauration...' },
        { cls: 'terminal-line--ok',      text: '       OK  Cree le 2026-07-18 10:32' },
        { cls: 'terminal-line--info',    text: '  [02] Antivirus - bascule Defender' },
        { cls: 'terminal-line--ok',      text: '       OK  Windows Defender actif, scan rapide...' },
        { cls: 'terminal-line--info',    text: '  [03] Debloat - suppression bloatware' },
        { cls: 'terminal-line--ok',      text: '       OK  14 apps supprimees, jeux proteges' },
        { cls: 'terminal-line--info',    text: '  [04] Privacy - telemetrie reduite' },
        { cls: 'terminal-line--ok',      text: '       OK  Copilot OFF, Recall OFF, Widgets OFF' },
        { cls: 'terminal-line--info',    text: '  [07] Nettoyage - DISM, SFC, temp...' },
        { cls: 'terminal-line--ok',      text: '       OK  +8,4 Go recuperes sur C:' },
        { cls: 'terminal-line--dim',     text: '' },
        { cls: 'terminal-line--accent',  text: '  Bilan : 5 modules OK - 0 erreur' },
        { cls: 'terminal-line--dim',     text: '  Rapport : runtime/RAPPORT-PC-20260718.html' },
        { cls: 'terminal-line--dim',     text: '' },
    ];

    let currentLineIdx = 0;
    let loopDelay = 2800; // pause entre chaque boucle

    function showNextLine() {
        if (currentLineIdx >= lines.length) {
            // Fin de séquence : pause puis reset
            setTimeout(function () {
                body.innerHTML = '';
                currentLineIdx = 0;
                setTimeout(showNextLine, 200);
            }, loopDelay);
            return;
        }

        const def = lines[currentLineIdx];
        const span = document.createElement('span');
        span.className = 'terminal-line ' + def.cls;

        // Utiliser textContent uniquement (évite tout risque XSS)
        span.textContent = def.text === '' ? ' ' : def.text;

        // Délai d'apparition selon le type de ligne
        const delay = currentLineIdx * 120 + (def.cls.includes('ok') ? 60 : 0);
        span.style.animationDelay = delay + 'ms';

        body.appendChild(span);
        currentLineIdx++;

        // Délai avant la ligne suivante
        const nextDelay = def.text === '' ? 60 : 130;
        setTimeout(showNextLine, nextDelay);
    }

    showNextLine();
}
