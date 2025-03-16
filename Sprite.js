class Sprite {
    constructor(config) {
  
      //Set up the image
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => {
        this.isLoaded = true;
      }

      //Configure Animation & Initial State
      this.animations = config.animations || {
        "idle-down" : [ [5,3] ],
        "idle-right": [ [5,0] ],
        "idle-up"   : [ [5,1] ],
        "idle-left" : [ [5,2] ],
        "walk-down" : [ [0,3],[1,3],[2,3],[3,3],[4,3],[5,3] ],
        "walk-right": [ [0,0],[1,0],[2,0],[3,0],[4,0],[5,0] ],
        "walk-up"   : [ [0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
        "walk-left" : [ [0,2],[1,2],[2,2],[3,2],[4,2],[5,2] ],
      }
      this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-down";
      this.currentAnimationFrame = 0;
  
      this.animationFrameLimit = config.animationFrameLimit || 8;
      this.animationFrameProgress = this.animationFrameLimit;
      
  
      //Reference the game object
      this.gameObject = config.gameObject;
    }
  
    get frame() {
      return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }
  
    setAnimation(key) {
      if (this.currentAnimation !== key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }
  
    updateAnimationProgress() {
      //Downtick frame progress
      if (this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 1;
        return;
      }
  
      //Reset the counter
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame += 1;
  
      if (this.frame === undefined) {
        this.currentAnimationFrame = 0
      }
  
  
    }
    
  
    draw(ctx, cameraPerson) {
      const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
      const y = this.gameObject.y - 16 + utils.withGrid(6) - cameraPerson.y;

  
      const [frameX, frameY] = this.frame;
  
      this.isLoaded && ctx.drawImage(this.image,
        frameX * 32, frameY * 32,
        32,32,
        x,y,
        32,32
      )
  
      this.updateAnimationProgress();
    }
  
  }