/**
 * OverworldMap class
 * Represents a game map with game objects, walls, cutscenes, and interactive elements
 * Handles rendering, player movement, and game mechanics for each map
 */
class OverworldMap {
    /**
     * Create a new map
     * @param {string} id - Map identifier
     * @param {Object} config - Map configuration
     * @param {Object} config.gameObjects - Game objects to place on the map
     * @param {Object} config.walls - Wall positions as key-value pairs
     * @param {Object} config.spawnpoint - Starting point for the player
     * @param {Object} config.cutSceneSpaces - Trigger points for cutscenes
     * @param {Object} config.buttonSpaces - Trigger points for interactive buttons
     * @param {string} config.lowerSrc - Background image path
     * @param {string} config.upperSrc - Foreground image path
     */
    constructor(config) {
        this.id = config.id || null;  // Map identifier
        this.overworld = null;  // Reference to the overworld
        this.gameObjects = config.gameObjects;  // Game objects
        this.walls = config.walls || {};    // Walls
        this.spawmpoint = config.spawnpoint || {}; // Spawnpoint
        this.cutSceneSpaces = config.cutSceneSpaces || {}; // Cutscene spaces
        this.buttonSpaces = config.buttonSpaces || {}; // Button trigger spaces

        // Check if lowerSrc ends with .gif for animated backgrounds
        if (config.lowerSrc.endsWith('.gif')) {
            this.lowerAnimated = new AnimatedBackground(config.lowerSrc);
            // Create a dummy image for loading indicators
            this.lowerImage = new Image();
        } else {
            this.lowerImage = new Image();
            this.lowerImage.src = config.lowerSrc;
        }
        
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;  // Tree tops, Terraces etc

        this.isCutscenePlaying = false;
        this.activeButton = null; // Track if a button is currently active
        
        // Store spawnpoint coordinates if provided
        this.spawnpoint = config.spawnpoint || null;

        // Store if flush cutscene has started
        this.flushCutsceneStarted = false;
        
        // Create objective UI panel
        this.createObjectivePanel();
        this.talkedToOperator = false; 

        // Initialize keyboard support for buttons
        this.initKeyboardButtonSupport();
    }

    /**
     * Draw the lower layer (background) of the map
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} cameraPerson - Object to center the camera on
     */
    drawLowerImage(ctx, cameraPerson) {
        if (this.lowerAnimated) {
            this.lowerAnimated.draw(
                ctx, 
                utils.withGrid(10.5) - cameraPerson.x,
                utils.withGrid(6) - cameraPerson.y
            );
        } else {
            ctx.drawImage(this.lowerImage,
                utils.withGrid(10.5) - cameraPerson.x,
                utils.withGrid(6) - cameraPerson.y);
        }
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
        // Set flag to true at the start
        this.isCutscenePlaying = true;
        
        // Remove any active button when starting a cutscene
        this.removeButton();

        // Start a loop of events
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let eventHandler = new OverworldEvent({ map: this, event: event});
            await eventHandler.init();
        }

        // Set flag back to false when all events are complete
        this.isCutscenePlaying = false;

