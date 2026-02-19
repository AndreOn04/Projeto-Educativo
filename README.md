<h1>🧠 Projeto Educativo</h1>

<p>Este repositório contém o código-fonte de um projeto web denominado Projeto Educativo, que se trata de um site estático responsivo desenvolvido com HTML, CSS e JavaScript. O site foi criado com o propósito de servir como ferramenta de disseminação de conteúdos educacionais, apresentando informações, seções, navegação e interface voltada para usuários navegarem em diferentes páginas informativas.</p>

<h2>🚀 Visão Geral</h2>
O Projeto Educativo é um projeto web básico que demonstra a implementação de um site completo, com:<br>
✔ Estrutura organizada de pastas <br>
✔ Páginas interligadas (index, seções etc.) <br>
✔ Estilo visual com CSS <br>
✔ Funcionalidade com JavaScript <br>
✔ Organização de imagens e recursos estáticos <br>

<br>
Este projeto pode ser utilizado como base para aprender ou demonstrar conceitos de desenvolvimento frontend, como marcação semântica, layout responsivo e integração entre páginas.

<h3>📁 Estrutura de Pastas</h3>

```text
/
├── css/           # Arquivos de estilo (CSS)
├── imagens/       # Imagens utilizadas no site
├── js/            # Scripts em JavaScript
├── pages/         # Páginas secundárias
└── index.html     # Página principal
``` 
✔ A divisão de pastas segue boas práticas de organização.  <br>
✔ O arquivo index.html é a porta de entrada do site. <br>
✔ Os arquivos CSS e JS tornam a experiência mais elegante e interativa  <br>

<h2>🧩 Tecnologias Utilizadas</h2>

O projeto foi desenvolvido utilizando:
| Tecnologia       | Função                                    |
| ---------------- | ----------------------------------------- |
| **HTML5**        | Estrutura semântica das páginas           |
| **CSS3**         | Estilização visual e layout               |
| **JavaScript**   | Funcionalidade e interatividade           |
| **Git & GitHub** | Controle de versão e hospedagem do código |

Não foram utilizadas tecnologias de backend (como PHP ou banco de dados) neste projeto, pois o site foi pensado para ser estático e informativo.

<h3>🛠️ Como Executar o Projeto Localmente</h3>
1 Clone o repositório: 

```text

git clone https://github.com/AndreOn04/Projeto-Educativo.git

```

2 Acesse a pasta do projeto:
```text

cd Projeto-Educativo

```
3 Abra o arquivo index.html no seu navegador preferido.

📌 Como o projeto é estático, não é necessário servidor local para visualizá-lo. Basta abrir o HTML no navegador

<h3> 🧪 Funcionalidades Principais </h3>

O site oferece:

- Navegação entre páginas internas

- Conteúdo informativo organizado por tema

- Elementos visuais estilizados via CSS

- Scripts leves para possíveis interações

- Layout simples e claro para usuários

<h2> 🔗 Links Importantes </h2>

🔗 Repositório GitHub:
➡ https://github.com/AndreOn04/Projeto-Educativo 

🔗 Projeto em produção
➡ [https://educapenha.vercel.app](https://educapenha.vercel.app/)

<h2> 📝 Licença </h2>
Este projeto disponibilizado <b>não é open source</b>, o que significa que qualquer pessoa pode <b>apenas</b> visualizar, porém, não pode utilizar e adaptar o código conforme necessário. <br> <br>
Copyright <b>© 2026.</b> Todos os direitos reservados.

<h2>🔊 Nota técnica: Web Speech API em celulares (Android/iOS)</h2>

Se você implementar leitor de texto com <code>speechSynthesis</code>, é comum funcionar no desktop e falhar no mobile.
Os principais motivos são:

- O motor de voz no celular exige execução direta após gesto do usuário (click/touch).
- Em alguns navegadores móveis (especialmente iOS Safari), eventos como <code>onboundary</code> podem não disparar de forma confiável.
- Textos muito longos em uma única <code>SpeechSynthesisUtterance</code> podem não ser lidos corretamente.
- A lista de vozes pode carregar de forma assíncrona (exige <code>onvoiceschanged</code>).

### Recomendações práticas

1. Iniciar a fala apenas dentro do clique do botão (sem depender de “desbloqueio” global em <code>touchstart</code>).
2. Não depender exclusivamente de <code>onboundary</code> para progresso no mobile.
3. Dividir o texto em blocos menores (frases/parágrafos) e enfileirar.
4. Tratar <code>visibilitychange</code>/<code>pagehide</code> para pausar ou cancelar com segurança.
5. Ouvir tanto <code>click</code> quanto <code>touchend</code> no botão principal.

### Exemplo base compatível (resumo)

```js
class LeitorInteligente {
  constructor() {
    this.synth = window.speechSynthesis;
    this.btn = document.getElementById('btn-audio-main');
    this.texto = '';
    this.fila = [];
    this.idx = 0;
    this.rate = 1;

    if (!this.synth || !this.btn) return;
    this.init();
  }

  init() {
    const start = (e) => {
      e.preventDefault();
      if (!this.synth.speaking) this.iniciar();
      else if (this.synth.paused) this.synth.resume();
      else this.synth.pause();
    };

    this.btn.addEventListener('click', start, { passive: false });
    this.btn.addEventListener('touchend', start, { passive: false });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.synth.speaking) this.synth.pause();
    });
  }

  obterTexto() {
    const blocos = [...document.querySelectorAll('[data-read]')];
    const bruto = blocos.length
      ? blocos.map((b) => b.innerText.trim()).join('. ')
      : (document.querySelector('main')?.innerText || '');
    return bruto.replace(/\s+/g, ' ').trim();
  }

  quebrarTexto(texto, max = 180) {
    const frases = texto.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let acc = '';
    for (const f of frases) {
      if ((acc + ' ' + f).trim().length > max) {
        if (acc) chunks.push(acc.trim());
        acc = f;
      } else {
        acc += ' ' + f;
      }
    }
    if (acc) chunks.push(acc.trim());
    return chunks;
  }

  iniciar() {
    this.texto = this.texto || this.obterTexto();
    if (!this.texto) return;

    this.fila = this.quebrarTexto(this.texto);
    this.idx = 0;
    this.synth.cancel();
    this.falarProximo();
  }

  falarProximo() {
    if (this.idx >= this.fila.length) return;
    const u = new SpeechSynthesisUtterance(this.fila[this.idx]);
    u.lang = 'pt-BR';
    u.rate = this.rate;
    u.onend = () => {
      this.idx += 1;
      this.falarProximo();
    };
    this.synth.speak(u);
  }
}
```

> Observação: como o projeto é informativo/educativo, mantenha a interface e os textos deixando claro que o site não substitui canais oficiais.
