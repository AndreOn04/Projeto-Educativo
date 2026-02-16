class QuoteShare {
  constructor() {
    this.popover = document.getElementById("share-popover");
    this.selectedText = "";
    this.init();
  }

  init() {
    document.addEventListener("mouseup", () => this.handleSelection());

    document.getElementById("copy-quote").onclick = () => {
      const finalTexto = `"${this.selectedText}"\n\nFonte: ${window.location.href}`;
      navigator.clipboard.writeText(finalTexto);
      this.hide();
    };

    document.getElementById("whatsapp-quote").onclick = () => {
      const msg = encodeURIComponent(
        `"${this.selectedText}"\n\nLeia mais em: ${window.location.href}`,
      );
      window.open(`https://api.whatsapp.com/send?text=${msg}`);
      this.hide();
    };
  }

  handleSelection() {
    const sel = window.getSelection();
    const text = sel.toString().trim();

    if (text.length > 10) {
      this.selectedText = text;
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this.popover.style.display = "flex";
      this.popover.style.top = ` ${rect.top + window.scrollY - 50}px`;
      this.popover.style.left = ` ${rect.left + window.scrollX + rect.width / 2 - 35}px`;
    } else {
      this.hide();
    }
  }
  hide() {
    this.popover.style.display = "none";
  }
}

new QuoteShare();