export function initChallenges(showToast) {
    const list = document.querySelector('[data-challenges]');
    const search = document.querySelector('#challengeSearch');
    const sort = document.querySelector('#challengeSort');
    const pointsMin = document.querySelector('#pointsMin');
    const pointsMinValue = document.querySelector('#pointsMinValue');
    const radios = Array.from(document.querySelectorAll('[name="cat"]'));
    const resultCount = document.querySelector('#resultCount');
    const noResults = document.querySelector('#noResults');

    if (!list) return;

    const items = Array.from(list.querySelectorAll('[data-item]'));

    // Helpers
    const getActiveCategory = () => (radios.find(r => r.checked)?.value || 'all');
    const getMinPoints = () => parseInt(pointsMin?.value || '0', 10);

    const apply = () => {
        const q = (search?.value || '').toLowerCase().trim();
        const mode = sort?.value || 'points-desc';
        const minP = getMinPoints();
        const cat = getActiveCategory();

        // Filtrage
        let filtered = items.filter(it => {
            const title = (it.dataset.title || '').toLowerCase();
            const desc  = (it.dataset.desc || '').toLowerCase();
            const points = parseInt(it.dataset.points || '0', 10);
            const itemCat = it.dataset.cat || 'Général';

            const matchText = !q || (title.includes(q) || desc.includes(q));
            const matchPoints = points >= minP;
            const matchCat = (cat === 'all') || (itemCat === cat);

            return matchText && matchPoints && matchCat;
        });

        // Tri
        filtered.sort((a, b) => {
            const pa = parseInt(a.dataset.points || '0', 10);
            const pb = parseInt(b.dataset.points || '0', 10);
            if (mode === 'points-desc') return pb - pa;
            if (mode === 'points-asc') return pa - pb;
            return (a.dataset.title || '').localeCompare(b.dataset.title || '');
        });

        // Rendu
        items.forEach(it => it.classList.add('d-none'));
        filtered.forEach(it => it.classList.remove('d-none'));

        // Compteur & message "aucun résultat"
        if (resultCount) resultCount.textContent = String(filtered.length);
        if (noResults) noResults.classList.toggle('d-none', filtered.length !== 0);

        // Toast (facultatif, pour feedback)
        // showToast?.(`${filtered.length} défi(s)`, 'primary');
    };

    // UI init
    if (pointsMin && pointsMinValue) {
        pointsMinValue.textContent = pointsMin.value;
        pointsMin.addEventListener('input', () => {
            pointsMinValue.textContent = pointsMin.value;
            apply();
        });
    }

    search?.addEventListener('input', apply);
    sort?.addEventListener('change', apply);
    radios.forEach(r => r.addEventListener('change', apply));

    // Actions “Démarrer / Sauver” (exemples)
    list.addEventListener('click', e => {
        const btn = e.target.closest('[data-challenge-action]');
        if (!btn) return;

        const card = btn.closest('[data-item]');
        const title = card?.dataset.title || 'Défi';

        if (btn.dataset.challengeAction === 'start') {
            // Ici, tu peux rediriger vers une page de détail (si tu en crées une) ou
            // marquer comme “en cours” côté localStorage
            showToast?.(`« ${title} » démarré !`, 'success');
            const started = JSON.parse(localStorage.getItem('nird_started') || '[]');
            if (!started.includes(title)) started.push(title);
            localStorage.setItem('nird_started', JSON.stringify(started));
        }

        if (btn.dataset.challengeAction === 'save') {
            const saved = JSON.parse(localStorage.getItem('nird_saved') || '[]');
            if (!saved.includes(title)) {
                saved.push(title);
                localStorage.setItem('nird_saved', JSON.stringify(saved));
                showToast?.(`« ${title} » sauvegardé !`, 'primary');
            } else {
                showToast?.(`« ${title} » est déjà dans vos favoris.`, 'warning');
            }
        }
    });

    // Première application
    apply();
}
