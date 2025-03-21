class Person extends GameObject {
    constructor(config) {
      super(config);
      this.movingProgressRemaining = 0;
      this.isStanding = false;
  
      this.isPlayerControlled = config.isPlayerControlled || false;
  
      this.directionUpdate = {
        "up": ["y", -1],
        "down": ["y", 1],
        "left": ["x", -1],
        "right": ["x", 1],
      }
    }
  
    update(state) {
      // If the person is moving, update the position
      if (this.movingProgressRemaining > 0) {
        this.updatePosition();
      } else {
      // Otherwise, check if the person should start moving
      
      // Future cases
      //

      // Case: we're keyboard ready (player can provide input) and the arrow is pressed
        if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
          this.startBehavior(state, {
            type: "walk",
            direction: state.arrow,
          })
        }

        // Update the sprite
        this.updateSprite(state);
      }
    }

    startBehavior(state, behavior) {
      // Set the direction to behavior direction
      this.direction = behavior.direction;
      if (behavior.type === "walk") {

        // Check if the space is taken, stop if it is
        if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

          // If the behavior is set to retry, try again
          behavior.retry && setTimeout(() => {  
            this.startBehavior(state, behavior);
          }, 10);

          return;
        }

        // Ready to fire walk
        state.map.moveWall(this.x, this.y, this.direction);
        this.movingProgressRemaining = 16;
        this.updateSprite(state);
      }
      if (behavior.type === "stand") {
        this.isStanding = true;
        setTimeout(() => {
          utils.emitEvent("PersonStandComplete", {
            whoId: this.id
          });
          this.isStanding = false;
        } , behavior.time);
      }
    }
  
    updatePosition() {
      // Update the position based on the direction
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;

      // If the person is done moving, check if custom event should be fired
      if (this.movingProgressRemaining === 0) {
        // Finished walking
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id
        })
      }
    }
  
    updateSprite() {
      // If the person is moving, set the animation to walk
      // console.log("Current position: ", this.x / 16, this.y / 16, "Of person: ", this.id);
      if (this.movingProgressRemaining > 0) {
        this.sprite.setAnimation("walk-"+this.direction);
        return;
      }

      // Otherwise, set the animation to idle
      this.sprite.setAnimation("idle-"+this.direction);
    }
  }