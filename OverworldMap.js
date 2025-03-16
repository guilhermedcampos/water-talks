class OverworldMap {
    constructor(config) {
        this.overworld = null;  // Reference to the overworld
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
        
        // Create objective UI panel
        this.createObjectivePanel();
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

    // Helper: Types out a message character by character.
    typeText(message, textContainer, typingSound, typingSpeed, callback) {
        textContainer.innerHTML = "";
        let i = 0;
        // Start the typing sound immediately
        typingSound.currentTime = 0;
        typingSound.play();
        
        const typing = setInterval(() => {
            if (i < message.length) {
                textContainer.innerHTML += message.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                // Stop typing sound when done
                typingSound.pause();
                typingSound.currentTime = 0;
                setTimeout(() => {
                    callback();
                }, 2000); // Wait 2 seconds after message is complete
            }
        }, typingSpeed);
    }

    // Displays the series of flush messages with fade in/out effects
    showFlushMessages(messages) {
        // Use provided messages, or fallback to a default if not set
        messages = messages || [
            "Every drop counts... but where does it go?",
            "Every day, Lisbon treats over 550 million liters of water...",
            "From your home to the treatment plant, every flush tells a story...",
            "What you waste ... must be cleaned."
        ];
        
        // Create fade overlay element
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
        
        // Create the typing sound element
        const typingSound = new Audio("sounds/typing.mp3");
        typingSound.loop = true;
        typingSound.volume = 0.5;
        
        // Trigger fade in
        setTimeout(() => {
            fadeOverlay.style.opacity = "1";
            
            // After fade is complete, show text messages
            setTimeout(() => {
                // Create text container element
                const textContainer = document.createElement("div");
                textContainer.style.position = "fixed";
                textContainer.style.top = "50%";
                textContainer.style.left = "50%";
                textContainer.style.transform = "translate(-50%, -50%)";
                textContainer.style.width = "80%";
                textContainer.style.maxWidth = "800px";
                textContainer.style.color = "white";
                textContainer.style.fontFamily = "'Pixelify Sans', sans-serif";
                textContainer.style.fontSize = "24px";
                textContainer.style.lineHeight = "1.6";
                textContainer.style.textAlign = "center";
                textContainer.style.zIndex = "1001";
                document.body.appendChild(textContainer);
                
                const typingSpeed = 50;
                // Recursive function to display messages in sequence
                const showMessages = (index) => {
                    if (index < messages.length) {
                        this.typeText(messages[index], textContainer, typingSound, typingSpeed, () => {
                            showMessages(index + 1);
                        });
                    } else {
                        // All messages are shown – fade out text and overlay
                        setTimeout(() => {
                            textContainer.style.transition = "opacity 1.5s ease";
                            textContainer.style.opacity = "0";
                            fadeOverlay.style.opacity = "0";
                            
                            // Remove elements after fade out
                            setTimeout(() => {
                                document.body.removeChild(textContainer);
                                document.body.removeChild(fadeOverlay);
                            }, 1500);
                        }, 1000);
                    }
                };
                
                // Start showing messages
                showMessages(0);
                
            }, 1500); // Wait 1.5 seconds for fade in to complete
        }, 50); // Initial slight delay

    }
    
    // Public callback method for the "Flush" button.
    flushButtonCallbackHandler(messages) {
        // Start showing the flush messages immediately
        this.showFlushMessages(messages);

        // Wait for flush messages to finish before changing the map
        // We need to calculate total wait time based on messages length and display time
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
                    this.overworld.map.updateObjective("Talk to the Water Treatment Operator");
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
        objectiveText.textContent = "Flush the toilet";
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
    
    // Method to update objective text
    updateObjective(text) {
        if (this.objectiveText) {
            this.objectiveText.textContent = text;
        }
    }

    // Add this method to check if all debris has been collected
    checkDebrisCollected() {
        // Check if all three debris objects are gone
        const debrisCount = Object.keys(this.gameObjects).filter(key => 
            key.startsWith("debris")
        ).length;
        
        if (debrisCount === 0) {
            // All debris collected, update objective
            this.updateObjective("Return to the operator");
            
            // Update the operator's dialogue to acknowledge completion
            if (this.gameObjects["operator"]) {
                // Add a "talk" button space at the operator position with new dialogue
                this.buttonSpaces[utils.asGridCoords(27.5, 15)] = {
                    text: "Talk",
                    action: "startCutscene",
                    events: [
                        { type: "textMessage", text: "Excellent work! You've cleaned up all the visible debris.", faceHero: "operator" },
                        { type: "textMessage", text: "This is just the first step in water treatment." },
                        { type: "textMessage", text: "Next, we need to filter out smaller particles that aren't visible to the naked eye." },
                        { 
                            type: "custom",
                            action: (map) => {
                                map.updateObjective("Filtration Station: Learn about water filtration");
                            }
                        }
                    ]
                };
                
                // Update all other operator button spaces with the same dialogue
                this.buttonSpaces[utils.asGridCoords(27.5, 17)] = {...this.buttonSpaces[utils.asGridCoords(27.5, 15)]};
                this.buttonSpaces[utils.asGridCoords(26.5, 16)] = {...this.buttonSpaces[utils.asGridCoords(27.5, 15)]};
                this.buttonSpaces[utils.asGridCoords(28.5, 16)] = {...this.buttonSpaces[utils.asGridCoords(27.5, 15)]};
            }
        } else {
            // Update how many pieces of debris are left
            this.updateObjective(`Surface Sweep: ${debrisCount} pieces of debris remaining`);
        }
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
                src: "images/characters/people/mainCharacter.png"
            }),
        }, 
        walls: {
            // Horizontal walls (top)
            [utils.asGridCoords(45.5, 21)]: true,
            [utils.asGridCoords(46.5, 21)]: true,
            [utils.asGridCoords(47.5, 21)]: true,
            [utils.asGridCoords(48.5, 21)]: true,
            [utils.asGridCoords(49.5, 21)]: true,
            [utils.asGridCoords(50.5, 21)]: true,
            [utils.asGridCoords(51.5, 21)]: true,
            [utils.asGridCoords(52.5, 21)]: true,
            [utils.asGridCoords(53.5, 21)]: true,
            [utils.asGridCoords(54.5, 21)]: true,

            
            // Horizontal walls (bottom)
            [utils.asGridCoords(45.5, 33)]: true,
            [utils.asGridCoords(46.5, 33)]: true,
            [utils.asGridCoords(47.5, 33)]: true,
            [utils.asGridCoords(48.5, 33)]: true,
            [utils.asGridCoords(49.5, 33)]: true,
            [utils.asGridCoords(50.5, 33)]: true,
            [utils.asGridCoords(51.5, 33)]: true,
            [utils.asGridCoords(52.5, 33)]: true,
            [utils.asGridCoords(53.5, 33)]: true,
            [utils.asGridCoords(54.5, 33)]: true,

            // Inner Horizontal walls
            [utils.asGridCoords(45.5, 28)]: true,
            [utils.asGridCoords(46.5, 28)]: true,
            [utils.asGridCoords(47.5, 28)]: true,
            [utils.asGridCoords(48.5, 28)]: true,
            [utils.asGridCoords(50.5, 28)]: true,
            [utils.asGridCoords(50.5, 29)]: true,
            [utils.asGridCoords(51.5, 28)]: true,
            [utils.asGridCoords(51.5, 29)]: true,
            [utils.asGridCoords(52.5, 28)]: true,
            [utils.asGridCoords(52.5, 29)]: true,
            [utils.asGridCoords(53.5, 28)]: true,
            [utils.asGridCoords(53.5, 29)]: true,
            [utils.asGridCoords(54.5, 28)]: true,

            // Vertical walls (right)
            [utils.asGridCoords(54.5, 21)]: true,
            [utils.asGridCoords(54.5, 22)]: true,
            [utils.asGridCoords(54.5, 23)]: true,
            [utils.asGridCoords(54.5, 24)]: true,
            [utils.asGridCoords(54.5, 25)]: true,
            [utils.asGridCoords(54.5, 26)]: true,
            [utils.asGridCoords(54.5, 27)]: true,
            [utils.asGridCoords(54.5, 28)]: true,
            [utils.asGridCoords(54.5, 29)]: true,
            [utils.asGridCoords(54.5, 30)]: true,
            [utils.asGridCoords(54.5, 31)]: true,
            [utils.asGridCoords(54.5, 32)]: true,

            // Vertical walls (left)
            [utils.asGridCoords(44.5, 21)]: true,
            [utils.asGridCoords(44.5, 22)]: true,
            [utils.asGridCoords(44.5, 23)]: true,
            [utils.asGridCoords(44.5, 24)]: true,
            [utils.asGridCoords(44.5, 25)]: true,
            [utils.asGridCoords(44.5, 26)]: true,
            [utils.asGridCoords(44.5, 27)]: true,
            [utils.asGridCoords(44.5, 28)]: true,
            [utils.asGridCoords(44.5, 29)]: true,
            [utils.asGridCoords(44.5, 30)]: true,
            [utils.asGridCoords(44.5, 31)]: true,
            [utils.asGridCoords(44.5, 32)]: true,

        },
        cutSceneSpaces: {
            
        },
        // Refactored buttonSpaces: the callback is now a string key
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
        }
    },
    
    // New Level1 map
    Level1: {
        lowerSrc: "images/maps/Level1Lower.png", 
        upperSrc: "images/maps/Level1Upper.png", 
        spawnpoint: { // 464 208
            x: utils.withGrid(29.5),
            y: utils.withGrid(13),
        },
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5), 
                src: "images/characters/people/mainCharacter.png"
            }),
            
            // Update the operator in the Level1 map
            operator: new Person({
                x: utils.withGrid(27.5),
                y: utils.withGrid(13),
                src: "images/characters/people/operator.png",
                // Make the operator stand still by using a simple behavior loop
                // with only one standing direction for a very long time
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ],
                // Remove the talking property so it doesn't automatically trigger
            }),
            // Add water debris items that float on the water
            debris1: new Person({
                x: utils.withGrid(28.5),
                y: utils.withGrid(18),
                src: "images/characters/objects/water_debris1.png", // Create 32x32 debris image
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            }),
            debris2: new Person({
                x: utils.withGrid(31.5),
                y: utils.withGrid(19),
                src: "images/characters/objects/water_debris2.png", // Create another debris image
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            }),
            debris3: new Person({
                x: utils.withGrid(25.5),
                y: utils.withGrid(20),
                src: "images/characters/objects/water_debris3.png", // Create a third debris image
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            })
        },
        walls: {
            [utils.asGridCoords(23.5, 10)]: true, // 368 160
            [utils.asGridCoords(25.5, 14)]: true,
            [utils.asGridCoords(24.5, 14)]: true,
            [utils.asGridCoords(24.5, 15)]: true,
            [utils.asGridCoords(24.5, 13)]: true,
            [utils.asGridCoords(24.5, 12)]: true,
            [utils.asGridCoords(24.5, 11)]: true,
            [utils.asGridCoords(24.5, 10)]: true,
            [utils.asGridCoords(25.5, 10)]: true,
            [utils.asGridCoords(26.5, 10)]: true,
            [utils.asGridCoords(27.5, 10)]: true, // 432 160
            [utils.asGridCoords(28.5, 10)]: true, // 448 160
            [utils.asGridCoords(29.5, 10)]: true, // 464 160
            [utils.asGridCoords(30.5, 10)]: true, // 480 160
            [utils.asGridCoords(31.5, 10)]: true, // 496 160
            [utils.asGridCoords(32.5, 10)]: true, // 512 160
            [utils.asGridCoords(33.5, 10)]: true, // 528 160
            [utils.asGridCoords(34.5, 10)]: true, // 544 160
            [utils.asGridCoords(35.5, 10)]: true, // 560 160
            [utils.asGridCoords(36.5, 10)]: true, // 576 160
            [utils.asGridCoords(37.5, 10)]: true, // 592 160
            [utils.asGridCoords(38.5, 10)]: true, // 608 160
            [utils.asGridCoords(38.5, 11)]: true, // 608 176
            [utils.asGridCoords(38.5, 12)]: true, // 608 192
            [utils.asGridCoords(38.5, 13)]: true, // 608 208
            [utils.asGridCoords(38.5, 14)]: true, // 608 224
            [utils.asGridCoords(38.5, 15)]: true, // 608 240
            [utils.asGridCoords(38.5, 16)]: true, // 608 256
            [utils.asGridCoords(38.5, 17)]: true, // 608 272
            [utils.asGridCoords(38.5, 18)]: true, // 608 288
            [utils.asGridCoords(38.5, 19)]: true, // 608 304
            [utils.asGridCoords(38.5, 20)]: true, // 608 320
            [utils.asGridCoords(38.5, 21)]: true, // 608 336
            [utils.asGridCoords(38.5, 22)]: true, // 608 352
            [utils.asGridCoords(37.5, 22)]: true, // 592 352
            [utils.asGridCoords(36.5, 22)]: true, // 576 352
            [utils.asGridCoords(35.5, 22)]: true, // 560 352
            [utils.asGridCoords(34.5, 22)]: true, // 544 352
            [utils.asGridCoords(33.5, 22)]: true, // 528 352
            [utils.asGridCoords(32.5, 22)]: true, // 512 352
            [utils.asGridCoords(31.5, 22)]: true, // 496 352
            [utils.asGridCoords(30.5, 22)]: true, // 480 352
            [utils.asGridCoords(29.5, 22)]: true, // 464 352
            [utils.asGridCoords(28.5, 22)]: true, // 448 352
            [utils.asGridCoords(27.5, 22)]: true, // 432 352
            [utils.asGridCoords(26.5, 22)]: true, // 416 352
            [utils.asGridCoords(25.5, 22)]: true, // 400 352
            [utils.asGridCoords(24.5, 22)]: true, // 384 352
            [utils.asGridCoords(23.5, 22)]: true, // 368 352
            [utils.asGridCoords(22.5, 22)]: true, // 352 352
            [utils.asGridCoords(22.5, 21)]: true, // 352 336
            [utils.asGridCoords(22.5, 20)]: true, // 352 320
            [utils.asGridCoords(22.5, 19)]: true, // 352 304
            [utils.asGridCoords(22.5, 18)]: true, // 352 288
            [utils.asGridCoords(22.5, 17)]: true, // 352 272
            [utils.asGridCoords(22.5, 16)]: true, // 352 256
            [utils.asGridCoords(22.5, 15)]: true, // 352 240
            [utils.asGridCoords(22.5, 14)]: true, // 352 224
            [utils.asGridCoords(22.5, 13)]: true, // 352 208
            [utils.asGridCoords(22.5, 12)]: true, // 352 192
            [utils.asGridCoords(22.5, 11)]: true, // 352 176
            [utils.asGridCoords(22.5, 10)]: true, // 352 160
            [utils.asGridCoords(29.5, 11)]: true,  // 464 176
            [utils.asGridCoords(39.5, 11)]: true,  // 560  176
            [utils.asGridCoords(39.5, 12)]: true,  // 560  192
            [utils.asGridCoords(40.5, 12)]: true,  // 576  192
            [utils.asGridCoords(40.5, 13)]: true,  // 576  208
            [utils.asGridCoords(41.5, 13)]: true,  // 592  208
            [utils.asGridCoords(41.5, 14)]: true,  // 592  224
            [utils.asGridCoords(41.5, 15)]: true,  // 592  240
            [utils.asGridCoords(41.5, 18)]: true,  // 592  288
            [utils.asGridCoords(41.5, 16)]: true,  // 592  256
            [utils.asGridCoords(41.5, 18)]: true,  // 592  288
            [utils.asGridCoords(41.5, 17)]: true,  // 592  272
            [utils.asGridCoords(41.5, 19)]: true,  // 592  304
            [utils.asGridCoords(41.5, 20)]: true,  // 592  320
            [utils.asGridCoords(41.5, 21)]: true,  // 592  336
            [utils.asGridCoords(40.5, 21)]: true,  // 576  336
            [utils.asGridCoords(40.5, 20)]: true,  // 576  320
            [utils.asGridCoords(39.5, 20)]: true,  // 560  320
            [utils.asGridCoords(35.5, 12)]: true,  // 560  192
            [utils.asGridCoords(35.5, 11)]: true,  // 560  176
            [utils.asGridCoords(36.5, 11)]: true,  // 576  176
            [utils.asGridCoords(36.5, 13)]: true,  // 576  208
            [utils.asGridCoords(37.5, 11)]: true,  // 592  176
            [utils.asGridCoords(37.5, 12)]: true,  // 592  192
            [utils.asGridCoords(37.5, 13)]: true,  // 592  208
            [utils.asGridCoords(37.5, 14)]: true,  // 592  224
            [utils.asGridCoords(37.5, 15)]: true,  // 592  240
            [utils.asGridCoords(37.5, 16)]: true,  // 592  256
            [utils.asGridCoords(37.5, 17)]: true,  // 592  272
            [utils.asGridCoords(37.5, 18)]: true,  // 592  288
            [utils.asGridCoords(37.5, 19)]: true,  // 592  304
            [utils.asGridCoords(37.5, 20)]: true,  // 592  320
            [utils.asGridCoords(37.5, 21)]: true,  // 592  336
            [utils.asGridCoords(36.5, 21)]: true,  // 576  336
            [utils.asGridCoords(35.5, 20)]: true,  // 560  320
            [utils.asGridCoords(36.5, 20)]: true,  // 576  320
            [utils.asGridCoords(36.5, 18)]: true,  // 576  288
            [utils.asGridCoords(35.5, 18)]: true,  // 560  288
            [utils.asGridCoords(34.5, 18)]: true,  // 544  288
        },
        buttonSpaces: {
            // Additional button spaces if needed
            [utils.asGridCoords(28.5, 13)]: {
                text: "Talk",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "Welcome to the water treatment facility!", faceHero: "operator" },
                    { type: "textMessage", text: "I'm the operator here. Did you know that your toilet flush travels through an extensive sewer system to get here?" },
                    { type: "textMessage", text: "The water you flush goes through multiple treatment stages before it's returned to the environment." },
                    { type: "textMessage", text: "Welcome, brave traveler! Our first task is to cleanse this reservoir of visible impurities." },
                    { type: "textMessage", text: "Please, collect and dispose of any floating debris or trash contaminating these waters." },
                    // Update objective after conversation
                    { 
                        type: "custom",
                        action: (map) => {
                            map.updateObjective("Surface Sweep: Remove visible debris from the reservoir");
                        }
                    }
                ]
            },
            // NEW: Add button spaces for the debris items
            [utils.asGridCoords(28.5, 17)]: {
                text: "Collect",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "You collected a plastic bottle!" },
                    { 
                        type: "custom",
                        action: (map) => {
                            // Remove the debris object
                            delete map.gameObjects["debris1"];
                            
                            // Check if all debris is collected
                            map.checkDebrisCollected();
                        }
                    }
                ]
            },
            [utils.asGridCoords(31.5, 18)]: {
                text: "Collect",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "You collected a plastic bag!" },
                    { 
                        type: "custom",
                        action: (map) => {
                            delete map.gameObjects["debris2"];
                            map.checkDebrisCollected();
                        }
                    }
                ]
            },
            [utils.asGridCoords(25.5, 19)]: {
                text: "Collect",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "You collected a food wrapper!" },
                    { 
                        type: "custom",
                        action: (map) => {
                            delete map.gameObjects["debris3"];
                            map.checkDebrisCollected();
                        }
                    }
                ]
            }
        }
    },
}