class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;  // Game objects
        this.walls = config.walls || {};    // Walls

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;  // Floor, Walls, tiles, etc
        
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;  // Tree tops, Terraces etc

        this.isCutscenePlaying = false;
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
}

// Maps
window.OverworldMaps = {
    House: {
        lowerSrc: "images/maps/HouseLower.png",
        upperSrc: "images/maps/HouseUpper.png",
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(5), 
                src: "images/characters/people/ben.png"
            }),
            
            npc1: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(8), 
                src: "images/characters/people/ben.png"
            }),
        }, 
        walls: {
            // Dynamic keys
            [utils.asGridCoords(5,4)]: true,
            [utils.asGridCoords(6,4)]: true,
            [utils.asGridCoords(7,4)]: true,
            [utils.asGridCoords(8,4)]: true,
            [utils.asGridCoords(9,4)]: true,
            [utils.asGridCoords(10,4)]: true,
            [utils.asGridCoords(11,4)]: true,
            [utils.asGridCoords(12,4)]: true,
            [utils.asGridCoords(13,4)]: true,
            [utils.asGridCoords(14,4)]: true,
            [utils.asGridCoords(15,4)]: true,
            [utils.asGridCoords(16,4)]: true,
        }
    },
    Arena: {
        lowerSrc: "images/maps/ArenaLower.png",
        upperSrc: "images/maps/ArenaUpper.png",
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(9),
                y: utils.withGrid(12), 
            }),
            npc1: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(4),
                src: "images/characters/people/ben.png",
                behaviorLoop: [ 
                    { type: "stand", direction: "left", time: 400},
                    { type: "stand", direction: "up", time: 800},
                    { type: "stand", direction: "right", time: 300},
                    { type: "stand", direction: "down", time: 500},
                  ],
            }),
            npc2: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(10),
                src: "images/characters/people/ben.png",
                behaviorLoop: [ 
                  { type: "walk", direction: "left"},
                  { type: "walk", direction: "up"},
                  { type: "walk", direction: "right"},
                  { type: "walk", direction: "down"},
                ],
            }),
        },
        walls: {
            // Dynamic keys 22x13 rectangle
            [utils.asGridCoords(0,1)]: true,
            [utils.asGridCoords(0,2)]: true,
            [utils.asGridCoords(0,3)]: true,
            [utils.asGridCoords(0,4)]: true,
            [utils.asGridCoords(0,5)]: true,
            [utils.asGridCoords(0,6)]: true,
            [utils.asGridCoords(0,7)]: true,
            [utils.asGridCoords(0,8)]: true,
            [utils.asGridCoords(0,9)]: true,
            [utils.asGridCoords(0,10)]: true,
            [utils.asGridCoords(0,11)]: true,
            [utils.asGridCoords(0,12)]: true,
            [utils.asGridCoords(0,13)]: true,
            [utils.asGridCoords(1,0)]: true,
            [utils.asGridCoords(2,0)]: true,
            [utils.asGridCoords(3,0)]: true,
            [utils.asGridCoords(4,0)]: true,
            [utils.asGridCoords(5,0)]: true,
            [utils.asGridCoords(6,0)]: true,
            [utils.asGridCoords(7,0)]: true,
            [utils.asGridCoords(8,0)]: true,
            [utils.asGridCoords(9,0)]: true,
            [utils.asGridCoords(10,0)]: true,
            [utils.asGridCoords(11,0)]: true,
            [utils.asGridCoords(12,0)]: true,
            [utils.asGridCoords(13,0)]: true,
            [utils.asGridCoords(14,0)]: true,
            [utils.asGridCoords(15,0)]: true,
            [utils.asGridCoords(16,0)]: true,
            [utils.asGridCoords(17,0)]: true,
            [utils.asGridCoords(18,0)]: true,
            [utils.asGridCoords(19,0)]: true,
            [utils.asGridCoords(20,0)]: true,
            [utils.asGridCoords(21,0)]: true,
            [utils.asGridCoords(22,0)]: true,
            [utils.asGridCoords(23,0)]: true,
            [utils.asGridCoords(23,1)]: true,
            [utils.asGridCoords(23,2)]: true,
            [utils.asGridCoords(23,3)]: true,
            [utils.asGridCoords(23,4)]: true,
            [utils.asGridCoords(23,5)]: true,
            [utils.asGridCoords(23,6)]: true,
            [utils.asGridCoords(23,7)]: true,
            [utils.asGridCoords(23,8)]: true,
            [utils.asGridCoords(23,9)]: true,
            [utils.asGridCoords(23,10)]: true,
            [utils.asGridCoords(23,11)]: true,
            [utils.asGridCoords(23,12)]: true,
            [utils.asGridCoords(23,13)]: true,
            [utils.asGridCoords(1,13)]: true,
            [utils.asGridCoords(2,13)]: true,
            [utils.asGridCoords(3,13)]: true,
            [utils.asGridCoords(4,13)]: true,
            [utils.asGridCoords(5,13)]: true,
            [utils.asGridCoords(6,13)]: true,
            [utils.asGridCoords(7,13)]: true,
            [utils.asGridCoords(8,13)]: true,
            [utils.asGridCoords(9,13)]: true,
            [utils.asGridCoords(10,13)]: true,
            [utils.asGridCoords(11,13)]: true,
            [utils.asGridCoords(12,13)]: true,
            [utils.asGridCoords(13,13)]: true,
            [utils.asGridCoords(14,13)]: true,
            [utils.asGridCoords(15,13)]: true,
            [utils.asGridCoords(16,13)]: true,
            [utils.asGridCoords(17,13)]: true,
            [utils.asGridCoords(18,13)]: true,
            [utils.asGridCoords(19,13)]: true,
            [utils.asGridCoords(20,13)]: true,
            [utils.asGridCoords(21,13)]: true,
            [utils.asGridCoords(22,13)]: true
        }
    },
    Street1: {
        lowerSrc: "images/maps/Street1Lower.png",
        upperSrc: "images/maps/Street1Upper.png",
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(9),
                y: utils.withGrid(12), 
            }),
        },
        walls: {
            // 4x4 Square
            [utils.asGridCoords(5,5)]: true,
            [utils.asGridCoords(5,6)]: true,
            [utils.asGridCoords(6,5)]: true,
            [utils.asGridCoords(6,6)]: true,
            
        }
    }
}