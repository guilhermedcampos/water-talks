class TextMessage {
  constructor({ text , onComplete}) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  // Create the element
  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    // Set the inner HTML, text is appending
    this.element.innerHTML = (
        `<p class="TextMessage_p">${this.text}</p>
        <button class="TextMessage_button">Skip</button>
     `);

    this.element.querySelector("button").addEventListener("click", () => {
      // Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Space", () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}