class LeitorInteligente {
    constructor() {
        this.synth = window.speechSynthesis;
        this.btn = document.getElementById('btn-audio-main');
        this.progressBar = document.getElementById('audio-progress');
        this.textBtn = document.querySelector('.audio-text');
        this.iconPlay = document.querySelector('.icon-play');
        this.iconStop = document.querySelector('.icon-stop');
        this.btnSpeed = document.querySelector('.speed-toggle');

        this.velocidades = [1, 1.25, 1.5, 1.75];
        this.indiceVelocidade = 0;
        this.velocidadeAtual = this.velocidades[this.indiceVelocidade];

        this.textoCompleto = '';
        this.chunks = [];
        this.chunkAtual = 0;
        this.charsLidos = 0;
        this.totalChars = 0;

        this.isReading = false;
        this.isPaused = false;
        this.utteranceAtual = null;

        if (!this.synth || !this.btn) return;
        this.init();
    }

    init() {
        const toggleComGesto = (event) => {
            event.preventDefault();
            this.toggleLeitura();
        };

        this.btn.addEventListener('click', toggleComGesto, { passive: false });
        this.btn.addEventListener('touchend', toggleComGesto, { passive: false });

        if (this.btnSpeed) {
            this.btnSpeed.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.toggleVelocidade();
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.synth.speaking) {
                this.pausar();
            }
        });

        window.addEventListener('pagehide', () => this.synth.cancel());
        window.addEventListener('beforeunload', () => this.synth.cancel());
    }

    obterTextoSite() {
        const blocos = [...document.querySelectorAll('[data-read]')];

        if (!blocos.length) {
            return (document.querySelector('main')?.innerText || '').replace(/\s+/g, ' ').trim();
        }

        const texto = blocos
            .map((bloco) => {
                const clone = bloco.cloneNode(true);
                clone.querySelectorAll('button, a, .no-read, .speed-toggle, .audio-note').forEach((el) => el.remove());
                return clone.innerText.trim();
            })
            .filter(Boolean)
            .join('. ');

        return texto.replace(/\s+/g, ' ').trim();
    }

    quebrarTexto(texto, tamanhoMaximo = 180) {
        const frases = texto.split(/(?<=[.!?])\s+/);
        const chunks = [];
        let acumulado = '';

        frases.forEach((frase) => {
            const candidato = `${acumulado} ${frase}`.trim();
            if (candidato.length > tamanhoMaximo && acumulado) {
                chunks.push(acumulado.trim());
                acumulado = frase;
            } else {
                acumulado = candidato;
            }
        });

        if (acumulado) chunks.push(acumulado.trim());
        return chunks;
    }

    toggleLeitura() {
        if (!this.isReading && !this.isPaused) {
            this.iniciar();
            return;
        }

        if (this.isPaused) {
            this.retomar();
            return;
        }

        this.pausar();
    }

    iniciar(reiniciarMesmoPonto = false) {
        if (!this.textoCompleto) {
            this.textoCompleto = this.obterTextoSite();
            this.totalChars = this.textoCompleto.length;
            this.chunks = this.quebrarTexto(this.textoCompleto);
        }

        if (!this.chunks.length) return;

        if (!reiniciarMesmoPonto) {
            this.chunkAtual = 0;
            this.charsLidos = 0;
            this.atualizarProgresso();
        }

        this.isReading = true;
        this.isPaused = false;
        this.atualizarUI('reading');

        this.synth.cancel();
        this.falarProximoChunk();
    }

    falarProximoChunk() {
        if (!this.isReading || this.chunkAtual >= this.chunks.length) {
            this.parar(true);
            return;
        }

        this.utteranceAtual = new SpeechSynthesisUtterance(this.chunks[this.chunkAtual]);
        this.utteranceAtual.lang = 'pt-BR';
        this.utteranceAtual.rate = this.velocidadeAtual;

        this.utteranceAtual.onend = () => {
            if (!this.isReading) return;
            this.charsLidos += this.chunks[this.chunkAtual].length;
            this.chunkAtual += 1;
            this.atualizarProgresso();
            this.falarProximoChunk();
        };

        this.utteranceAtual.onerror = () => {
            this.parar(false);
        };

        this.synth.speak(this.utteranceAtual);
    }

    toggleVelocidade() {
        this.indiceVelocidade = (this.indiceVelocidade + 1) % this.velocidades.length;
        this.velocidadeAtual = this.velocidades[this.indiceVelocidade];

        if (this.btnSpeed) {
            this.btnSpeed.innerText = `${this.velocidadeAtual}x`;
        }

        if (this.isReading) {
            this.synth.cancel();
            this.falarProximoChunk();
        }
    }

    pausar() {
        if (!this.synth.speaking) return;

        this.synth.pause();
        this.isReading = false;
        this.isPaused = true;
        this.atualizarUI('paused');
    }

    retomar() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isReading = true;
            this.isPaused = false;
            this.atualizarUI('reading');
            return;
        }

        this.isReading = true;
        this.isPaused = false;
        this.atualizarUI('reading');
        this.falarProximoChunk();
    }

    parar(concluido = false) {
        this.synth.cancel();
        this.isReading = false;
        this.isPaused = false;

        if (concluido || this.chunkAtual >= this.chunks.length) {
            this.chunkAtual = 0;
            this.charsLidos = 0;
            this.atualizarProgresso();
        }

        this.atualizarUI('idle');
    }

    atualizarProgresso() {
        if (!this.progressBar || !this.totalChars) return;
        const progresso = Math.min((this.charsLidos / this.totalChars) * 100, 100);
        this.progressBar.style.width = `${progresso}%`;
    }

    atualizarUI(estado) {
        if (!this.iconPlay || !this.iconStop || !this.textBtn) return;

        if (estado === 'reading') {
            this.iconPlay.style.display = 'none';
            this.iconStop.style.display = 'inline-flex';
            this.textBtn.innerText = 'Pausar leitura';
            return;
        }

        if (estado === 'paused') {
            this.iconPlay.style.display = 'inline-flex';
            this.iconStop.style.display = 'none';
            this.textBtn.innerText = 'Retomar leitura';
            return;
        }

        this.iconPlay.style.display = 'inline-flex';
        this.iconStop.style.display = 'none';
        this.textBtn.innerText = 'Ouvir página';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LeitorInteligente();
});