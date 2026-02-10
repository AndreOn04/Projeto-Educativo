class SuperAcessibilidade {
    constructor() {
        // 1. Importa as fontes assim que a classe é instanciada
        this.importarFontes();
        
        this.size = parseInt(localStorage.getItem('acc-size')) || 100;
        this.fontIdx = parseInt(localStorage.getItem('acc-font-idx')) || 0;
        
        this.fonts = [
            "Inter", "Lato", "Open Sans", "Roboto", "Montserrat", 
            "Poppins", "Oswald", "Playfair Display", "Merriweather", "Lora",
            "Ubuntu", "Raleway", "Nunito", "PT Sans", "Josefin Sans",
            "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New"
        ];

        this.init();
    }

    importarFontes() {
        if (document.getElementById('google-fonts-acc')) return;
        
        const fontesGoogle = ["Inter", "Lato", "Open+Sans", "Roboto", "Montserrat", "Poppins", "Oswald", "Playfair+Display", "Merriweather", "Lora", "Ubuntu", "Raleway", "Nunito", "PT+Sans", "Josefin+Sans"];
        const link = document.createElement('link');
        link.id = 'google-fonts-acc';
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontesGoogle.map(f => f + ':wght@400;700').join('&family=')}&display=swap`;
        document.head.appendChild(link);
    }

    createStyleTag() {
        if (document.getElementById('dynamic-acc-styles')) return;
        const style = document.createElement('style');
        style.id = "dynamic-acc-styles";
        document.head.appendChild(style);
        this.styleTag = style;
    }

    apply() {
        this.createStyleTag();
        const font = this.fonts[this.fontIdx];
        
        // Seletor universal exceto para ícones (para não quebrar o IonIcons)
        this.styleTag.innerHTML = `
            body, p, h1, h2, h3, h4, h5, h6, span, a, li, button, input, label { 
                font-family: "${font}", sans-serif !important; 
            }
            html { 
                font-size: ${this.size}% !important; 
            }
        `;

        document.getElementById('acc-size-label').innerText = `${this.size}%`;
        document.getElementById('acc-font-name').innerText = font;

        localStorage.setItem('acc-size', this.size);
        localStorage.setItem('acc-font-idx', this.fontIdx);
    }

    init() {
        this.apply();

        document.getElementById('toggle-acc-menu').addEventListener('click', () => {
            document.getElementById('acc-menu').classList.toggle('active');
        });

        document.querySelectorAll('.acc-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.dataset.type;
                const val = btn.dataset.value;

                if (type === 'size') {
                    this.size = Math.min(Math.max(this.size + parseInt(val), 70), 200);
                } else if (type === 'font') {
                    if (val === 'next') this.fontIdx = (this.fontIdx + 1) % this.fonts.length;
                    if (val === 'prev') this.fontIdx = (this.fontIdx - 1 + this.fonts.length) % this.fonts.length;
                }
                this.apply();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new SuperAcessibilidade());