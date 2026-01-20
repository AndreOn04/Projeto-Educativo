document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.menu');
    const menuIcon = document.getElementById('menu-icon');

    menuToggle.addEventListener('click', () => {
        // Abre ou fecha o menu
        navMenu.classList.toggle('is-active');
        
        // Verifica se o menu está aberto para trocar o ícone
        if (navMenu.classList.contains('is-active')) {
            menuIcon.setAttribute('name', 'close-outline'); // Troca para o X
        } else {
            menuIcon.setAttribute('name', 'menu-outline');  // Volta para o icon menu
        }
    });
});
