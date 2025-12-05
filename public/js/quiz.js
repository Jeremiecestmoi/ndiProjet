export function initQuiz(showToast) {
    const form = document.querySelector('form[data-quiz]');
    if (!form) return;

    const total = parseInt(form.dataset.total, 10) || 0;
    const bar = document.querySelector('.progress-quiz .progress-bar');
    const submit = form.querySelector('button[type="submit"]');

    const updateProgress = () => {
        const answered = new Set();
        form.querySelectorAll('input[type="radio"]:checked').forEach(inp => answered.add(inp.name));
        const ratio = total ? Math.round((answered.size / total) * 100) : 0;
        if (bar) {
            bar.style.width = ratio + '%';
            bar.setAttribute('aria-valuenow', ratio.toString());
            bar.textContent = ratio + '%';
        }
        submit.disabled = answered.size !== total;
    };

    form.addEventListener('change', updateProgress);
    updateProgress();

    // Persist last attempt date
    form.addEventListener('submit', () => {
        localStorage.setItem('nird_quiz_last', new Date().toISOString());
        showToast?.('Réponses envoyées. Bonne chance !', 'success');
    });
}
