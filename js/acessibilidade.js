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
        this.velocidades = [1, 1.25, 1.5, 2];
        this.indiceVelocidade = 0;
        this.velocidadeAtual = this.velocidades[this.indiceVelocidade];
        this.posicaoTexto = 0; // Posição global real
        this.textComplet = "";
        this.isReading = false;
        this.utterance = null;
        this.totalChars = 0;
        this.timeoutBug = null;
        
        this.init();
    }

    init() {
        if (!this.synth) return;

        // Desbloqueio para Smartphone (Mobile exige gesto do usuário)
        const handleUserGesture = () => {
            if (this.synth.speaking === false) {
                const u = new SpeechSynthesisUtterance("");
                this.synth.speak(u);
                this.synth.cancel();
            }
            document.removeEventListener('touchstart', handleUserGesture);
        };
        document.addEventListener('touchstart', handleUserGesture);

        // Evento para botão principal
        this.btn.addEventListener('click', (e) => {
            const widget = document.querySelector('.audio-widget');
            if (window.innerWidth <= 768 && !widget.classList.contains('is-open')) {
                widget.classList.add('is-open');
                return;
            }
            this.toggleLeitura();
        });

        // Evento para botão de velocidade (Troca em tempo real)
        if (this.btnSpeed) {
            this.btnSpeed.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVelocidade();
            });
        }

        // Fecha widget ao clicar fora (mobile)
        document.addEventListener('click', (e) => {
            const widget = document.querySelector('.audio-widget');
            if (widget && !widget.contains(e.target)) {
                widget.classList.remove('is-open');
            }
        });

        window.addEventListener('beforeunload', () => this.synth.cancel());
    }

    preencherVozes() {
        if(!this.synth) return;
        this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('pt')); // Filtra Vozes em português.
        this.vozSelect.innerHTML = '<option value="default">Padrão</option>';
        this.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = value.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            this.vozSelect.appendChild(option);
        });

        if(this.selectedVoices) {
            this.vozSelect.value = this.selectedVoices.name;
        }
    }

    obterTextoSite() {
        const blocosParaLer = document.querySelectorAll('[data-read]');
        let textoFinal = '';

        if (blocosParaLer.length === 0) {
            const main = document.querySelector('main');
            return main ? main.innerText.trim() : "";
        }

        blocosParaLer.forEach(bloco => {
            const clone = bloco.cloneNode(true);
            const ignorar = clone.querySelectorAll('button, a, .no-read, .speed-toggle');
            ignorar.forEach(el => el.remove());
            textoFinal += clone.innerText.trim() + ". ";
        });

        return textoFinal.replace(/\s+/g, ' ').trim();
    }

    toggleLeitura() {
        if (this.synth.speaking) {
            this.synth.paused ? this.retomar() : this.pausar();
        } else {
            this.iniciar();
        }
    }

    toggleVelocidade() {
        this.indiceVelocidade = (this.indiceVelocidade + 1) % this.velocidades.length;
        this.velocidadeAtual = this.velocidades[this.indiceVelocidade];
        this.btnSpeed.innerText = `${this.velocidadeAtual}x`;
        
        // Se estiver lendo, reinicia para aplicar a velocidade imediatamente no meio da frase
        if (this.isReading) {
            this.iniciar(true);
        }
    }
    
    iniciar(isRestart = false) {
        if (!this.textComplet) {
            this.textComplet = this.obterTextoSite();
            this.totalChars = this.textComplet.length;
        }
        
        if (!this.textComplet) return;

        this.synth.cancel();

        // Pegamos o trecho que falta
        const textoParaFalar = this.textComplet.slice(this.posicaoTexto);
        this.utterance = new SpeechSynthesisUtterance(textoParaFalar);
        this.utterance.lang = 'pt-BR';
        this.utterance.rate = this.velocidadeAtual;

        this.utterance.onboundary = (event) => {
            if (event.name === 'word') {
                // Sincronização da posição real
                const charNoTrecho = event.charIndex;
                const charGlobal = (this.totalChars - textoParaFalar.length) + charNoTrecho;
                
                // Atualizamos a posição global para o progresso e marcador
                this.posicaoTexto = charGlobal;

                const progresso = (this.posicaoTexto / this.totalChars) * 100;
                this.progressBar.style.width = `${Math.min(progresso, 100)}%`;

                // Chama o marcador corrigido
                // this.marcarTexto(charGlobal, event.charLength);
            }
        };

        this.utterance.onstart = () => {
            this.isReading = true;
            this.iconPlay.style.display = 'none';
            this.iconStop.style.display = 'block';
            this.textBtn.innerText = "Pausar";
        };

        this.utterance.onend = () => {
            if (!this.synth.pending && !this.synth.speaking) {
                this.parar();
            }
        };

        setTimeout(() => this.synth.speak(this.utterance), isRestart ? 50 : 0);
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
        this.removerMarcacao();
        
        if (this.posicaoTexto >= this.totalChars - 5) {
            this.posicaoTexto = 0;
        }
    }

    corrigirBugMotores() {
        if (this.synth.paused && !this.isReading) {
            this.synth.resume();
            this.synth.pause();
            this.timeoutBug = setTimeout(() => this.corrigirBugMotores(), 10000);
        }
    }

    animarProgresso() {
        // Progresso agora é controlado via onboundary para precisão total.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LeitorInteligente();
});