class LeitorInteligente{ 

    constructor() { // Inicializa as variáveis e elementos necessários

        this.synth = window.speechSynthesis; // Interface de síntese de fala do navegador
        this.btn = document.getElementById('btn-audio-main'); // Botão para controlar a leitura
        this.progressBar = document.getElementById('audio-progress'); // Barra de progresso para mostrar o andamento da leitura
        this.textBtn = document.querySelector('.audio-text'); // Elemento para mostrar o texto do botão (ex: "Ouvir Página" ou "Parar Leitura")
        this.iconPlay = document.querySelector('.icon-play'); // Ícone de play
        this.iconStop = document.querySelector('.icon-stop'); // Ícone de stop
        this.isReading = false; // Variável para controlar o estado da leitura (se está lendo ou não)
        this.utterance = null; // Variável para armazenar a instância de SpeechSynthesisUtterance, que representa o texto a ser falado

        this.init(); // Chama o método de inicialização para configurar os eventos
    }

   init() { 
    // Evento de clique para alternar leitura
    this.btn.addEventListener('click', (e) => { 
        // No mobile, se o widget estiver fechado, abrimos ele primeiro
        const widget = document.querySelector('.audio-widget');
        if (window.innerWidth <= 768 && !widget.classList.contains('is-open')) {
            widget.classList.add('is-open');
            // Opcional: Impedir a leitura no primeiro toque, apenas abrir
            // return; 
        }
        this.toggleLeitura(); 
    });

    // Fecha o widget se clicar fora dele (opcional, melhora a UX)
    document.addEventListener('click', (e) => {
        const widget = document.querySelector('.audio-widget');
        if (!widget.contains(e.target)) {
            widget.classList.remove('is-open');
        }
    });

    window.addEventListener('beforeunload', () => { this.synth.cancel(); });
}

    obterTextoSite() {
    // Busca apenas elementos que tenham o atributo data-read
    const blocosParaLer = document.querySelectorAll('[data-read]');
    let textoFinal = '';

    if (blocosParaLer.length === 0) {
        console.warn("Nenhum elemento com 'data-read' foi encontrado.");
        // Opcional: Fallback para o main caso esqueça de marcar
        const main = document.querySelector('main');
        return main ? main.innerText : "";
    }

    blocosParaLer.forEach(bloco => {
        // Clonamos para limpar possíveis lixos internos (como botões de "saiba mais")
        const clone = bloco.cloneNode(true);
        const ignorar = clone.querySelectorAll('button, a, .no-read');
        ignorar.forEach(el => el.remove());

        // trim() remove espaços em branco inúteis nas pontas
        // Adicionamos um ponto e espaço para o sintetizador dar uma pausa natural entre blocos
        textoFinal += clone.innerText.trim() + ". ";
    });

    return textoFinal.replace(/\s+/g, ' ').trim();
}

    toggleLeitura() {
        if (this.synth.speaking) {
            if (this.synth.paused) {
                this.retomar();
            } else {
                this.pausar();
            }
        } else {
            this.iniciar();
        }
    }

    corrigirBugMotores() {

        if(this.synth.paused && !this.isReading) {
            this.synth.resume();
            this.synth.pause();
            this.timeoutBug = setTimeout(()  => this.corrigirBugMotores(), 10000);
        }

    }

    pausar() {
        this.synth.pause();
        this.isReading = false;
        this.iconPlay.style.display = 'block';
        this.iconStop.style.display = 'none';
        this.textBtn.innerText = "Retomar Leitura.";

        this.corrigirBugMotores();
    }

    retomar() {
        clearTimeout(this.timeoutBug);
        this.synth.resume();
        this.isReading = true;
        this.iconPlay.style.display = 'none';
        this.iconStop.style.display = 'block';
        this.textBtn.innerText = "Pausar";
    }

    parar() {
        this.synth.cancel();
        this.isReading = false;
        this.iconPlay.style.display = 'block';
        this.iconStop.style.display = 'none';
        this.textBtn.innerText = 'Ouvir Página';
        this.progressBar.style.width = '0%';
}

   iniciar() {
    const texto = this.obterTextoSite();
    if (!texto) return;

    this.synth.cancel(); 

    this.utterance = new SpeechSynthesisUtterance(texto);
    this.utterance.lang = 'pt-BR';
    this.utterance.rate = 1.0;

    this.utterance.onstart = () => {
        this.isReading = true;
        this.iconPlay.style.display = 'none';
        this.iconStop.style.display = 'block';
        this.textBtn.innerText = "Pausar";
        this.animarProgresso();
    };

    // Quando o texto acabar naturalmente:
    this.utterance.onend = () => {
        this.parar(); 
    };

    this.synth.speak(this.utterance);
}

    animarProgresso(totalChars) {

        if(!this.isReading) return; 

        let progresso = 0;
        const intervalo = setInterval(() => {
            if(!this.isReading) {
                clearInterval(intervalo);
                return;
            }
            if (progresso < 100) {
                progresso += 0.5;
                this.progressBar.style.width = `${progresso}%`;
            }
        }, 100);

    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LeitorInteligente();
});