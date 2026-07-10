(() => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-site-nav]');
    const closeNav = () => {
        if (!toggle || !nav) return;
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
    };

    toggle?.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        nav?.classList.toggle('is-open', !open);
    });
    nav?.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeNav();
    });

    const filterButtons = [...document.querySelectorAll('[data-tool-filter]')];
    const toolCards = [...document.querySelectorAll('[data-tool-category]')];
    const filterStatus = document.getElementById('toolFilterStatus');
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.toolFilter || 'all';
            filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
            let visible = 0;
            toolCards.forEach((card) => {
                const show = filter === 'all' || card.dataset.toolCategory === filter;
                card.hidden = !show;
                if (show) visible += 1;
            });
            if (filterStatus) filterStatus.textContent = `${visible}개 도구가 표시됩니다.`;
        });
    });

    const revealTargets = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: .12 });
        revealTargets.forEach((target) => observer.observe(target));
    } else {
        revealTargets.forEach((target) => target.classList.add('is-visible'));
    }

    const stage = document.querySelector('[data-depth-stage]');
    if (stage && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stage.addEventListener('pointermove', (event) => {
            const rect = stage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;
            stage.style.setProperty('--ry', `${x * 7}deg`);
            stage.style.setProperty('--rx', `${y * -6}deg`);
        });
        stage.addEventListener('pointerleave', () => {
            stage.style.setProperty('--ry', '0deg');
            stage.style.setProperty('--rx', '0deg');
        });
    }

    const year = document.querySelector('[data-current-year]');
    if (year) year.textContent = String(new Date().getFullYear());
})();
