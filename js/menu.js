document.addEventListener('DOMContentLoaded', () => {

    function closeAllSubmenus() {
        document.querySelectorAll('.submenu').forEach(sub => {
            sub.classList.remove('is-active-desktop');
        });
        document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
            arrow.classList.remove('is-open');
        });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.menu');
    const menuIcon = document.getElementById('menu-icon');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
            if(navMenu.classList.contains('is-active')) {
                menuIcon.setAttribute('name', 'close-outline');
            } else {
                menuIcon.setAttribute('name', 'menu-outline');
                closeAllSubmenus();
            }
        });
    }

    document.querySelectorAll('.dropdown-toogle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = toggle.getAttribute('data-target');
            const targetSubmenu = document.getElementById(targetId);
            const targetArrow = toggle.querySelector('.dropdown-arrow');

            const isOpen = targetSubmenu.classList.contains('is-active-desktop');

            closeAllSubmenus();

            if (!isOpen) {
                targetSubmenu.classList.add('is-active-desktop');
                if (targetArrow) targetArrow.classList.add('is-open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if(!e.target.closest('.menu-item-dropdown') && !e.target.closest('.menu-toggle')) {
            closeAllSubmenus();
        }
    });
});
