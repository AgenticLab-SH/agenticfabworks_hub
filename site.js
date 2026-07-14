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
    const toolSearchInput = document.getElementById('toolSearchInput');
    let activeFilter = 'featured';

    const applyToolView = () => {
        const query = String(toolSearchInput?.value || '').trim().toLocaleLowerCase('ko-KR');
        let visible = 0;
        toolCards.forEach((card) => {
            const matchesText = !query || String(card.textContent || '').toLocaleLowerCase('ko-KR').includes(query);
            const matchesFilter = query
                || activeFilter === 'all'
                || (activeFilter === 'featured' && card.dataset.featured === 'true')
                || card.dataset.toolCategory === activeFilter;
            const show = Boolean(matchesText && matchesFilter);
            card.hidden = !show;
            if (show) visible += 1;
        });
        if (!filterStatus) return;
        if (query) filterStatus.textContent = visible ? `검색 결과 ${visible}개 도구` : '일치하는 도구가 없습니다.';
        else if (activeFilter === 'featured') filterStatus.textContent = '자주 쓰는 7개 도구를 먼저 보여드립니다.';
        else filterStatus.textContent = `${visible}개 도구가 표시됩니다.`;
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.toolFilter || 'all';
            filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
            if (toolSearchInput) toolSearchInput.value = '';
            applyToolView();
        });
    });
    toolSearchInput?.addEventListener('input', applyToolView);
    applyToolView();

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
