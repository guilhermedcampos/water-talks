/**
 * TextMessage class
 * Creates and manages dialog boxes that display text to the player
 * Handles rendering, user interaction, and cleanup of dialog UI elements
 */
class TextMessage {
  /**
   * Create a new text message dialog
   * @param {Object} config - Configuration object
   * @param {String} config.text - The text content to display in the dialog
   * @param {Function} config.onComplete - Callback function to execute when dialog is closed
   */
  constructor({ text, onComplete}) {
    this.text = text;                // The message text to display
    this.onComplete = onComplete;    // Function to call when message is dismissed
    this.element = null;             // Will hold the DOM element once created
  }

  /**
   * Create the DOM elements for the text message dialog
   * Sets up the dialog box, text content, and interaction buttons
   */
  createElement() {
    // Create the main container element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    // Set the inner HTML with the message text and a skip button
    // The dialog has two parts: the text paragraph and a skip button
    this.element.innerHTML = (
        `<p class="TextMessage_p">${this.text}</p>
        <button class="TextMessage_button">Skip</button>
     `);

    // Add click handler to the skip button
    this.element.querySelector("button").addEventListener("click", () => {
      // Close the text message when skip button is clicked
      this.done();
    });

    // Add keyboard handler for Space key to dismiss dialog
    // Uses the KeyPressListener utility class for handling key events
    this.actionListener = new KeyPressListener("Space", (event) => {
      // Stop event from propagating to other listeners to prevent
      // other game elements from responding to the Space key
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // Remove the key listener and close the dialog
      this.actionListener.unbind();
      this.done();
    });
    
    // Prevent clicks within the dialog from bubbling up to game elements beneath
    // This ensures clicks on the dialog don't trigger game actions
    this.element.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /**
   * Clean up and remove the text message dialog
   * Handles DOM cleanup and triggering the completion callback
   */
  done() {
    // Remove the dialog element from the DOM
    this.element.remove();
    
    // Call the completion callback function
    this.onComplete();
    
    // Delay enabling other space listeners to prevent accidental triggers
    // This small timeout prevents the Space key from immediately triggering
    // another action after closing this dialog
    setTimeout(() => {
      // Dispatch an event that other systems can listen for to know
      // when the text message has been fully closed and cleaned up
      document.dispatchEvent(new CustomEvent("textMessageClosed"));
    }, 50);
  }

  /**
   * Initialize the text message dialog and add it to the container
   * @param {HTMLElement} container - The DOM element to append this dialog to
   */
  init(container) {
    // Create the dialog elements
    this.createElement();
    
    // Add the dialog to the specified container
    container.appendChild(this.element);
  }
}