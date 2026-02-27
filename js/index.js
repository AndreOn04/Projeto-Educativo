document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelectorAll(".btn-ler-mais-text");

  btn.forEach((botao) => {
    botao.addEventListener("click", function (e) {
      e.preventDefault();

      const containerMito = this.closest(".content-body-violence");

      const textoParaExpandir =
        containerMito.querySelector(".content-off-start");

      if (textoParaExpandir) {
        textoParaExpandir.classList.toggle("expandido");

        if (textoParaExpandir.classList.contains("expandido")) {
          this.textContent = "Ler menos";
        } else {
          this.textContent = "Ler mais";
        }
      } else {
        console.error(
          "Erro: Não encontrei a div .content-off-start dentro deste bloco. ",
        );
      }
    });
  });
});

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

    const bar = document.getElementById("myBar");
    if (bar) {
      bar.style.width = scrolled + "%";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById("scroll-to-top-bottom");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    scrollBtn.classList.toggle("is-at-bottom", isAtBottom);
  });

  scrollBtn.addEventListener("click", () => {
    const isAtBottom = scrollBtn.classList.contains("is-at-bottom");

    window.scrollTo({
      top: isAtBottom ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
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

const shareBtn = document.getElementById("btn-share-cycle");

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const shareData = {
      title: "Ciclo da Violência - Projeto Basta!",
      text: "Ajude outras mulheres a reconhecer e romper as fases do ciclo da violência",
      url: window.location.href,
    };

    try {
      if(navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Link Copiado! 👏');
        navigator.clipboard.writeText(shareData.url);
      }
    } catch (err) {
      console.log('Erro ao compartilhar: 😪', err);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-leitura");
    const btnReturn = document.getElementById("btn-return");
    const btnIgnore = document.getElementById("btn-ignore");
    
    // Nome da chave no LocalStorage
    const STORAGE_KEY = "posicao_leitura_usuario";

    // 1. VERIFICAÇÃO INICIAL
    const savedPosition = localStorage.getItem(STORAGE_KEY);

    // Só mostra o modal se:
    // - Existir uma posição salva
    // - A posição for maior que 300px (evita mostrar o modal se ele leu só o topo)
    if (savedPosition && parseInt(savedPosition) > 300) {
        modal.classList.add("active");
    }

    // 2. AÇÃO: SIM, CONTINUAR
    btnReturn.addEventListener("click", () => {
        window.scrollTo({
            top: parseInt(savedPosition),
            behavior: "smooth"
        });
        fecharModal();
    });

    // 3. AÇÃO: NÃO, RECOMEÇAR
    btnIgnore.addEventListener("click", () => {
      modal.classList.remove('active');

      localStorage.removeItem(STORAGE_KEY);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    function fecharModal() {
        modal.classList.remove("active");
    }

    let isScrolling;
    window.addEventListener("scroll", () => {
        window.clearTimeout(isScrolling);

        isScrolling = setTimeout(() => {
            if (!modal.classList.contains("active")) {
                localStorage.setItem(STORAGE_KEY, window.scrollY);
            }
        }, 100);
    });
});