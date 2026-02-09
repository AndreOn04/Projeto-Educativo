class LeitorInteligente {
    constructor() {
        // Inicializa variáveis e elementos
        this.synth = window.speechSynthesis;
        this.btn = document.getElementById('btn-audio-main');
        this.progressBar = document.getElementById('audio-progress');
        this.textBtn = document.querySelector('.audio-text');
        this.iconPlay = document.querySelector('.icon-play');
        this.iconStop = document.querySelector('.icon-stop');
        this.btnSpeed = document.querySelector('.speed-toggle');
        
        // Variáveis para funcionalidades
        this.velocidades = [1, 1.25, 1.5, 2]; // Velocidades disponíveis
        this.indiceVelocidade = 0; // Índice atual da velocidade
        this.velocidadeAtual = this.velocidades[this.indiceVelocidade]; // Velocidade atual
        this.posicaoTexto = 0; // Posição atual no texto (índice de caracteres)
        this.textComplet = ""; // Texto completo do site
        this.isReading = false; // Estado de leitura
        this.utterance = null; // Instância da utterance
        this.totalChars = 0; // Total de caracteres para cálculo de progresso
        
        this.init(); // Configura eventos
    }

    init() {
        // Verifica suporte à API
        if (!this.synth) {
            console.warn("Speech Synthesis não suportada neste navegador.");
            return;
        }

        // Evento para botão principal (toggle leitura)
        this.btn.addEventListener('click', (e) => {
            const widget = document.querySelector('.audio-widget');
            if (window.innerWidth <= 768 && !widget.classList.contains('is-open')) {
                widget.classList.add('is-open');
                return; // Apenas abre o widget no mobile
            }
            this.toggleLeitura();
        });

        // Evento para botão de velocidade
        this.btnSpeed.addEventListener('click', () => {
            this.toggleVelocidade();
        });

        // Fecha widget ao clicar fora (mobile)
        document.addEventListener('click', (e) => {
            const widget = document.querySelector('.audio-widget');
            if (!widget.contains(e.target)) {
                widget.classList.remove('is-open');
            }
        });

        // Cancela fala ao sair da página
        window.addEventListener('beforeunload', () => {
            this.synth.cancel();
        });
    }

    obterTextoSite() {
        // Coleta texto de elementos com [data-read]
        const blocosParaLer = document.querySelectorAll('[data-read]');
        let textoFinal = '';

        if (blocosParaLer.length === 0) {
            console.warn("Nenhum elemento com 'data-read' encontrado. Usando fallback para 'main'.");
            const main = document.querySelector('main');
            return main ? main.innerText.trim() : "";
        }

        blocosParaLer.forEach(bloco => {
            const clone = bloco.cloneNode(true);
            const ignorar = clone.querySelectorAll('button, a, .no-read');
            ignorar.forEach(el => el.remove());
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

    toggleVelocidade() {
        // Avança para próxima velocidade
        this.indiceVelocidade = (this.indiceVelocidade + 1) % this.velocidades.length;
        this.velocidadeAtual = this.velocidades[this.indiceVelocidade];
        
        // Aplica à utterance atual, se estiver falando
        if (this.utterance && this.isReading) {
            this.utterance.rate = this.velocidadeAtual;
        }
        
        // Atualiza texto do botão (ex.: "1.25x")
        this.btnSpeed.innerText = `${this.velocidadeAtual}x`;
    }

    iniciar() {
        // Obtém texto completo se ainda não tiver
        if (!this.textComplet) {
            this.textComplet = this.obterTextoSite();
            this.totalChars = this.textComplet.length;
        }
        
        if (!this.textComplet) return;

        this.synth.cancel(); // Cancela qualquer fala anterior

        // Cria utterance com texto restante (a partir de posicaoTexto)
        const textoRestante = this.textComplet.slice(this.posicaoTexto);
        this.utterance = new SpeechSynthesisUtterance(textoRestante);
        this.utterance.lang = 'pt-BR';
        this.utterance.rate = this.velocidadeAtual;

        // Evento ao iniciar
        this.utterance.onstart = () => {
            this.isReading = true;
            this.iconPlay.style.display = 'none';
            this.iconStop.style.display = 'block';
            this.textBtn.innerText = "Pausar";
            this.animarProgresso();
        };

        // Evento para salvar posição e atualizar progresso
        this.utterance.onboundary = (event) => {
            if (event.name === 'word') {
                this.posicaoTexto += event.charIndex; // Atualiza posição global
                const progresso = (this.posicaoTexto / this.totalChars) * 100;
                this.progressBar.style.width = `${Math.min(progresso, 100)}%`;
            }
        };

        // Evento ao terminar
        this.utterance.onend = () => {
            this.parar();
        };

        this.synth.speak(this.utterance);
    }

    pausar() {
        this.synth.pause();
        this.isReading = false;
        this.iconPlay.style.display = 'block';
        this.iconStop.style.display = 'none';
        this.textBtn.innerText = "Retomar Leitura";
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
        // Reseta posição apenas se terminou completamente
        if (this.posicaoTexto >= this.totalChars) {
            this.posicaoTexto = 0;
        }
    }

    corrigirBugMotores() {
        // Workaround para bugs de pausa em alguns motores
        if (this.synth.paused && !this.isReading) {
            this.synth.resume();
            this.synth.pause();
            this.timeoutBug = setTimeout(() => this.corrigirBugMotores(), 10000);
        }
    }

    animarProgresso() {
        // Método auxiliar; progresso é atualizado em onboundary
        // Pode ser usado para fallbacks se onboundary não disparar
    }
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    new LeitorInteligente();
});