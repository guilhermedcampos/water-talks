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

    // Add space key listener with event prevention
    this.actionListener = new KeyPressListener("Space", (event) => {
      // Stop event from propagating to other listeners
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      this.actionListener.unbind();
      this.done();
    });
    
    // Also prevent clicks from propagating through the text message container
    this.element.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
    
    // Delay enabling other space listeners to prevent accidental triggers
    setTimeout(() => {
      // Optional: Notify that text message is completely gone
      document.dispatchEvent(new CustomEvent("textMessageClosed"));
    }, 50);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}