class KeyPressListener {
    constructor(keyCode, callback) {
        let keySafe = true;
        // Function to call when the key is pressed
        this.keydownFunction = function(e) {
            if (keySafe && e.code === keyCode) {
                keySafe = false;
                callback();
            }
        }
        // Function to call when the key is released
        this.keyupFunction = function(e) {
            if (e.code === keyCode) {
                keySafe = true;
            }
        }

        // Add the event listeners
        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFunction);
        }
        // Remove the event listeners
        unbind() {
            document.removeEventListener("keydown", this.keydownFunction);
            document.removeEventListener("keyup", this.keyupFunction);
        }
}