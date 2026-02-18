document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.text-reveal-marker');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Para animar só uma vez, desconecta o observer desse elemento
                // observer.unobserve(entry.target);
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
});