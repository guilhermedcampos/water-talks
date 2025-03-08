class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowRight": "right",
      "KeyD": "right"
    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  init () {
    document.addEventListener("keydown", e => {

        // If the key pressed is a direction, add it to the array
        const dir = this.map[e.code];

        // Start of array is latest added key
        if (dir && this.heldDirections.indexOf(dir) === -1) {
            this.heldDirections.unshift(dir);
        }
    });
    // Keep track of every key released
    document.addEventListener("keyup", e => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
          this.heldDirections.splice(index, 1);
      }
    })
  }
}