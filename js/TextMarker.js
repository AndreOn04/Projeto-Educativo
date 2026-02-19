document.addEventListener("DOMContentLoaded", () => {
    
    const elements = document.querySelectorAll('.text-reveal-marker');
    const buttons = document.querySelectorAll('.btn-ler-mais-text');

    const mediaQuery = window.matchMedia("(max-width: 768px)");

    let observer;

    // ===============================
    // 🔹 DESKTOP → animação por scroll
    // ===============================

    function initDesktopObserver() {
        observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Para animar só uma vez, desconecta o observer desse elemento
                // observer.unobserve(entry.target);
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.1
    });
       elements.forEach(el => observer.observe(el));    
    }

    function destroyObserver() {
        if(observer) {
            observer.disconnect();
        }
    }

    // Main Controll
    function handleScreenChange(e) {
        if(e.matches) {
            // Mobile
            destroyObserver();
            elements.forEach(el => el.classList.remove('is-visible'));
        } else {
            // Desktop
            initDesktopObserver();
        }
    }

    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener('change', handleScreenChange);

     // ===============================
    // 🔹 MOBILE → animação ao clicar
    // ===============================

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.previousElementSibling;
            const markers = content.querySelectorAll('.text-reveal-marker');

            content.classList.toggle('active');

            if(content.classList.contains('active')) {
                this.textContent = 'Ler menos';

                setTimeout(() => {
                    markers.forEach(m => m.classList.add('is-visible'));
                }, 300);
            } else {
                this.textContent = 'Ler menos';
                markers.forEach(m => m.classList.remove('is-visible'));
            }

        })
    })

});