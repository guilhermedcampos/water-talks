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

        // Store if flush cutscene has started
        this.flushCutsceneStarted = false;
        
        // Create objective UI panel
        this.createObjectivePanel();
        this.talkedToOperator = false; // Add flag here

        // Initialize keyboard support for buttons
        this.initKeyboardButtonSupport();
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
        
        // If there's no button match or we already have an active button
        if (!buttonMatch || this.activeButton) {
            if (!buttonMatch && this.activeButton) {
                this.removeButton();
            }
            return;
        }
        
        // Check if this is a debris collection button and if the player hasn't talked to the operator yet
        if (buttonMatch.text === "Collect" && !this.talkedToOperator) {
            // Don't show collection buttons until player has talked to operator
            return;
        }
        
        // If this is the "Add Coagulants" button and the coagulants stage isn't started, do not show it
        if (buttonMatch.text === "Add Coagulants" && !this.coagulantsStageStarted) {
            return;
        }
        
        // For all other buttons, show them
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
        if (this.flushCutsceneStarted) {
            return;
        } else {
            this.flushCutsceneStarted = true;
        }
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
        // Remove collect button spaces for debris that have been collected
        if (!this.gameObjects["debris1"]) {
            delete this.buttonSpaces[utils.asGridCoords(28.5, 17)];
        }
        if (!this.gameObjects["debris2"]) {
            delete this.buttonSpaces[utils.asGridCoords(31.5, 18)];
        }
        if (!this.gameObjects["debris3"]) {
            delete this.buttonSpaces[utils.asGridCoords(25.5, 19)];
        }
        
        // Check remaining debris count
        const debrisKeys = Object.keys(this.gameObjects).filter(key =>
            key.startsWith("debris")
        );
        const debrisCount = debrisKeys.length;
        
        if (debrisCount === 0) {
            // All debris collected, update objective
            this.updateObjective("Return to the operator");
          
            // Update the operator's dialogue to acknowledge completion and instruct the next stage
            if (this.gameObjects["operator"]) {
              const newDialogue = {
                text: "Talk",
                action: "startCutscene",
                events: [
                  { type: "textMessage", text: "Excellent work! With the surface cleared, we must now address the finer particles suspended within.", faceHero: "operator" },
                  { type: "textMessage", text: "Now, I want you to add the coagulants into the water. Activate the dispenser over there.", faceHero: "operator" },
                  { type: "textMessage", text: "They will neutralize the charges of these particles, causing them to clump together into larger aggregates known as flocs.", faceHero: "operator" },
                  { 
                    type: "custom",
                    action: (map) => {
                      // Set a flag indicating that the coagulants stage has started.
                      map.coagulantsStageStarted = true;

                      // Update objective to direct player back to operator.
                      map.updateObjective("Mix coagulants: Check the dispenser for remaining coagulants");

                      // Create and add an arrow indicator at grid position (34.5, 12).
                      map.gameObjects["arrowIndicator"] = new AnimatedGifSprite({
                        x: utils.withGrid(34.7),
                        y: utils.withGrid(11.5),
                        src: "images/waterAssets/arrowDown.gif",  // Base name still used
                        frameCount: 6,  // Number of frames in your animation
                        animationSpeed: 130,  // Milliseconds between frame changes
                        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
                        collides: false,
                    });

                      // Dynamically add the faucet/dispenser button so the player can activate it.
                      map.buttonSpaces[utils.asGridCoords(34.5, 12)] = {
                        text: "Add Coagulants",
                        action: "startCutscene",
                        events: [
                          { type: "textMessage", text: "You've activated the coagulant dispenser!" },
                          { 
                            type: "custom",
                            action: (map) => {
                              // Add coagulant objects at fixed positions in the water.
                              map.addCoagulants(5);

                              // Update the objective 
                              map.updateObjective("Mix coagulants");
          
                              // Remove the arrow indicator
                              if (map.gameObjects["arrowIndicator"]) {
                                // Call destroy method to clear any animation intervals
                                if (map.gameObjects["arrowIndicator"].destroy) {
                                    map.gameObjects["arrowIndicator"].destroy();
                                }
                                delete map.gameObjects["arrowIndicator"];
                            }
                              
                              // Remove the faucet button so it never shows again.
                              delete map.buttonSpaces[utils.asGridCoords(34.5, 12)];
                            }
                          }
                        ]
                      };
                    }
                  }
                ]
              };
          
              // Clear left-over operator button spaces if needed and add new ones around operator.
              const operatorX = this.gameObjects["operator"].x / 16;
              const operatorY = this.gameObjects["operator"].y / 16;
              this.buttonSpaces[utils.asGridCoords(operatorX, operatorY - 1)] = { ...newDialogue };
              this.buttonSpaces[utils.asGridCoords(operatorX + 1, operatorY)] = { ...newDialogue };
              this.buttonSpaces[utils.asGridCoords(operatorX, operatorY + 1)] = { ...newDialogue };
              this.buttonSpaces[utils.asGridCoords(operatorX - 1, operatorY)] = { ...newDialogue };
            }
          } else {
            // Update objective to show how many debris are left.
            this.updateObjective(`Surface Sweep: ${debrisCount} pieces of debris remaining`);
          }
    }

    // Replace the random addCoagulants method with this fixed-position version
    addCoagulants(count) {
        // Define fixed positions for coagulants in the water
        const coagulantPositions = [
            { x: 32.5, y: 15 },
            { x: 25.5, y: 20 },
            { x: 32.5, y: 18 },
            { x: 26.5, y: 16 },
            { x: 30.5, y: 19 }
        ];
        
        // Create coagulant objects at the predefined positions
        for (let i = 0; i < count && i < coagulantPositions.length; i++) {
            const position = coagulantPositions[i];
            
            // Add coagulant object to gameObjects
            this.gameObjects[`coagulant${i+1}`] = new Person({
                x: utils.withGrid(position.x),
                y: utils.withGrid(position.y),
                src: "images/waterAssets/coagulant.png",
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            });
            
            // Add button space for collecting the coagulant
            this.buttonSpaces[utils.asGridCoords(position.x, position.y)] = {
                text: "Mix",
                action: "startCutscene",
                events: [
                    { 
                        type: "custom",
                        action: (map) => {
                            // Remove this coagulant object
                            delete map.gameObjects[`coagulant${i+1}`];
                            
                            // Remove this button space
                            delete map.buttonSpaces[utils.asGridCoords(position.x, position.y)];
                            
                            // Check if all coagulants have been mixed
                            map.checkCoagulantsCollected();
                        }
                    }
                ]
            };
        }
    }

    // Add method to check if all coagulants have been mixed
    checkCoagulantsCollected() {
        // Count remaining coagulants
        const remainingCoagulants = Object.keys(this.gameObjects).filter(key => 
            key.startsWith("coagulant")
        ).length;
        
        if (remainingCoagulants === 0) {
            // All coagulants collected, now direct player to return to operator
            this.updateObjective("Return to the operator to discuss coagulation");
            
            // Update the operator's dialogue for the next phase
            if (this.gameObjects["operator"]) {
                // Define the new dialogue for the operator
                const newDialogue = {
                    text: "Talk",
                    action: "startCutscene",
                    events: [
                        { type: "textMessage", text: "Excellent! The coagulants are now in the water.", faceHero: "operator" },
                        { type: "textMessage", text: "Observe as the coagulants work their magic, binding the tiny impurities into flocs." },
                        { type: "textMessage", text: "These larger clusters are easier to remove in subsequent treatment stages, ensuring our water becomes ever purer." },
                        { 
                            type: "custom",
                            action: (map) => {
                                // Transform coagulants into flocs
                                map.transformCoagulantsToFlocs();
                                
                                // Update objective to observe floc formation
                                map.updateObjective("Floc Formation: Observe the growth of flocs and inform the operator");
                            }
                        }
                    ]
                };
                
                // Clear existing operator button spaces
                Object.keys(this.buttonSpaces).forEach(key => {
                    const coords = key.split(",");
                    const x = parseFloat(coords[0]);
                    const y = parseFloat(coords[1]);
                    
                    // If this button space is near the operator, remove it
                    const operatorX = this.gameObjects["operator"].x / 16;
                    const operatorY = this.gameObjects["operator"].y / 16;
                    const distance = Math.sqrt(
                        Math.pow(x - operatorX, 2) + 
                        Math.pow(y - operatorY, 2)
                    );
                    
                    if (distance < 1.5) {
                        delete this.buttonSpaces[key];
                    }
                });
                
                // Add new dialogue button spaces around the operator
                const operatorX = this.gameObjects["operator"].x / 16;
                const operatorY = this.gameObjects["operator"].y / 16;
                
                this.buttonSpaces[utils.asGridCoords(operatorX, operatorY - 1)] = {...newDialogue}; // Above
                this.buttonSpaces[utils.asGridCoords(operatorX + 1, operatorY)] = {...newDialogue}; // Right
                this.buttonSpaces[utils.asGridCoords(operatorX, operatorY + 1)] = {...newDialogue}; // Below
                this.buttonSpaces[utils.asGridCoords(operatorX - 1, operatorY)] = {...newDialogue}; // Left
            }
        } else {
            // Update objective to show how many coagulants are left to mix
            this.updateObjective(`Mix coagulants: ${remainingCoagulants} remaining`);
        }
    }

    // Update the transformCoagulantsToFlocs method
    transformCoagulantsToFlocs() {
        // Use the same positions where coagulants were
        const flocPositions = [
            { x: 32.5, y: 15 },
            { x: 25.5, y: 20 },
            { x: 32.5, y: 18 },
            { x: 26.5, y: 16 },
            { x: 30.5, y: 19 }
        ];
        
        // Create floc objects at these positions
        for (let i = 0; i < flocPositions.length; i++) {
            const position = flocPositions[i];
            
            // Add floc object to gameObjects
            this.gameObjects[`floc${i+1}`] = new Person({
                x: utils.withGrid(position.x),
                y: utils.withGrid(position.y),
                src: "images/waterAssets/flocks.png", 
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            });
            
            // Different button events depending on if this is the first floc
            if (i === 0) {
                // First floc shows the text message
                this.buttonSpaces[utils.asGridCoords(position.x, position.y)] = {
                    text: "Observe",
                    action: "startCutscene",
                    events: [
                        { 
                            type: "custom",
                            action: (map) => {
                                // Set a flag to indicate we've shown the first floc message
                                map.observedFirstFloc = true;
                                // Track this floc as observed
                                map.observeFloc(`floc${i+1}`, position.x, position.y);
                            }
                        }
                    ]
                };
            } else {
                // Other flocs skip the text message
                this.buttonSpaces[utils.asGridCoords(position.x, position.y)] = {
                    text: "Observe",
                    action: "startCutscene",
                    events: [
                        { 
                            type: "custom",
                            action: (map) => {
                                // Track this floc as observed without showing text
                                map.observeFloc(`floc${i+1}`, position.x, position.y);
                            }
                        }
                    ]
                };
            }
        }
    }

    // Add new method to track floc observations
    observeFloc(flocId, x, y) {
        // Initialize observed flocs tracking if needed
        if (!this.observedFlocs) {
            this.observedFlocs = {};
        }
        
        // Mark this floc as observed
        this.observedFlocs[flocId] = true;
        
        // Remove the observe button at this position
        delete this.buttonSpaces[utils.asGridCoords(x, y)];
        
        // Count observed flocs
        const observedCount = Object.keys(this.observedFlocs).length;
        const totalFlocs = Object.keys(this.gameObjects).filter(key => key.startsWith("floc")).length;
        
        if (observedCount === totalFlocs) {
            // All flocs observed, instruct the player to report to the operator
            this.updateObjective("Report your observations to the operator");

            // Define the final dialogue with a button that, when pressed,
            // will trigger the final cutscene.
            if (this.gameObjects["operator"]) {
                const newDialogue = {
                    text: "Talk",
                    action: "startCutscene",
                    events: [
                        { type: "textMessage", text: "Great! Follow me now!", faceHero: "operator" },
                        
                        { 
                            type: "custom",
                            action: (map) => {

                                this.updateObjective("Follow the operator to the next stage");
                                // Instead of starting a new cutscene (which resets behaviors),
                                // directly set the behavior loops to make both operator and ben walk down.
                                map.gameObjects["operator"].behaviorLoop = [
                                    { type: "walk", direction: "down", time: 3 }
                                ];
                                map.gameObjects["ben"].behaviorLoop = [
                                    { type: "walk", direction: "down", time: 3 }
                                ];
                                // Start their behavior events directly.
                                map.gameObjects["operator"].doBehaviorEvent(map);
                                map.gameObjects["ben"].doBehaviorEvent(map);
                            }
                        }
                    ]
                };

                // Add the dialogue button around the operator
                const operatorX = this.gameObjects["operator"].x / 16;
                const operatorY = this.gameObjects["operator"].y / 16;
                this.buttonSpaces[utils.asGridCoords(operatorX, operatorY - 1)] = { ...newDialogue };
                this.buttonSpaces[utils.asGridCoords(operatorX + 1, operatorY)] = { ...newDialogue };
                this.buttonSpaces[utils.asGridCoords(operatorX, operatorY + 1)] = { ...newDialogue };
                this.buttonSpaces[utils.asGridCoords(operatorX - 1, operatorY)] = { ...newDialogue };
            }

            // (Remove or comment out the following line)
        } else {
            this.updateObjective(`Observe flocs: ${totalFlocs - observedCount} remaining`);
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
        if (buttonMatch.text === "Talk" && this.isOperatorPosition(hero.x, hero.y)) {
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

    // Helper method to check if position is near operator
    isOperatorPosition(x, y) {
        if (!this.gameObjects["operator"]) return false;
        
        const operatorX = this.gameObjects["operator"].x;
        const operatorY = this.gameObjects["operator"].y;
        
        // Check if position is adjacent to operator (in all 4 directions)
        return (
            (x === operatorX && y === operatorY - 16) || // above
            (x === operatorX + 16 && y === operatorY) || // right
            (x === operatorX && y === operatorY + 16) || // below
            (x === operatorX - 16 && y === operatorY)    // left
        );
    }

    // Add this method to the OverworldMap class
    initKeyboardButtonSupport() {
        document.addEventListener('keydown', (e) => {
            // Check if space key was pressed and there's an active button
            if (e.code === 'Space' && this.activeButton) {
                // Don't activate "Talk" buttons with space key
                if (this.activeButton.dataset.buttonType === "Talk") {
                    return;
                }
                
                console.log("Space key pressed - activating button");
                
                // Simulate a click on the active button
                this.activeButton.click();
                
                // Prevent default space behavior (like page scrolling)
                e.preventDefault();
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
                src: "images/characters/people/mainCharacter.png"
            }),
        }, 
        walls: wallsHouse,
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
            x: utils.withGrid(30.5),
            y: utils.withGrid(14),
        },
        gameObjects: {
            ben: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5), 
                src: "images/characters/people/mainUnderwater.png"
            }),
            
            // Update the operator in the Level1 map
            operator: new Person({
                x: utils.withGrid(27.5),
                y: utils.withGrid(13),
                src: "images/characters/people/operatorUnderwater.png",
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
                src: "images/waterAssets/bottle.png", 
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            }),
            debris2: new Person({
                x: utils.withGrid(31.5),
                y: utils.withGrid(19),
                src: "images/waterAssets/box.png", // Create another debris image
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            }),
            debris3: new Person({
                x: utils.withGrid(25.5),
                y: utils.withGrid(20),
                src: "images/waterAssets/wheel.png", // Create a third debris image
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            })
        },
        walls: wallsLevel1,
        buttonSpaces: {
            // Additional button spaces if needed
            [utils.asGridCoords(28.5, 13)]: {
                text: "Talk",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "Welcome to the water treatment facility!", faceHero: "operator" },
                    { type: "textMessage", text: "I'm the operator here. Did you know that your toilet flush travels through an extensive sewer system to get here?" },
                    { type: "textMessage", text: "The water you flush goes through multiple treatment stages before it's returned to the environment." },
                    { type: "textMessage", text: "Your first task is to cleanse this reservoir of visible impurities." },
                    { type: "textMessage", text: "Please, collect and dispose of any floating debris or trash contaminating these waters." },
                    // Update objective after conversation
                    { 
                        type: "custom",
                        action: (map) => {
                            map.talkedToOperator = true;
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
                    { 
                        type: "custom",
                        action: (map) => {
                            // Remove the debris object
                            delete map.gameObjects["debris1"];
                            
                            // Remove the wall at this position to ensure it's not blocking
                            map.removeWall(utils.withGrid(28.5), utils.withGrid(18));
                            
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
                    { 
                        type: "custom",
                        action: (map) => {
                            // Remove the debris object
                            delete map.gameObjects["debris2"];
                            
                            // Remove the wall at this position to ensure it's not blocking
                            map.removeWall(utils.withGrid(31.5), utils.withGrid(19));
                            
                            // Check if all debris is collected
                            map.checkDebrisCollected();
                        }
                    }
                ]
            },
            [utils.asGridCoords(25.5, 19)]: {
                text: "Collect",
                action: "startCutscene",
                events: [
                    { 
                        type: "custom",
                        action: (map) => {
                            // Remove the debris object
                            delete map.gameObjects["debris3"];
                            
                            // Remove the wall at this position to ensure it's not blocking
                            map.removeWall(utils.withGrid(25.5), utils.withGrid(20));
                            
                            // Check if all debris is collected
                            map.checkDebrisCollected();
                        }
                    }
                ]
            },
            // Update the faucet button action to change the mission right away
            [utils.asGridCoords(34.5, 12)]: {
                text: "Add Coagulants",
                action: "startCutscene",
                events: [
                    { type: "textMessage", text: "You've activated the coagulant dispenser!" },
                    { 
                        type: "custom",
                        action: (map) => {
                            // Add coagulant objects at fixed positions in the water
                            map.addCoagulants(5);
                            
                            // Update objective to direct player back to operator immediately
                            map.updateObjective("Mix coagulants");
                            
                            // Remove the arrow indicator
                            if (map.gameObjects["arrowIndicator"]) {
                                // Call destroy method to clear any animation intervals
                                if (map.gameObjects["arrowIndicator"].destroy) {
                                    map.gameObjects["arrowIndicator"].destroy();
                                }
                                delete map.gameObjects["arrowIndicator"];
                            }
                            
                            // Disable the faucet button after use
                            delete map.buttonSpaces[utils.asGridCoords(34.5, 12)];
                        }
                    }
                ]
            }
        }
    },
}