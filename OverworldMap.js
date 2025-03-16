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
            } else if (buttonConfig.action === "custom" && typeof buttonConfig.callback === "function") {
                buttonConfig.callback(this); // Pass the map reference
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
                action: "custom",
                callback: function(map) {
                    // Create fade to black effect
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
                    
                    // Create audio element for typing sound
                    const typingSound = new Audio("sounds/typing.mp3");
                    typingSound.loop = true;  // Enable looping
                    typingSound.volume = 0.5; // Set volume to 50%
                    
                    // Trigger fade in
                    setTimeout(() => {
                        fadeOverlay.style.opacity = "1";
                        
                        // After fade is complete, show typing text messages
                        setTimeout(() => {
                            // Create text container
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
                            
                            // Array of messages to type out
                            const messages = [
                                "Every drop counts... but where does it go?",
                                "Every day, Lisbon treats over 550 million liters of water...",
                                "From your home to the treatment plant, every flush tells a story...",
                                "What you waste ... must be cleaned."
                            ];
                            
                            // Function to type out text character by character
                            const typeText = (message, index, callback) => {
                                textContainer.innerHTML = "";
                                let i = 0;
                                const typingSpeed = 50; // milliseconds per character
                                
                                // Start playing typing sound when typing begins
                                typingSound.currentTime = 0;
                                typingSound.play();
                                
                                const typing = setInterval(() => {
                                    if (i < message.length) {
                                        textContainer.innerHTML += message.charAt(i);
                                        i++;
                                    } else {
                                        clearInterval(typing);
                                        
                                        // Stop typing sound when the entire message is displayed
                                        typingSound.pause();
                                        typingSound.currentTime = 0;
                                        
                                        setTimeout(() => {
                                            callback();
                                        }, 2000); // Wait 2 seconds after typing completes
                                    }
                                }, typingSpeed);
                            };
                            
                            // Function to handle each message sequentially
                            const showMessages = (messageIndex) => {
                                if (messageIndex < messages.length) {
                                    typeText(messages[messageIndex], messageIndex, () => {
                                        showMessages(messageIndex + 1);
                                    });
                                } else {
                                    // All messages shown, fade out
                                    setTimeout(() => {
                                        textContainer.style.transition = "opacity 1.5s ease";
                                        textContainer.style.opacity = "0";
                                        fadeOverlay.style.opacity = "0";
                                        
                                        // Remove DOM elements after fade out
                                        setTimeout(() => {
                                            document.body.removeChild(textContainer);
                                            document.body.removeChild(fadeOverlay);
                                        }, 1500);
                                    }, 1000);
                                }
                            };
                            
                            // Start showing messages
                            showMessages(0);
                            
                        }, 1500); // Wait for fade in to complete
                    }, 50);
                }
            }
        }
    },
}