        // Reset NPC's to their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
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
            this.startCutscene(match.events);
        }
        
        // Also check for button spaces
        this.checkForButtonTrigger();
    }
    
    // New method to check if character is near a button trigger
    checkForButtonTrigger() {
        const hero = this.gameObjects["ben"];
        const buttonMatch = this.buttonSpaces[`${hero.x},${hero.y}`];
        
        // If there's no button match or we already have an active button
        if (!buttonMatch || this.activeButton) {
            if (!buttonMatch && this.activeButton) {
                this.removeButton();
            }
            return;
        }
        
        // Check if we're in Level1 map
        if (this.overworld && this.overworld.map === this) {
            const mapKey = Object.keys(window.OverworldMaps).find(key => 
                window.OverworldMaps[key] === this
            );
            
            // Use level-specific logic if available
            if (mapKey === "Level1" && Level1.checkForButtonTriggerLevel1) {
                const shouldShowButton = Level1.checkForButtonTriggerLevel1(this, hero, buttonMatch);
                if (shouldShowButton) {
                    this.showButton(buttonMatch);
                }
                return;
            }
        }

        // Default behavior for other levels/maps
        this.showButton(buttonMatch);
    }
    
    // Add a method to show the button
    showButton(buttonConfig) {
        // Create button element
        const button = document.createElement("button");
        button.innerText = buttonConfig.text || "Interact";
        button.classList.add("game-button");
        
        // Add data attribute to identify button type
        button.dataset.buttonType = buttonConfig.text;
        
        // Get the hero for positioning
        const hero = this.gameObjects["ben"];
        
        // Style the button
        button.style.position = "absolute";
        
        // Position the button above the character
        // We need to calculate screen position based on game coordinates
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Center of the screen
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        
        button.style.left = `${centerX}px`;
        button.style.bottom = `${centerY + 50}px`; // Position above character
        button.style.transform = "translateX(-50%)";
        
        // Enhanced button styling - bigger with thicker border
        button.style.padding = "14px 24px"; // Increased padding
        button.style.backgroundColor = "white";
        button.style.color = "#3c3c54";
        button.style.border = "4px solid black";// Thicker border
        button.style.borderColor = "#3c3c54";
        button.style.borderRadius = "0px"; // Square corners for pixel look
        button.style.cursor = "pointer";
        
        // Pixelify Sans font styling - bigger text
        button.style.fontFamily = "'Pixelify Sans', sans-serif";
        button.style.fontSize = "20px"; // Bigger font
        button.style.letterSpacing = "1px";
        button.style.textTransform = "uppercase";
        button.style.fontWeight = "bold";
        
        // Add hover effect
        button.style.transition = "all 0.2s ease";
        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#3c3c54";
            button.style.color = "white";
            button.style.border = "4px solid white";
        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "white";
            button.style.color = "#3c3c54";
            button.style.border = "4px solid black";// Thicker border
            button.style.borderColor = "#3c3c54";

        });
        
        // Add click event
        button.addEventListener("click", () => {
            if (buttonConfig.action === "startCutscene" && buttonConfig.events) {
                this.startCutscene(buttonConfig.events);
            } else if (
                buttonConfig.action === "custom" && 
                typeof buttonConfig.callback === "string" && 
                typeof this[buttonConfig.callback] === "function"
            ) {
                // Pass messages if defined
                if (buttonConfig.messages) {
                    this[buttonConfig.callback](buttonConfig.messages);
                } else {
                    this[buttonConfig.callback]();
                }
            } else if (
                buttonConfig.action === "custom" && 
                typeof buttonConfig.callback === "function"
            ) {
                buttonConfig.callback(this);
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
    
    // Public callback method for the "Flush" button.
    flushButtonCallbackHandler(messages) {
        if (this.flushCutsceneStarted) {
            return;
        } else {
            this.flushCutsceneStarted = true;
        }
        // Start showing the flush messages immediately
        Level1.showFlushMessages(this, messages);

        // Wait for flush messages to finish before changing the map
        const messagesTime = messages.length * 4000; // ~4 seconds per message (typing + pause)
        
        setTimeout(() => {
            // Ensure the button is removed before loading the new map
            this.removeButton();
            
            // Update the objective before changing maps
            this.updateObjective("Find where the water goes");
            
            // Change to Level1 map
            const newEvent = [ { type: "changeMap", map: "Level1" } ];
            this.startCutscene(newEvent);
            
            // After map change has completed, update the objective again
            setTimeout(() => {
                // The map reference has changed, so we need to access it through overworld
                if (this.overworld && this.overworld.map) {
                    this.overworld.map.updateObjective("Talk to water treatment operator");
                }
            }, 1000); // Give time for map to load
        }, messagesTime);
    }

    // Add method to create objective panel
    createObjectivePanel() {
        // First, find the game container
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) {
            console.error("Game container not found!");
            return;
        }
        
        // Remove existing panel if there is one
        if (document.querySelector('.objective-panel')) {
            document.querySelector('.objective-panel').remove();
        }
        
        // Create objective panel element
        const objectivePanel = document.createElement("div");
        objectivePanel.classList.add("objective-panel");
        
        // Style the panel
        objectivePanel.style.position = "absolute"; // Use absolute positioning relative to game container
        objectivePanel.style.top = "10px";
        objectivePanel.style.right = "10px";
        objectivePanel.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
        objectivePanel.style.border = "4px solid #3c3c54"; // Thinner border to fit in game container
        objectivePanel.style.borderRadius = "0px";  // Pixelated look
        objectivePanel.style.padding = "6px";
        objectivePanel.style.minWidth = "90px";
        objectivePanel.style.zIndex = "100";
        objectivePanel.style.transform = "scale(0.25)"; // Scale down to fit game container
        objectivePanel.style.transformOrigin = "top right"; // Scale from top right corner
        
        // Add header
        const header = document.createElement("div");
        header.textContent = "Mission:";
        header.style.fontSize = "25px";
        header.style.color = "#3c3c54";
        header.style.marginBottom = "4px";
        header.style.fontFamily = "'Pixelify Sans', sans-serif";
        objectivePanel.appendChild(header);
        
        // Add objective text
        const objectiveText = document.createElement("div");
        // Check if the current map is Level2 and set the default mission accordingly
        if (this.id === "Level2") {
            objectiveText.textContent = "Follow the operator to the computer.";

        } else if (this.id === "Level5") {
            objectiveText.textContent = "Talk to the operator one last time.";

        } else if (this.id === "Level3") {
            objectiveText.textContent = "Talk to the operator about filtration.";
        } else {
            console.log("Map id:", this.id);
            objectiveText.textContent = "Flush the toilet."; // Default mission for other maps
        }
        objectiveText.style.fontSize = "25px";
        objectiveText.style.color = "#3c3c54";
        objectiveText.style.fontFamily = "'Pixelify Sans', sans-serif";
        objectivePanel.appendChild(objectiveText);
        
        // Add panel to game container (not body)
        gameContainer.appendChild(objectivePanel);
        
        // Store reference to update later
        this.objectivePanel = objectivePanel;
        this.objectiveText = objectiveText;
    }
    
    /**
     * Method to update objective text
     * @param {string} text - New objective text to display
     */
    updateObjective(text) {
        if (this.objectiveText) {
            this.objectiveText.textContent = text;
        }
    }

    // Update the checkForButtonTrigger method to properly control when operator dialogue is available
    checkForButtonTrigger() {
        const hero = this.gameObjects["ben"];
        const buttonMatch = this.buttonSpaces[`${hero.x},${hero.y}`];
        
        // If there's no button match or we already have an active button
        if (!buttonMatch || this.activeButton) {
            if (!buttonMatch && this.activeButton) {
                this.removeButton();
            }
            return;
        }
        
        // Control access to operator dialogue based on game state
        if (buttonMatch.text === "Talk" && Level1.isOperatorPosition(this,hero.x, hero.y)) {
            // Check if all debris are collected
            const debrisCount = Object.keys(this.gameObjects).filter(key => key.startsWith("debris")).length;
            
            // Check if all coagulants are mixed
            const coagulantCount = Object.keys(this.gameObjects).filter(key => key.startsWith("coagulant")).length;
            
            // Check if all flocs are observed
            const observedFlocs = this.observedFlocs ? Object.keys(this.observedFlocs).length : 0;
            const totalFlocs = Object.keys(this.gameObjects).filter(key => key.startsWith("floc")).length;
            const allFlocsObserved = observedFlocs === totalFlocs && totalFlocs > 0;
            
            // Different stages of the game
            if (debrisCount > 0 && !this.talkedToOperator) {
                // Initial stage: Allow first conversation with operator
                this.showButton(buttonMatch);
            } else if (debrisCount > 0 && this.talkedToOperator) {
                // Still need to collect debris - don't allow talking to operator again
                return;
            } else if (debrisCount === 0 && !this.coagulantsStageStarted) {
                // Debris collected but coagulant stage not started - allow talking
                this.showButton(buttonMatch);
            } else if (coagulantCount > 0) {
                // Still need to mix coagulants - don't allow talking to operator
                return;
            } else if (coagulantCount === 0 && totalFlocs === 0) {
                // All coagulants mixed but flocs not added - allow talking
                this.showButton(buttonMatch);
            } else if (!allFlocsObserved) {
                // Still need to observe flocs - don't allow talking to operator
                return;
            } else {
                // All tasks completed - allow talking to operator
                this.showButton(buttonMatch);
            }
        } else if (buttonMatch.text === "Add Coagulants" && !this.coagulantsStageStarted) {
            // Don't show coagulant button until stage is started
            return;
        } else if (buttonMatch.text === "Collect" && !this.talkedToOperator) {
            // Don't show collect button until operator is talked to
            return;
        } else {
            // For all other buttons (Collect, Mix, Observe), show them if conditions are met
            this.showButton(buttonMatch);
        }
    }

    // Add this method to the OverworldMap class
    initKeyboardButtonSupport() {
        document.addEventListener('keydown', (e) => {
            // Check if space key was pressed and there's an active button
            if (e.code === 'Space' && this.activeButton) {
                // Now we'll allow Talk buttons to be activated by space
                console.log("Space key pressed - activating button:", this.activeButton.dataset.buttonType);
                
                // If a cutscene is playing, don't allow additional button clicks
                if (this.isCutscenePlaying) {
                    console.log("Cutscene is playing - ignoring button activation");
                    return;
                }
                
                // Simulate a click on the active button
                this.activeButton.click();
                
                // Prevent default space behavior (like page scrolling)
                e.preventDefault();
            }
        });
    }
}

/**
 * Game map definitions
 * Contains all level maps with their properties, objects, and interaction points
 */
window.OverworldMaps = {
    /**
     * Bathroom level - Starting point of the game
     * Player begins here and flushes the toilet to start their journey
     */
    Bathroom: {
        id: "Bathroom",
        lowerSrc: "images/maps/BathroomLower.png",
        upperSrc: "images/maps/BathroomUpper.png",
        spawnpoint: {
            x: utils.withGrid(49.5),
            y: utils.withGrid(24), 
        },
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(5), 
                src: "images/characters/people/mainCharacter.png"
            }),
        }, 
        walls: wallsHouse,
        cutSceneSpaces: {},
        buttonSpaces: {
            [utils.asGridCoords(53.5, 30)]: {
                text: "Flush",
                action: "custom",
                callback: "flushButtonCallbackHandler",
                messages: [
                    "Every drop counts... but where does it go?",
                    "Every day, Lisbon treats over 550 million liters of water...",
                    "From your home to the treatment plant, every flush tells a story...",
                    "What you waste ... must be cleaned."
                ]
            }
        },
    },
    
    // New Level1 map
    Level1: {
        id: "Level1",
        lowerSrc: "images/maps/Level1Lower.png", 
        upperSrc: "images/maps/Level1Upper.png", 
        spawnpoint: { 
            x: utils.withGrid(34.5),
            y: utils.withGrid(19),
        },
        gameObjects: level1GameObjects,
        walls: level1Walls,
        buttonSpaces: {

            // Talking to operator event (35.5, 19)
            [utils.asGridCoords(32.5, 18)]: introLevel1Event,
            [utils.asGridCoords(33.5, 17)]: introLevel1Event,

            // Button spaces for the debris items
            // Debris 1: (42.5, 21)
            [utils.asGridCoords(42.5, 20)]: collectDebris1Event,
            [utils.asGridCoords(42.5, 22)]: collectDebris1Event,
            [utils.asGridCoords(41.5, 21)]: collectDebris1Event,
            [utils.asGridCoords(43.5, 21)]: collectDebris1Event,

            // Debris 2: (41.5, 23)
            [utils.asGridCoords(41.5, 22)]: collectDebris2Event,
            [utils.asGridCoords(41.5, 24)]: collectDebris2Event,
            [utils.asGridCoords(40.5, 23)]: collectDebris2Event,
            [utils.asGridCoords(42.5, 23)]: collectDebris2Event,

            // Debris 3: (38.5, 21)
            [utils.asGridCoords(38.5, 20)]: collectDebris3Event,
            [utils.asGridCoords(38.5, 22)]: collectDebris3Event,
            [utils.asGridCoords(37.5, 21)]: collectDebris3Event,
            [utils.asGridCoords(39.5, 21)]: collectDebris3Event,

            // Debris 4 (40.5, 19)
            [utils.asGridCoords(40.5, 18)]: collectDebris4Event,
            [utils.asGridCoords(40.5, 20)]: collectDebris4Event,
            [utils.asGridCoords(39.5, 19)]: collectDebris4Event,
            [utils.asGridCoords(41.5, 19)]: collectDebris4Event,

            // Update the faucet button action to change the mission right away
            [utils.asGridCoords(34.5, 12)]: startCoagulantsEvent,
        },
        cutSceneSpaces: {
            // Add our teleport event
            [utils.asGridCoords(36.5, 16)]: teleportToLevel5Event,
            // Transition spots - If player is underwater and steps on those positions, change his sprite to land
            [utils.asGridCoords(36.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(37.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(38.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(41.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(42.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 18)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 19)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 20)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 21)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 22)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 23)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(35.5, 24)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(40.5, 16)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(40.5, 16)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(39.5, 16)]: Level1.changeSpriteEvent("Level1", "land"),
            // Transition spots - If player is on land and steps on those positions, change his sprite to underwater
            [utils.asGridCoords(36.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(36.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(37.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(38.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(41.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(42.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(43.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(39.5, 17)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(40.5, 17)]: Level1.changeSpriteEvent("Level1", "underwater"),
            // Change Map position
            [utils.asGridCoords(34.5, 25)]: initLevel2Event,
            [utils.asGridCoords(33.5, 25)]: initLevel2Event,
            [utils.asGridCoords(32.5, 25)]: initLevel2Event,
        }
    },
    Level2: {
        id: "Level2",
        lowerSrc: "images/maps/Level2Lower.png", 
        upperSrc: "images/maps/Level2Upper.png", 
        spawnpoint: {
            x: utils.withGrid(35.5),
            y: utils.withGrid(17),
        },
        gameObjects: level2GameObjects,
        walls: level2Walls,
        cutSceneSpaces: {
            // Transition spots - If player is underwater and steps on those positions, change his sprite to land
            [utils.asGridCoords(33.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 18)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 19)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 20)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 21)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 22)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 23)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 24)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 25)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(32.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(33.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(32.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(31.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(30.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(29.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            [utils.asGridCoords(28.5, 17)]: Level1.changeSpriteEvent("Level1", "land"),
            // Transition spots - If player is on land and steps on those positions, change his sprite to underwater
            [utils.asGridCoords(32.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 18)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 19)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 20)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 21)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 22)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 23)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 24)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(32.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(31.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(30.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(29.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(28.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),
            [utils.asGridCoords(27.5, 25)]: Level1.changeSpriteEvent("Level1", "underwater"),

            // Change Map position
            [utils.asGridCoords(34.5, 26)]: initLevel3Event,
            [utils.asGridCoords(35.5, 26)]: initLevel3Event,
            },
        buttonSpaces: {
            [utils.asGridCoords(37.5, 23)]: observeSedimentationEvent,
        },
    },

    Level3: {
        id: "Level3",
        lowerSrc: "images/maps/Level3Lower.png", 
        upperSrc: "images/maps/Level3Upper.png", 
        spawnpoint: {
            x: utils.withGrid(28.5),
            y: utils.withGrid(17),
        },
        gameObjects: level3GameObjects,
        walls: level3Walls,
        cutSceneSpaces: {},
        buttonSpaces: {
            [utils.asGridCoords(27.5, 22)]: OperatorTalk, // Top
            [utils.asGridCoords(26.5, 23)]: OperatorTalk, // Left  
            [utils.asGridCoords(28.5, 23)]: OperatorTalk, // Right
            [utils.asGridCoords(27.5, 24)]: OperatorTalk, // Bottom
        },
    },

    Level4: {
        id: "Level4",
        lowerSrc: "images/maps/Level4Lower.png", 
        upperSrc: "images/maps/Level4Overlay.png", 
        spawnpoint: {
            x: utils.withGrid(36),
            y: utils.withGrid(17),
        },
        gameObjects: level4GameObjects,
        walls: level4Walls,
        cutSceneSpaces: {},
        buttonSpaces: {},
    },

    /**
     * Level5 - Advanced water treatment facility
     * Represents the advanced treatment processes that water undergoes
     * Features an operator NPC who explains advanced water treatment
     */
    Level5: {
        id: "Level5",
        lowerSrc: "images/maps/Level5Lower.png", 
        upperSrc: "images/maps/Level5Upper.png", 
        spawnpoint: {
            // Center of the map between coordinates 23 and 38 horizontally, and 17 and 27 vertically
            x: utils.withGrid(30.5), // Midpoint between 23 and 38
            y: utils.withGrid(22),   // Midpoint between 17 and 27
        },
        gameObjects: {
            // Player character
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(30.5),
                y: utils.withGrid(22), 
                src: "images/characters/people/mainCharacter.png"
            }),
            // Operator NPC who explains advanced water treatment
            operator: new Person({
                x: utils.withGrid(31.5),
                y: utils.withGrid(20),
                src: "images/characters/people/operator.png",
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 2000 },
                    { type: "stand", direction: "right", time: 1000 },
                    { type: "stand", direction: "down", time: 2000 },
                    { type: "stand", direction: "left", time: 1000 },
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Welcome to the lifeblood of our community. From the bustling streets of Lisbon to serene farms like this,", faceHero: "operator" },
                            { type: "textMessage", text: "our mission is to deliver clean, safe water to every home, field, and creature." },
                            { type: "textMessage", text: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines," },
                            { type: "textMessage", text: "connecting 13 reservoirs and managed by 11 pumping stations." },
                            { type: "textMessage", text: "This extensive system ensures that around 104,285 supply branches efficiently deliver water throughout the city." },
                            { type: "textMessage", text: "Our journey doesn't end at purification." },
                            { type: "textMessage", text: "Continuous monitoring and maintenance prevent leaks and ensure optimal pressure," },
                            { type: "textMessage", text: "By understanding and supporting this system, you help Lisbon thrive." },
                            { type: "textMessage", text: "Now, let's see if you've learned anything from this journey. Are you ready for a quick test?" },
                            { 
                                type: "custom", 
                                action: (map) => {
                                    // Set a flag indicating player has talked to the operator
                                    map.talkedToOperator = true;
                                    
                                    // Start the quiz after talking to the operator
                                    Level5.startQuiz(map);
                                    
                                    // Update objective once conversation is complete
                                    if (map && map.updateObjective) {
                                        map.updateObjective("Complete the water knowledge quiz.");
                                    }
                                }
                            }
                        ]
                    }
                ]
            }),
        },
        walls: level5Walls,
        cutSceneSpaces: {
            // Set objective when entering the map
            [utils.asGridCoords(30.5, 22)]: {
                events: [
                    { 
                        type: "custom", 
                        action: (map) => {
                            // Reset the talkedToOperator flag when entering the map
                            map.talkedToOperator = false;
                            
                            // Update objective when player spawns to make the mission clear
                            if (map && map.updateObjective) {
                                map.updateObjective("Talk to the operator one last time.");
                            }
                        }
                    }
                ]
            },
            // Exit point to return to Level1
            [utils.asGridCoords(30, 26)]: {
                events: [
                    { type: "textMessage", text: "Return to the treatment plant?" },
                    { 
                        type: "custom",
                        action: (map) => {
                            // Create fade overlay for transition
                            const fadeOverlay = document.createElement("div");
                            fadeOverlay.style.position = "fixed";
                            fadeOverlay.style.top = "0";
                            fadeOverlay.style.left = "0";
                            fadeOverlay.style.width = "100%";
                            fadeOverlay.style.height = "100%";
                            fadeOverlay.style.backgroundColor = "black";
                            fadeOverlay.style.opacity = "0";
                            fadeOverlay.style.transition = "opacity 1.5s ease";
                            fadeOverlay.style.zIndex = "1000";
                            document.body.appendChild(fadeOverlay);
                            
                            // Fade transition sequence
                            setTimeout(() => {
                                fadeOverlay.style.opacity = "1";
                                
                                setTimeout(() => {
                                    // Return to Level1
                                    map.startCutscene([
                                        { type: "changeMap", map: "Level1" }
                                    ]);
                                    
                                    setTimeout(() => {
                                        fadeOverlay.style.opacity = "0";
                                        
                                        setTimeout(() => {
                                            document.body.removeChild(fadeOverlay);
                                        }, 1500);
                                    }, 500);
                                }, 1500);
                            }, 50);
                        }
                    }
                ]
            }
        },
        buttonSpaces: {
            // Talk button positions all around the operator
            [utils.asGridCoords(30.5, 20)]: {
                text: "Talk",
                action: "startCutscene",
                events: [
                            { type: "textMessage", text: "Welcome to the lifeblood of our community. From the bustling streets of Lisbon to serene farms like this,", faceHero: "operator" },
                            { type: "textMessage", text: "our mission is to deliver clean, safe water to every home, field, and creature." },
                            { type: "textMessage", text: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines," },
                            { type: "textMessage", text: "connecting 13 reservoirs and managed by 11 pumping stations." },
                            { type: "textMessage", text: "This extensive system ensures that around 104,285 supply branches efficiently deliver water throughout the city." },
                            { type: "textMessage", text: "Our journey doesn't end at purification." },
                            { type: "textMessage", text: "Continuous monitoring and maintenance prevent leaks and ensure optimal pressure," },
                            { type: "textMessage", text: "By understanding and supporting this system, you help Lisbon thrive." },
                            { type: "textMessage", text: "Now, let's see if you've learned anything from this journey. Are you ready for a quick test?" },
                    { 
                        type: "custom", 
                        action: (map) => {
                            // Set flag that player has talked to operator
                            map.talkedToOperator = true;
                            
                            // Start the quiz after clicking the Talk button
                            Level5.startQuiz(map);
                            
                            // Update objective once conversation is complete
                            if (map && map.updateObjective) {
                                map.updateObjective("Complete the water knowledge quiz.");
                            }
                        }
                    }
                ]
            },
            [utils.asGridCoords(31.5, 21)]: {
                text: "Talk",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "Welcome to the lifeblood of our community. From the bustling streets of Lisbon to serene farms like this,", faceHero: "operator" },
                            { type: "textMessage", text: "our mission is to deliver clean, safe water to every home, field, and creature." },
                            { type: "textMessage", text: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines," },
                            { type: "textMessage", text: "connecting 13 reservoirs and managed by 11 pumping stations." },
                            { type: "textMessage", text: "This extensive system ensures that around 104,285 supply branches efficiently deliver water throughout the city." },
                            { type: "textMessage", text: "Our journey doesn't end at purification." },
                            { type: "textMessage", text: "Continuous monitoring and maintenance prevent leaks and ensure optimal pressure," },
                            { type: "textMessage", text: "By understanding and supporting this system, you help Lisbon thrive." },
                            { type: "textMessage", text: "Now, let's see if you've learned anything from this journey. Are you ready for a quick test?" },
                    { 
                        type: "custom", 
                        action: (map) => {
                            // Set flag that player has talked to operator
                            map.talkedToOperator = true;
                            
                            // Start the quiz after clicking the Talk button
                            Level5.startQuiz(map);
                            
                            // Update objective once conversation is complete
                            if (map && map.updateObjective) {
                                map.updateObjective("Complete the water knowledge quiz.");
                            }
                        }
                    }
                ]
            },
            [utils.asGridCoords(32.5, 20)]: {
                text: "Talk",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "Welcome to the lifeblood of our community. From the bustling streets of Lisbon to serene farms like this,", faceHero: "operator" },
                            { type: "textMessage", text: "our mission is to deliver clean, safe water to every home, field, and creature." },
                            { type: "textMessage", text: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines," },
                            { type: "textMessage", text: "connecting 13 reservoirs and managed by 11 pumping stations." },
                            { type: "textMessage", text: "This extensive system ensures that around 104,285 supply branches efficiently deliver water throughout the city." },
                            { type: "textMessage", text: "Our journey doesn't end at purification." },
                            { type: "textMessage", text: "Continuous monitoring and maintenance prevent leaks and ensure optimal pressure," },
                            { type: "textMessage", text: "By understanding and supporting this system, you help Lisbon thrive." },
                            { type: "textMessage", text: "Now, let's see if you've learned anything from this journey. Are you ready for a quick test?" },
                    { 
                        type: "custom", 
                        action: (map) => {
                            // Set flag that player has talked to operator
                            map.talkedToOperator = true;
                            
                            // Start the quiz after clicking the Talk button
                            Level5.startQuiz(map);
                            
                            // Update objective once conversation is complete
                            if (map && map.updateObjective) {
                                map.updateObjective("Complete the water knowledge quiz.");
                            }
                        }
                    }
                ]
            },
            [utils.asGridCoords(31.5, 19)]: {
                text: "Talk",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "Welcome to the lifeblood of our community. From the bustling streets of Lisbon to serene farms like this,", faceHero: "operator" },
                            { type: "textMessage", text: "our mission is to deliver clean, safe water to every home, field, and creature." },
                            { type: "textMessage", text: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines," },
                            { type: "textMessage", text: "connecting 13 reservoirs and managed by 11 pumping stations." },
                            { type: "textMessage", text: "This extensive system ensures that around 104,285 supply branches efficiently deliver water throughout the city." },
                            { type: "textMessage", text: "Our journey doesn't end at purification." },
                            { type: "textMessage", text: "Continuous monitoring and maintenance prevent leaks and ensure optimal pressure," },
                            { type: "textMessage", text: "By understanding and supporting this system, you help Lisbon thrive." },
                            { type: "textMessage", text: "Now, let's see if you've learned anything from this journey. Are you ready for a quick test?" },
                            { 
                        type: "custom", 
                        action: (map) => {
                            // Set flag that player has talked to operator
                            map.talkedToOperator = true;
                            
                            // Start the quiz after clicking the Talk button
                            Level5.startQuiz(map);
                            
                            // Update objective once conversation is complete
                            if (map && map.updateObjective) {
                                map.updateObjective("Complete the water knowledge quiz.");
                            }
                        }
                    }
                ]
            },
        },
        
        // Add conditional method to check if button should be shown
        checkForButtonTrigger() {
            const hero = this.gameObjects["ben"];
            const buttonMatch = this.buttonSpaces[`${hero.x},${hero.y}`];
            
            // If there's no button match or we already have an active button
            if (!buttonMatch || this.activeButton) {
                if (!buttonMatch && this.activeButton) {
                    this.removeButton();
                }
                return;
            }
            
            // Special case for Take Quiz button - only show after talking to operator
            if (buttonMatch.text === "Take Quiz" && !this.talkedToOperator) {
                return;
            }
            
            // For Talk button, always show it
            if (buttonMatch.text === "Talk") {
                this.showButton(buttonMatch);
                return;
            }
            
            // For custom callback buttons, check if the callback returns false
            if (buttonMatch.action === "custom" && typeof buttonMatch.callback === "function") {
                const shouldShow = buttonMatch.callback(this);
                if (shouldShow === false) return;
            }
            
            // Default behavior - show the button
            this.showButton(buttonMatch);
        }
    }
}
