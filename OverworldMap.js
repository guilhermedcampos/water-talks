class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;  // Game objects
        this.walls = config.walls || {};    // Walls

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;  // Floor, Walls, tiles, etc
        
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;  // Tree tops, Terraces etc

        this.isCutscenePlaying = false;
        
        // Store spawnpoint coordinates if provided
        this.spawnpoint = config.spawnpoint || null;
    }

    // Draw the lower layer
    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage,
        utils.withGrid(10.5) - cameraPerson.x,
        utils.withGrid(6) - cameraPerson.y);
    }

    // Draw the upper layer
    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y);
    }

    // Iterates through the game objects and mounts them to the map
    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            // TODO: Check if the space is taken or shouldn't be mounted

            // Get the game object
            let object = this.gameObjects[key];
            object.id = key;

            // Mount the game object to the map
            object.mount(this);
        });
        
        // Set player positions to spawnpoint if available
        this.setSpawnpoint();
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        // Start a loop of events
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let eventHandler = new OverworldEvent({ map: this, event: event});
            await eventHandler.init();
        }

        // Set flag back to false
        this.isCutscenePlaying = false;

        // Reset NPC's to their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))

    }

    // Returns true if the space is taken
    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    // Add a wall
    addWall(x,y) {
        this.walls[`${x},${y}`] = true;
    }

    // Remove a wall
    removeWall(x,y) {
        delete this.walls[`${x},${y}`];
    }

    // Move wall to new position
    moveWall(oldX, oldY, direction) {
        this.removeWall(oldX, oldY);
        const {x,y} = utils.nextPosition(oldX, oldY, direction);
        this.addWall(x, y);
    }

    // Add new method to set players to spawnpoint
    setSpawnpoint() {
        if (!this.spawnpoint) return;
        
        // Find all player-controlled objects and set their position
        Object.values(this.gameObjects).forEach(object => {
            if (object.isPlayerControlled) {
                // Set position to spawnpoint
                object.x = this.spawnpoint.x;
                object.y = this.spawnpoint.y;
                
                // Add a wall at the new position
                this.addWall(object.x, object.y);
                
                console.log(`Player spawned at: x=${object.x}, y=${object.y}`);
            }
        });
    }
}

// Maps
window.OverworldMaps = {
    Bathroom: {
        lowerSrc: "images/maps/BathroomLower.png",
        upperSrc: "images/maps/BathroomUpper.png",
        // Add spawnpoint property
        spawnpoint: {
            x: utils.withGrid(28),
            y: utils.withGrid(29), 
        },
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(5), 
                src: "images/characters/people/ben.png"
            }),
        }, 
        walls: {
            // Converted coordinates (divided by 16)
            [utils.asGridCoords(28, 27)]: true,  // was 448, 432
            [utils.asGridCoords(29, 27)]: true,  // was 464, 432
            [utils.asGridCoords(30, 27)]: true,  // was 480, 432
            [utils.asGridCoords(31, 27)]: true,  // was 496, 432
            [utils.asGridCoords(32, 27)]: true,  // was 512, 432
            [utils.asGridCoords(33, 27)]: true,  // was 528, 432
            [utils.asGridCoords(34, 27)]: true,  // was 544, 432
            [utils.asGridCoords(35, 27)]: true,  // was 560, 432
            [utils.asGridCoords(35, 28)]: true,  // was 560, 448
            [utils.asGridCoords(35, 29)]: true,  // was 560, 464
            [utils.asGridCoords(35, 30)]: true,  // was 560, 480
            [utils.asGridCoords(35, 31)]: true,  // was 560, 496
            [utils.asGridCoords(35, 32)]: true,  // was 560, 512
            [utils.asGridCoords(35, 33)]: true,  // was 560, 528
            [utils.asGridCoords(35, 34)]: true,  // was 560, 544
            [utils.asGridCoords(35, 35)]: true,  // was 560, 560
            [utils.asGridCoords(34, 35)]: true,  // was 544, 560
            [utils.asGridCoords(33, 35)]: true,  // was 528, 560
            [utils.asGridCoords(32, 35)]: true,  // was 512, 560
            [utils.asGridCoords(31, 35)]: true,  // was 496, 560
            [utils.asGridCoords(30, 35)]: true,  // was 480, 560
            [utils.asGridCoords(29, 35)]: true,  // was 464, 560
            [utils.asGridCoords(28, 35)]: true,  // was 448, 560
            [utils.asGridCoords(27, 35)]: true,  // was 432, 560
            [utils.asGridCoords(27, 34)]: true,  // was 432, 544
            [utils.asGridCoords(27, 33)]: true,  // was 432, 528
            [utils.asGridCoords(27, 32)]: true,  // was 432, 512
            [utils.asGridCoords(27, 31)]: true,  // was 432, 496
            [utils.asGridCoords(27, 30)]: true,  // was 432, 480
            [utils.asGridCoords(26, 30)]: true,  // was 416, 480
            [utils.asGridCoords(26, 29)]: true,  // was 416, 464
            [utils.asGridCoords(26, 28)]: true,  // was 416, 448
            [utils.asGridCoords(26, 27)]: true,  // was 416, 432
            [utils.asGridCoords(26, 26)]: true,  // was 416, 416
            [utils.asGridCoords(26, 25)]: true,  // was 416, 400
            [utils.asGridCoords(26, 24)]: true,  // was 416, 384
            [utils.asGridCoords(26, 23)]: true,  // was 416, 368
            [utils.asGridCoords(26, 22)]: true,  // was 416, 352
            [utils.asGridCoords(27, 21)]: true,  // was 432, 336
        }
    },
}