export function initResources(showToast) {
    const wrap = document.querySelector('[data-resources]');
    if (!wrap) return;

    const items = Array.from(wrap.querySelectorAll('[data-cat]'));
    const radios = Array.from(document.querySelectorAll('[name="cat"]'));

    const render = () => {
        const active = radios.find(r => r.checked)?.value || 'all';
        let count = 0;
        items.forEach(it => {
            const ok = (active === 'all') || (it.dataset.cat === active);
            it.classList.toggle('d-none', !ok);
            if (ok) count++;
        });
    };

    radios.forEach(r => r.addEventListener('change', () => { render(); showToast?.('Filtre appliqué', 'success'); }));
    render();

    // Copier le lien rapidement
    wrap.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-copy]');
        if (!btn) return;
        const url = btn.dataset.copy;
        try {
            await navigator.clipboard.writeText(url);
            showToast?.('Lien copié dans le presse-papiers', 'success');
        } catch {
            showToast?.('Impossible de copier', 'danger');
        }
    });
}
