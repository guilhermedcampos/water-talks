/**
 * Person class - Represents any character in the game (player or NPC)
 * Extends the base GameObject class with movement and behavior capabilities
 */
class Person extends GameObject {
    /**
     * Create a new Person instance
     * @param {Object} config - Configuration object for the person
     * @param {Boolean} config.isPlayerControlled - Whether this person is controlled by player input
     * @param {Number} config.x - Initial x position on the map grid
     * @param {Number} config.y - Initial y position on the map grid
     * @param {String} config.src - Path to the sprite sheet image
     */
    constructor(config) {
      super(config);
      this.movingProgressRemaining = 0;  // Tracks remaining movement steps (0 = not moving)
      this.isStanding = false;  // Flag for when character is deliberately standing still
  
      this.isPlayerControlled = config.isPlayerControlled || false;  // Whether this person responds to keyboard input
  
      // Defines how coordinates should update based on direction
      this.directionUpdate = {
        "up": ["y", -1],     // Move up = decrease y coordinate
        "down": ["y", 1],    // Move down = increase y coordinate
        "left": ["x", -1],   // Move left = decrease x coordinate
        "right": ["x", 1],   // Move right = increase x coordinate
      }
    }
  
    /**
     * Update the person's state on each game tick
     * Handles movement, behaviors and sprite updates
     * @param {Object} state - Current game state
     * @param {Object} state.map - Reference to the current map
     * @param {String} state.arrow - Direction key being pressed (if any)
     */
    update(state) {
      // If the person is in the middle of moving, continue that movement
      if (this.movingProgressRemaining > 0) {
        this.updatePosition();
      } else {
        // Not currently moving, check if we should start a new movement
        
        // Only allow player movement when:
        // 1. No cutscene is playing
        // 2. This is the player-controlled character
        // 3. An arrow key is being pressed
        if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
          this.startBehavior(state, {
            type: "walk",
            direction: state.arrow,
          });
        }

        // Update the sprite appearance based on current state
        this.updateSprite(state);
      }
    }

    /**
     * Start a new behavior for this person (walking or standing)
     * @param {Object} state - Current game state
     * @param {Object} behavior - Behavior to perform
     * @param {String} behavior.type - Type of behavior ("walk" or "stand")
     * @param {String} behavior.direction - Direction to face or move
     * @param {Boolean} behavior.retry - Whether to retry walking if path is blocked
     * @param {Number} behavior.time - For stand behavior, how long to stand still
     */
    startBehavior(state, behavior) {
      // Update character's facing direction
      this.direction = behavior.direction;
      
      // Handle walking behavior
      if (behavior.type === "walk") {
        // Check if the space is available to move into
        if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
          // Space is blocked, can't move there
          
          // If behavior includes retry flag, attempt again after a short delay
          if (behavior.retry) {
            setTimeout(() => {  
              this.startBehavior(state, behavior);
            }, 10);
          }
          return;  // Exit the function, movement can't happen
        }

        // Space is available, begin walking
        // Update wall collision map to mark new position as occupied
        state.map.moveWall(this.x, this.y, this.direction);
        // Set how many animation frames the movement will take
        this.movingProgressRemaining = 16;
        // Update sprite to walking animation
        this.updateSprite(state);
      }
      
      // Handle standing behavior (used primarily for NPCs)
      if (behavior.type === "stand") {
        this.isStanding = true;
        // After specified time, emit completion event and reset standing state
        setTimeout(() => {
          utils.emitEvent("PersonStandComplete", {
            whoId: this.id  // Include ID so listeners know which person completed standing
          });
          this.isStanding = false;
        }, behavior.time);
      }
    }
  
    /**
     * Update the person's position during movement
     * Called on each frame while movingProgressRemaining > 0
     */
    updatePosition() {
      // Get the property to update (x or y) and how much to change it
      const [property, change] = this.directionUpdate[this.direction];
      // Apply the position change
      this[property] += change;
      // Decrement remaining movement
      this.movingProgressRemaining -= 1;

      // Check if movement is complete
      if (this.movingProgressRemaining === 0) {
        // Movement finished, emit event so other systems can respond
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id  // Include ID so listeners know which person completed walking
        });
      }
    }
  
    /**
     * Update the person's sprite animation based on current state
     * Selects between walking and idle animations in the appropriate direction
     * @param {Object} state - Current game state (unused in this method but maintained for consistency)
     */
    updateSprite() {
      // Debug logging for player character position
      if (this.id === "ben") {
        console.log("Current position: ", this.x/16, this.y/16);
      }

      // If currently moving, use the walking animation for current direction
      if (this.movingProgressRemaining > 0) {
        this.sprite.setAnimation("walk-" + this.direction);
        return;
      }

      // If not moving, use the idle animation for current direction
      this.sprite.setAnimation("idle-" + this.direction);
    }
}