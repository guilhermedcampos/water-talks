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

            // Request the next frame
            requestAnimationFrame(() => {
                step();
            });
        }
        step();
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
        
        // Calculate where the target point should be on screen
        const targetScreenX = centerX;  // We want the target at the center of screen
        const targetScreenY = centerY;
        
        // Calculate the world position of the target (adjusted for camera)
        const cameraOffsetX = utils.withGrid(10.5) - cameraPerson.x;
        const cameraOffsetY = utils.withGrid(6) - cameraPerson.y;
        
        // Reset any existing transformations
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Apply transformation: translate to target position, scale around that point
        this.ctx.translate(
            targetScreenX - (x + cameraOffsetX) * zoomScale + (x + cameraOffsetX),
            targetScreenY - (y + cameraOffsetY) * zoomScale + (y + cameraOffsetY)
        );
        this.ctx.scale(zoomScale, zoomScale);
        
        // Mark as zoomed
        this.originalCameraSettings.isZoomed = true;
        
        console.log(`Zoomed to position: x=${x}, y=${y} with scale ${zoomScale}`);
        
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

        // Start the game loop
        this.startGameLoop();
        
        // Wait for cutscene to complete before zooming
        await this.map.startCutscene([
            {type: "textMessage", text: "Olá! Pronto para embarcar numa missão para proteger as águas de Portugal?"},
            { who: "ben", type: "walk", direction: "right"},
            { who: "ben", type: "walk", direction: "right"},
            { who: "ben", type: "walk", direction: "right"},
            // { who: "npc1", type: "stand", direction: "left", time: 1000},
        ]);
        
        // Now that cutscene is done, zoom to position
        console.log("Cutscene complete, starting zoom effect");
        this.zoomToPosition(528, 448, 5);
    }
}
