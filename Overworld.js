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

    init () {
        console.log("Initializing Overworld...");

        // Create a new instance of the OverworldMap class
        this.map = new OverworldMap(window.OverworldMaps.Street1);
        
        // Mount the game objects to the map
        this.map.mountObjects();
        
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // Start the game loop
        this.startGameLoop();

        
        // Start the cutscene
        this.map.startCutscene([
            {type: "textMessage", text: "Hi, I'm Ben!"},
            { who: "ben", type: "walk", direction: "right"},
            { who: "ben", type: "walk", direction: "right"},
            { who: "ben", type: "walk", direction: "right"},
           // { who: "npc1", type: "stand", direction: "left", time: 1000},
        ]);

    }
}
