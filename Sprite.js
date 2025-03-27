/**
 * Sprite class
 * Handles the visual representation of game objects including animation
 * Manages sprite sheets, animation frames, and rendering
 */
class Sprite {
    /**
     * Create a new Sprite instance
     * @param {Object} config - Configuration object for the sprite
     * @param {String} config.src - Path to the sprite sheet image
     * @param {Object} config.animations - Map of animation sequences (optional)
     * @param {String} config.currentAnimation - Initial animation to display (optional)
     * @param {Number} config.animationFrameLimit - How many game frames each animation frame shows for (optional)
     * @param {Object} config.gameObject - Reference to parent GameObject instance
     */
    constructor(config) {
      // Set up the image source and loading
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => {
        this.isLoaded = true; // Flag to prevent drawing before image is loaded
      }

      // Configure Animation & Initial State
      // Default animations if none provided showing frame coordinates in sprite sheet [x,y]
      // The sprite sheet is organized in rows by direction and columns by animation frame
      this.animations = config.animations || {
        "idle-down" : [ [5,3] ],   // Standing still, facing down (row 3, column 5)
        "idle-right": [ [5,0] ],   // Standing still, facing right (row 0, column 5)
        "idle-up"   : [ [5,1] ],   // Standing still, facing up (row 1, column 5)
        "idle-left" : [ [5,2] ],   // Standing still, facing left (row 2, column 5)
        "walk-down" : [ [0,3],[1,3],[2,3],[3,3],[4,3],[5,3] ], // Walking down animation sequence
        "walk-right": [ [0,0],[1,0],[2,0],[3,0],[4,0],[5,0] ], // Walking right animation sequence
        "walk-up"   : [ [0,1],[1,1],[2,1],[3,1],[4,1],[5,1] ], // Walking up animation sequence
        "walk-left" : [ [0,2],[1,2],[2,2],[3,2],[4,2],[5,2] ], // Walking left animation sequence
      }
      
      // Set initial animation state
      this.currentAnimation = "idle-right"; // Default to facing right when idle
      this.currentAnimationFrame = 0;      // Start at the first frame of the animation
  
      // Animation timing controls
      this.animationFrameLimit = config.animationFrameLimit || 8; // How many game frames to show each animation frame
      this.animationFrameProgress = this.animationFrameLimit;    // Counter for current progress
      
      // Reference to the parent game object (character, NPC, etc.)
      this.gameObject = config.gameObject;
    }
  
    /**
     * Get the current frame coordinates from the sprite sheet
     * @returns {Array} - [x, y] coordinates of the current frame in the sprite sheet
     */
    get frame() {
      return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }
  
    /**
     * Change the current animation sequence
     * Resets to the first frame of the new animation
     * @param {String} key - Name of the animation to switch to
     */
    setAnimation(key) {
      // Only change animation if it's different from current one
      if (this.currentAnimation !== key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;                     // Reset to first frame
        this.animationFrameProgress = this.animationFrameLimit; // Reset frame timer
      }
    }
  
    /**
     * Update the animation state on each game tick
     * Handles frame timing and progression through animation sequences
     */
    updateAnimationProgress() {
      // Downtick frame progress counter
      if (this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 1;
        return; // Not time to advance the frame yet
      }
  
      // Reset the counter and advance to the next frame
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame += 1;
  
      // Loop back to the first frame if we've reached the end of the animation
      if (this.frame === undefined) {
        this.currentAnimationFrame = 0;
      }
    }
    
    /**
     * Render the sprite to the canvas
     * Handles positioning relative to the camera and selecting the correct animation frame
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     * @param {Object} cameraPerson - The object that the camera is following (usually the player)
     */
    draw(ctx, cameraPerson) {
      // Calculate position on screen relative to camera
      // - 8 and - 16 adjust for sprite center point
      // withGrid functions convert from game grid to pixel coordinates
      const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
      const y = this.gameObject.y - 16 + utils.withGrid(6) - cameraPerson.y;

      // Get the x,y coordinates in the sprite sheet for the current animation frame
      const [frameX, frameY] = this.frame;
  
      // Only draw if the image has loaded to avoid errors
      // Parameters: image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight
      this.isLoaded && ctx.drawImage(this.image,
        frameX * 32, frameY * 32,  // Position in sprite sheet (32x32 pixel cells)
        32, 32,                    // Size of the frame in the sprite sheet
        x, y,                      // Position on the canvas to draw
        32, 32                     // Size to draw on the canvas
      );
  
      // Update animation for next frame
      this.updateAnimationProgress();
    }
}