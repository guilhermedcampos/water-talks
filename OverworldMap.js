class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;  // Game objects
        this.walls = config.walls || {};    // Walls
        this.cutSceneSpaces = config.cutSceneSpaces || {}; // Cutscene spaces
        this.buttonSpaces = config.buttonSpaces || {}; // Button trigger spaces

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;  // Floor, Walls, tiles, etc
        
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;  // Tree tops, Terraces etc

        this.isCutscenePlaying = false;
        this.activeButton = null; // Track if a button is currently active
        
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

    checkForActionCutscene() {
        const hero = this.gameObjects["ben"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return object.x === nextCoords.x && object.y === nextCoords.y;
        });
        console.log("Match Action", match);
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events);
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["ben"];
        const match = this.cutSceneSpaces[`${hero.x},${hero.y}`];
        console.log("Match Footstep", match);
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
        
        // Also check for button spaces
        this.checkForButtonTrigger();
    }
    
    // New method to check if character is near a button trigger
    checkForButtonTrigger() {
        const hero = this.gameObjects["ben"];
        const buttonMatch = this.buttonSpaces[`${hero.x},${hero.y}`];
        
        // Remove any existing button if we moved away
        if (!buttonMatch && this.activeButton) {
            this.removeButton();
            return;
        }
        
        // Show the button if we're at a trigger space and no button is active
        if (buttonMatch && !this.activeButton) {
            this.showButton(buttonMatch);
        }
    }
    
    // Add a method to show the button
    showButton(buttonConfig) {
        // Create button element
        const button = document.createElement("button");
        button.innerText = buttonConfig.text || "Interact";
        button.classList.add("game-button");
        
        // Get the hero for positioning
        const hero = this.gameObjects["ben"];
        
        // Style the button
        button.style.position = "absolute";
        
        // Position the button above the character
        // We need to calculate screen position based on game coordinates
        // This assumes your game is centered in the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Center of the screen
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        
        button.style.left = `${centerX}px`;
        button.style.bottom = `${centerY + 50}px`; // Position above character
        button.style.transform = "translateX(-50%)";
        
        // Minimal white with black border styling
        button.style.padding = "8px 12px";
        button.style.backgroundColor = "white";
        button.style.color = "black";
        button.style.border = "2px solid black";
        button.style.borderRadius = "0px"; // Square corners for pixel look
        button.style.cursor = "pointer";
        
        // Pixelify Sans font styling
        button.style.fontFamily = "'Pixelify Sans', sans-serif";
        button.style.fontSize = "14px";
        button.style.letterSpacing = "1px";
        button.style.textTransform = "uppercase";
        button.style.fontWeight = "bold";
        
        // Add click event
        button.addEventListener("click", () => {
            if (buttonConfig.action === "startCutscene" && buttonConfig.events) {
                this.startCutscene(buttonConfig.events);
            } else if (buttonConfig.action === "custom" && typeof buttonConfig.callback === "function") {
                buttonConfig.callback();
            }
            
            // Remove button after clicking
            this.removeButton();
        });
        
        // Add to DOM
        document.body.appendChild(button);
        this.activeButton = button;
    }
    
    // Remove the button
    removeButton() {
        if (this.activeButton) {
            document.body.removeChild(this.activeButton);
            this.activeButton = null;
        }
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
            x: utils.withGrid(49.5),
            y: utils.withGrid(24), 
        },
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(5), 
                src: "images/characters/people/ben.png"
            }),
            // friend: new Person({
            //     isPlayerControlled: false,
            //     x: utils.withGrid(29),
            //     y: utils.withGrid(32),
            //     src: "images/characters/people/ben.png",
            //     behaviorLoop: [
            //         { type: "walk", direction: "up", duration: 2000 },
            //         { type: "stand", direction: "left", time: 7000 },
            //         { type: "walk", direction: "left", duration: 800 },
            //         { type: "stand", direction: "down", time: 7000 },
            //         { type: "walk", direction: "down", duration: 800 },
            //         { type: "walk", direction: "right", duration: 800 },
            //     ],
            //     talking: [
            //         {
            //             events: [
            //                 { type: "textMessage", text: "Hello, Ben!", faceHero: "friend" },
            //                 { type: "textMessage", text: "How are you doing?" }
            //             ]
            //         }
            //     ]
            // }),
        }, 
        walls: {
            
        },
        cutSceneSpaces: {
            [utils.asGridCoords(44, 28)]: [
                {
                    events: [
                        // { type: "changeMap", text: "Olá! Pronto para embarcar numa missão para proteger as águas de Portugal?" },
  
                    ]
                }
            ]
        },
        // Add button spaces
        buttonSpaces: {
            [utils.asGridCoords(53.5, 30)]: {
                text: "Flush",
                action: "startCutscene",
            
            }
        }
    },
}