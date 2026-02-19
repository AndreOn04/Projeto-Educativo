document.addEventListener('DOMContentLoaded', function() {
  const btn = document.querySelectorAll('.btn-ler-mais-text');

  btn.forEach(botao => {
    botao.addEventListener('click', function(e) {
      e.preventDefault();

      const containerMito = this.closest('.content-body-violence');

      const textoParaExpandir = containerMito.querySelector('.content-off-start');

      if(textoParaExpandir) {
        textoParaExpandir.classList.toggle('expandido');

        if(textoParaExpandir.classList.contains('expandido')){
          this.textContent = "Ler menos";
        } else {
          this.textContent = "Ler mais";
        }
      } else {
        console.error("Erro: Não encontrei a div .content-off-start dentro deste bloco. ");
      }
    });
  });
})

document.addEventListener("DOMContentLoaded", () => {
  // Garante que o código seja executado após o carregamento do DOM

  function closeAllSubmenus() {
    // Função para fechar todos os submenus
    document.querySelectorAll(".submenu").forEach((sub) => {
      // Seleciona todos os submenus
      sub.classList.remove("is-active-desktop"); // Fecha todos os submenus
    });
    document.querySelectorAll(".dropdown-arrow").forEach((arrow) => {
      arrow.classList.remove("is-open"); // Remove a classe de rotação do ícone
    });
  }

  const menuToggle = document.querySelector(".menu-toggle"); // Botão de menu para mobile
  const navMenu = document.querySelector(".menu"); // Menu de navegação
  const menuIcon = document.getElementById("menu-icon"); // Ícone do menu

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("is-active"); // Alterna a classe para mostrar/ocultar o menu
      if (navMenu.classList.contains("is-active")) {
        menuIcon.setAttribute("name", "close-outline"); // Altera o ícone para "close" quando o menu estiver aberto
      } else {
        menuIcon.setAttribute("name", "menu-outline"); // Altera o ícone para "menu" quando o menu estiver fechado
        closeAllSubmenus(); // Fecha todos os submenus quando o menu principal for fechado
      }
    });
  }

  document.querySelectorAll(".dropdown-toogle").forEach((toggle) => {
    // Seleciona todos os elementos com a classe .dropdown-toogle
    toggle.addEventListener("click", (e) => {
      // Adiciona um evento de clique a cada toggle
      e.preventDefault(); // Previne o comportamento padrão do link

      const targetId = toggle.getAttribute("data-target"); // Obtém o ID do submenu a partir do atributo data-target
      const targetSubmenu = document.getElementById(targetId); // Seleciona o submenu correspondente
      const targetArrow = toggle.querySelector(".dropdown-arrow"); // Seleciona o ícone de seta dentro do toggle

      const isOpen = targetSubmenu.classList.contains("is-active-desktop"); // Verifica se o submenu já está aberto

      closeAllSubmenus(); // Fecha todos os submenus antes de abrir o novo

      if (!isOpen) {
        targetSubmenu.classList.add("is-active-desktop"); // Abre o submenu clicado
        if (targetArrow) targetArrow.classList.add("is-open"); // Adiciona a classe para rotacionar o ícone de seta
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".menu-item-dropdown") &&
      !e.target.closest(".menu-toggle")
    ) {
      closeAllSubmenus(); // Fecha todos os submenus se o clique for fora do menu dropdown e do botão de menu
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Garante que o código seja executado após o carregamento do DOM

  window.onscroll = function () {
    updateProgressBar(); // Chama a função para atualizar a barra de progresso ao rolar a página
  };

  function updateProgressBar() {
    // Função para atualizar a barra de progresso

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop; // Quantidade de rolagem

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight; // Altura total do documento menos a altura da janela

    const scrolled = (winScroll / height) * 100; // Porcentagem rolada

    document.getElementById("myBar").style.width = scrolled + "%"; // Atualiza a largura da barra de progresso
  }
});

const scrollBtn = document.getElementById("scroll-to-top-bottom");

window.addEventListener("scroll", () => {
  const isAtBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

  if (isAtBottom) {
    scrollBtn.classList.add("is-at-bottom");
  } else {
    scrollBtn.classList.remove("is-at-bottom");
  }
});

scrollBtn.addEventListener("click", () => {
  const isAtBottom = scrollBtn.classList.contains("is-at-bottom");

  window.scrollTo({
    top: isAtBottom ? 0 : document.body.scrollHeight,
    behavior: "smooth", // Roda suavemente
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const timelineButtons = document.querySelectorAll(".timeline-toggle");
  if (!timelineButtons.length) return;

  timelineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      if (!content || !content.classList.contains("timeline-extra")) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      button.textContent = isExpanded ? "Ver detalhes" : "Ocultar detalhes";
      content.hidden = isExpanded;
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const verificarElemento = setInterval(() => {
    const violenciaScrollCue = document.querySelector(".violencia-scroll-cue");

    if (violenciaScrollCue) {
      violenciaScrollCue.addEventListener("click", function () {
        const citacoesSection = document.querySelector(".violencia-citacoes");
        const topoSection = document.querySelector(".violencia-top");

        const scrollAtual = window.pageYOffset || document.documentElement.scrollTop;
        const posicaoCitacoes = citacoesSection.offsetTop - 50;

        if (scrollAtual < posicaoCitacoes) {
          window.scrollTo({
            top: posicaoCitacoes,
            behavior: "smooth",
          });
        } else {
          window.scrollTo({
            top: topoSection.offsetTop,
            behavior: "smooth",
          });
        }
      });
      // Para a verificação após encontrar o elemento
      clearInterval(verificarElemento);
    }
  }, 100); // Verifica a cada 100ms
});