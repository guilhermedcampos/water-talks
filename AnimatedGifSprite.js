// Add this to your codebase (e.g., in a new file or in your existing framework)
class AnimatedGifSprite extends Person {
    constructor(config) {
        super(config);
        
        // Track our animation frames
        this.frameCount = config.frameCount || 4; // Number of frames in your animation
        this.currentFrame = 0;
        this.animationSpeed = config.animationSpeed || 200; // ms between frames
        this.baseImagePath = config.src.replace('.gif', ''); // Remove .gif extension
        
        // Set up animation loop
        this.startAnimation();
    }
    
    startAnimation() {
        // Set the initial image
        this.updateFrame();
        
        // Create animation interval
        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.updateFrame();
        }, this.animationSpeed);
    }
    
    updateFrame() {
        // Create a new image for each frame to force browser to reload
        const newImage = new Image();
        newImage.src = `${this.baseImagePath}${this.currentFrame + 1}.png`;
        
        // When loaded, update the sprite's image
        newImage.onload = () => {
            if (this.sprite && this.sprite.image) {
                this.sprite.image = newImage;
                this.sprite.isLoaded = true;
            }
        };
    }
    
    // Clean up when removed
    destroy() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}