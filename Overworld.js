class Overworld {
    // Constructor
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    // Game Loop
    startGameLoop () {
        const step = () => {

            // Clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Establish the camera person (the player)
            const cameraPerson = this.map.gameObjects.ben;

            // Update the game objects, sort by y position so that the lower objects are drawn first
            // avoiding the need for z-index
            Object.values(this.map.gameObjects).sort((a,b) => 
                {return a.y - b.y;}).forEach(gameObject => {
                    gameObject.update({
                        arrow: this.directionInput.direction,
                        map: this.map,
                });
            });

            // Draw the lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            // Draw the game objects
            Object.values(this.map.gameObjects).forEach(gameObject => {
                gameObject.sprite.draw(this.ctx, cameraPerson);
            });

            // Draw the upper layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            // Call this in your game update loop or after player movement
            this.map.checkForButtonTrigger();

            // Request the next frame
            requestAnimationFrame(() => {
                step();
            });
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            // Is there a person here to interact with?
            this.map.checkForActionCutscene();
        });
    }

    bindHeroPositionPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "ben") {
                // Hero's position has changed, check for cutscenes
                this.map.checkForFootstepCutscene();
            }
        }
        );
    }

    // Add new method that zooms the camera to a (x,y) position with optional duration (in seconds)
    zoomToPosition(x, y, duration) {
        // Store original camera settings
        if (!this.originalCameraSettings) {
            this.originalCameraSettings = {
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                isZoomed: false
            };
        }

        // If already zoomed, reset to original view
        if (this.originalCameraSettings.isZoomed) {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
            this.originalCameraSettings.isZoomed = false;
            console.log("Zoom reset to normal view");
            
            // Clear any existing zoom timeout
            if (this.zoomTimeout) {
                clearTimeout(this.zoomTimeout);
                this.zoomTimeout = null;
            }
            return;
        }

        // If no coordinates provided, zoom to player
        if (x === undefined || y === undefined) {
            const cameraPerson = this.map.gameObjects.ben;
            x = cameraPerson.x;
            y = cameraPerson.y;
            console.log("Zooming to player at:", x, y);
        }

        // Calculate center of screen
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Apply 50% zoom (scale 1.5)
        const zoomScale = 1.5;
        
        // Get the cameraPerson for reference
        const cameraPerson = this.map.gameObjects.ben;
        
        // Calculate where the target coordinates are on the screen
        // First, get the offset from camera to screen center
        const cameraOffsetX = utils.withGrid(10.5) - cameraPerson.x;
        const cameraOffsetY = utils.withGrid(6) - cameraPerson.y;
        
        // Then, calculate where our target would be on screen currently
        const targetScreenX = x + cameraOffsetX;
        const targetScreenY = y + cameraOffsetY;
        
        // Reset any existing transformations
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Calculate the translation needed to center the target
        const translationX = centerX - targetScreenX * zoomScale;
        const translationY = centerY - targetScreenY * zoomScale;
        
        // Apply transformations: first translate to place target at center, then scale
        this.ctx.translate(translationX + (targetScreenX * (zoomScale - 1)), 
                          translationY + (targetScreenY * (zoomScale - 1)));
        this.ctx.scale(zoomScale, zoomScale);
        
        // Mark as zoomed
        this.originalCameraSettings.isZoomed = true;
        
        console.log(`Zoomed to position: x=${x}, y=${y} with scale ${zoomScale}`);
        console.log(`Target screen position: ${targetScreenX}, ${targetScreenY}`);
        console.log(`Applied translation: ${translationX}, ${translationY}`);
        
        // If duration is provided, automatically reset zoom after specified seconds
        if (duration) {
            // Clear any existing timeout
            if (this.zoomTimeout) {
                clearTimeout(this.zoomTimeout);
            }
            
            // Set new timeout
            this.zoomTimeout = setTimeout(() => {
                this.zoomToPosition(); // Reset zoom
                console.log(`Zoom automatically reset after ${duration} seconds`);
            }, duration * 1000); // Convert seconds to milliseconds
        }
    }

    async init() {
        console.log("Initializing Overworld...");

        // Create a new instance of the OverworldMap class
        this.map = new OverworldMap(window.OverworldMaps.Bathroom);
        
        // Mount the game objects to the map
        this.map.mountObjects();
        
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.bindActionInput();
        this.bindHeroPositionPositionCheck();

        // Start the game loop
        this.startGameLoop();
        
        // Now that cutscene is done, zoom to position
        console.log("Cutscene complete, starting zoom effect");
    }   
}
