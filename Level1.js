class Level1 {

    // Helper: Types out a message character by character.
    static typeText(message, textContainer, typingSound, typingSpeed, callback) {
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

    static showFlushMessages(map, messages) {
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
    
    // Static helper methods
    static isOperatorPosition(map, x, y) {
        if (!map.gameObjects["operator"]) return false;
        
        const operatorX = map.gameObjects["operator"].x;
        const operatorY = map.gameObjects["operator"].y;
        
        // Check if position is adjacent to operator (in all 4 directions)
        return (
            (x === operatorX && y === operatorY - 16) || // above
            (x === operatorX + 16 && y === operatorY) || // right
            (x === operatorX && y === operatorY + 16) || // below
            (x === operatorX - 16 && y === operatorY)    // left
        );
    }
 
    // Level1-specific button trigger logic
    static checkForButtonTriggerLevel1(map, hero, buttonMatch) {
        // Control access to operator dialogue based on game state
        if (buttonMatch.text === "Talk" && Level1.isOperatorPosition(map, hero.x, hero.y)) {
            // Check if all debris are collected
            const debrisCount = Object.keys(map.gameObjects).filter(key => key.startsWith("debris")).length;
            
            // Check if all coagulants are mixed
            const coagulantCount = Object.keys(map.gameObjects).filter(key => key.startsWith("coagulant")).length;
            
            // Check if all flocs are observed
            const observedFlocs = map.observedFlocs ? Object.keys(map.observedFlocs).length : 0;
            const totalFlocs = Object.keys(map.gameObjects).filter(key => key.startsWith("floc")).length;
            const allFlocsObserved = observedFlocs === totalFlocs && totalFlocs > 0;
            
            // Different stages of the game
            if (debrisCount > 0 && !map.talkedToOperator) {
                // Initial stage: Allow first conversation with operator
                return true;
            } else if (debrisCount > 0 && map.talkedToOperator) {
                // Still need to collect debris - don't allow talking to operator again
                return false;
            } else if (debrisCount === 0 && !map.coagulantsStageStarted) {
                // Debris collected but coagulant stage not started - allow talking
                return true;
            } else if (coagulantCount > 0) {
                // Still need to mix coagulants - don't allow talking to operator
                return false;
            } else if (coagulantCount === 0 && totalFlocs === 0) {
                // All coagulants mixed but flocs not added - allow talking
                return true;
            } else if (!allFlocsObserved) {
                // Still need to observe flocs - don't allow talking to operator
                return false;
            } else {
                // All tasks completed - allow talking to operator
                return true;
            }
        } else if (buttonMatch.text === "Add Coagulants" && !map.coagulantsStageStarted) {
            // Don't show coagulant button until stage is started
            return false;
        } else if (buttonMatch.text === "Collect" && !map.talkedToOperator) {
            // Don't show collect button until operator is talked to
            return false;
        } else {
            // For all other buttons (Collect, Mix, Observe), show them if conditions are met
            return true;
        }
    }

    // Method to handle observing flocs
    static transformCoagulantsToFlocs(map) {
        // Use the same positions where coagulants were
        const flocPositions = [
            { x: 35.5, y: 22 },
            { x: 39.5, y: 19 },
            { x: 37.5, y: 24 },
            { x: 42.5, y: 21 },
            { x: 36.5, y: 20 }
        ];
        
        // Create floc objects at these positions
        for (let i = 0; i < flocPositions.length; i++) {
            const position = flocPositions[i];
            const flocId = `floc${i+1}`;
            
            // Add floc object to gameObjects
            map.gameObjects[flocId] = new Person({
                x: utils.withGrid(position.x),
                y: utils.withGrid(position.y),
                src: "images/waterAssets/flocks.png",
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            });
            
            // Add wall at floc position to prevent walking over it
            map.walls[`${utils.withGrid(position.x)},${utils.withGrid(position.y)}`] = true;
            
            // Create a closure for observe handler
            const createObserveHandler = (id, pos) => {
                return (map) => {
                    // First time user observes a floc, show a message
                    if (!map.observedFirstFloc) {
                        map.observedFirstFloc = true;
                        
                        // Show intro text message
                        map.startCutscene([
                            { type: "textMessage", text: "The flocs are growing as suspended particles bind together." },
                            { 
                                type: "custom", 
                                action: () => {
                                    // Track this floc as observed
                                    Level1.observeFloc(map, id, pos.x, pos.y);
                                }
                            }
                        ]);
                    } else {
                        // For subsequent observations, just mark as observed without showing text
                        Level1.observeFloc(map, id, pos.x, pos.y);
                    }
                };
            };
            
            const observeHandler = createObserveHandler(flocId, position);
            
            // Add button spaces around the floc
            map.buttonSpaces[utils.asGridCoords(position.x, position.y - 1)] = { // Above
                text: "Observe",
                action: "startCutscene",
                events: [{ type: "custom", action: observeHandler }]
            };
            
            map.buttonSpaces[utils.asGridCoords(position.x + 1, position.y)] = { // Right
                text: "Observe",
                action: "startCutscene",
                events: [{ type: "custom", action: observeHandler }]
            };
            
            map.buttonSpaces[utils.asGridCoords(position.x, position.y + 1)] = { // Below
                text: "Observe",
                action: "startCutscene",
                events: [{ type: "custom", action: observeHandler }]
            };
            
            map.buttonSpaces[utils.asGridCoords(position.x - 1, position.y)] = { // Left
                text: "Observe",
                action: "startCutscene",
                events: [{ type: "custom", action: observeHandler }]
            };
        }
    }

    // Method to handle observing flocs
    static observeFloc(map, flocId, x, y) {
        // Initialize observed flocs tracking if needed
        if (!map.observedFlocs) {
            map.observedFlocs = {};
        }
        
        // Mark this floc as observed
        map.observedFlocs[flocId] = true;
        
        // Get the actual floc object to find its position
        const floc = map.gameObjects[flocId];
        if (floc) {
            // Remove all button spaces around this floc
            delete map.buttonSpaces[utils.asGridCoords(x, y - 1)]; // Above
            delete map.buttonSpaces[utils.asGridCoords(x + 1, y)]; // Right
            delete map.buttonSpaces[utils.asGridCoords(x, y + 1)]; // Below
            delete map.buttonSpaces[utils.asGridCoords(x - 1, y)]; // Left
        }
        
        // Count observed flocs
        const observedCount = Object.keys(map.observedFlocs).length;
        const totalFlocs = Object.keys(map.gameObjects).filter(key => key.startsWith("floc")).length;
        
        if (observedCount === totalFlocs) {
            // All flocs observed, now remove all floc walls to allow passage
            Object.keys(map.gameObjects).forEach(key => {
                if (key.startsWith("floc")) {
                    const floc = map.gameObjects[key];
                    // Remove the wall at this position now that all flocs are observed
                    delete map.walls[`${floc.x},${floc.y}`];
                }
            });
            
            // All flocs observed, instruct the player to report to the operator
            map.updateObjective("Report your observations to the operator");

            // Define the final dialogue with a button that, when pressed,
            // will trigger the final cutscene.
            if (map.gameObjects["operator"]) {
                const newDialogue = {
                    text: "Talk",
                    action: "startCutscene",
                    events: [
                        { type: "textMessage", text: "Great! Follow me now!", faceHero: "operator" },
                        followOperatorEvent,
                    ]
                };

                // Add the dialogue button around the operator
                const operatorX = map.gameObjects["operator"].x / 16;
                const operatorY = map.gameObjects["operator"].y / 16;
                map.buttonSpaces[utils.asGridCoords(operatorX, operatorY - 1)] = { ...newDialogue };
                map.buttonSpaces[utils.asGridCoords(operatorX + 1, operatorY)] = { ...newDialogue };
                map.buttonSpaces[utils.asGridCoords(operatorX, operatorY + 1)] = { ...newDialogue };
                map.buttonSpaces[utils.asGridCoords(operatorX - 1, operatorY)] = { ...newDialogue };
            }
        } else {
            map.updateObjective(`Observe flocs: ${totalFlocs - observedCount} remaining`);
        }
    }

    // Check if all coagulants are mixed
    static checkCoagulantsCollected(map) {
        // Count remaining coagulants
        const remainingCoagulants = Object.keys(map.gameObjects).filter(key => 
            key.startsWith("coagulant")
        ).length;
        
        if (remainingCoagulants === 0) {
            // All coagulants collected, now direct player to return to operator
            map.updateObjective("Return to the operator to discuss coagulation");
            
            // Update the operator's dialogue for the next phase
            if (map.gameObjects["operator"]) {
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
                                Level1.transformCoagulantsToFlocs(map);
                                
                                // Update objective to observe floc formation
                                map.updateObjective("Floc Formation: Observe the growth of flocs and inform the operator");
                            }
                        }
                    ]
                };
                
                // Clear existing operator button spaces
                Object.keys(map.buttonSpaces).forEach(key => {
                    const coords = key.split(",");
                    const x = parseFloat(coords[0]);
                    const y = parseFloat(coords[1]);
                    
                    // If this button space is near the operator, remove it
                    const operatorX = map.gameObjects["operator"].x / 16;
                    const operatorY = map.gameObjects["operator"].y / 16;
                    const distance = Math.sqrt(
                        Math.pow(x - operatorX, 2) + 
                        Math.pow(y - operatorY, 2)
                    );
                    
                    if (distance < 1.5) {
                        delete map.buttonSpaces[key];
                    }
                });
                
                // Add new dialogue button spaces around the operator
                const operatorX = map.gameObjects["operator"].x / 16;
                const operatorY = map.gameObjects["operator"].y / 16;
                
                map.buttonSpaces[utils.asGridCoords(operatorX, operatorY - 1)] = {...newDialogue}; // Above
                map.buttonSpaces[utils.asGridCoords(operatorX + 1, operatorY)] = {...newDialogue}; // Right
                map.buttonSpaces[utils.asGridCoords(operatorX, operatorY + 1)] = {...newDialogue}; // Below
                map.buttonSpaces[utils.asGridCoords(operatorX - 1, operatorY)] = {...newDialogue}; // Left
            }
        } else {
            // Update objective to show how many coagulants are left to mix
            map.updateObjective(`Mix coagulants: ${remainingCoagulants} remaining`);
        }
    }

    // Add this as static method to Level1 class
    static addCoagulants(map, count) {
        // Define fixed positions for coagulants in the water
        const coagulantPositions = [
            { x: 35.5, y: 22 },
            { x: 39.5, y: 19 },
            { x: 37.5, y: 24 },
            { x: 42.5, y: 21 },
            { x: 36.5, y: 20 }
        ];
        
        // Create coagulant objects at the predefined positions
        for (let i = 0; i < count && i < coagulantPositions.length; i++) {
            const position = coagulantPositions[i];
            const coagulantId = `coagulant${i+1}`;
            
            // Add coagulant object to gameObjects
            map.gameObjects[coagulantId] = new Person({
                x: utils.withGrid(position.x),
                y: utils.withGrid(position.y),
                src: "images/waterAssets/coagulant.png",
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 999999 }
                ]
            });
            
            // Add wall at coagulant position to prevent walking over it
            map.walls[`${utils.withGrid(position.x)},${utils.withGrid(position.y)}`] = true;
            
            // Create a closure to keep the current coagulant ID
            const createMixHandler = (currentId, pos) => {
                return (map) => {
                    // Remove this coagulant object
                    delete map.gameObjects[currentId];
                    
                    // Remove the wall at this position so player can walk through after mixing
                    delete map.walls[`${utils.withGrid(pos.x)},${utils.withGrid(pos.y)}`];
                    
                    // Remove all button spaces around this coagulant
                    delete map.buttonSpaces[utils.asGridCoords(pos.x, pos.y - 1)]; // Above
                    delete map.buttonSpaces[utils.asGridCoords(pos.x + 1, pos.y)]; // Right
                    delete map.buttonSpaces[utils.asGridCoords(pos.x, pos.y + 1)]; // Below
                    delete map.buttonSpaces[utils.asGridCoords(pos.x - 1, pos.y)]; // Left
                    
                    // Check if all coagulants have been mixed
                    Level1.checkCoagulantsCollected(map);
                };
            };
            
            const mixHandler = createMixHandler(coagulantId, position);
            
            // Add button spaces around the coagulant
            map.buttonSpaces[utils.asGridCoords(position.x, position.y - 1)] = { // Above
                text: "Mix",
                action: "startCutscene",
                events: [{ type: "custom", action: mixHandler }]
            };
            
            map.buttonSpaces[utils.asGridCoords(position.x + 1, position.y)] = { // Right
                text: "Mix",
                action: "startCutscene",
                events: [{ type: "custom", action: mixHandler }]
            };
            
            map.buttonSpaces[utils.asGridCoords(position.x, position.y + 1)] = { // Below
                text: "Mix",
                action: "startCutscene",
                events: [{ type: "custom", action: mixHandler }]
            };
            
            map.buttonSpaces[utils.asGridCoords(position.x - 1, position.y)] = { // Left
                text: "Mix",
                action: "startCutscene",
                events: [{ type: "custom", action: mixHandler }]
            };
        }
    }

    // Add this method to check if all debris has been collected
    static checkDebrisCollected(map) {
        // Remove collect button spaces for debris that have been collected
        if (!map.gameObjects["debris1"]) {
            delete map.buttonSpaces[utils.asGridCoords(28.5, 17)];
        }
        if (!map.gameObjects["debris2"]) {
            delete map.buttonSpaces[utils.asGridCoords(31.5, 18)];
        }
        if (!map.gameObjects["debris3"]) {
            delete map.buttonSpaces[utils.asGridCoords(25.5, 19)];
        }
        
        // Check remaining debris count
        const debrisKeys = Object.keys(map.gameObjects).filter(key =>
            key.startsWith("debris")
        );
        const debrisCount = debrisKeys.length;
        
        if (debrisCount === 0) {
            // All debris collected, update objective
            map.updateObjective("Return to the operator");
          
            // Update the operator's dialogue to acknowledge completion and instruct the next stage
            if (map.gameObjects["operator"]) {
              const newDialogue = {
                text: "Talk",
                action: "startCutscene",
                events: [
                  { type: "textMessage", text: "Excellent work! With the surface cleared, we must now address the finer particles suspended within.", faceHero: "operator" },
                  { type: "textMessage", text: "Now, I want you to add the coagulants into the water. Activate the dispenser over there.", faceHero: "operator" },
                  { type: "textMessage", text: "They will neutralize the charges of these particles, causing them to clump together into larger aggregates known as flocs.", faceHero: "operator" },
                  coagulantsStageEvent,
                ]
              };
          
              // Clear left-over operator button spaces if needed and add new ones around operator.
              const operatorX = map.gameObjects["operator"].x / 16;
              const operatorY = map.gameObjects["operator"].y / 16;
              map.buttonSpaces[utils.asGridCoords(operatorX, operatorY - 1)] = { ...newDialogue };
              map.buttonSpaces[utils.asGridCoords(operatorX + 1, operatorY)] = { ...newDialogue };
              map.buttonSpaces[utils.asGridCoords(operatorX, operatorY + 1)] = { ...newDialogue };
              map.buttonSpaces[utils.asGridCoords(operatorX - 1, operatorY)] = { ...newDialogue };
            }
        } else {
            // Update objective to show how many debris are left.
            map.updateObjective(`Surface Sweep: ${debrisCount} pieces of debris remaining`);
        }
    }
}

// Constants

const level1GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5), 
        src: "images/characters/people/mainUnderwater.png"
    }),
    
    // Update the operator in the Level1 map
    operator: new Person({
        x: utils.withGrid(32.5),
        y: utils.withGrid(17),
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
        x: utils.withGrid(35.5),
        y: utils.withGrid(24),
        src: "images/waterAssets/bottle.png", 
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ]
    }),
    debris2: new Person({
        x: utils.withGrid(41.5),
        y: utils.withGrid(23),
        src: "images/waterAssets/box.png", // Create another debris image
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ]
    }),
    debris3: new Person({
        x: utils.withGrid(38.5),
        y: utils.withGrid(21),
        src: "images/waterAssets/wheel.png", // Create a third debris image
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ]
    }),
    debris4: new Person({
        x: utils.withGrid(40.5),
        y: utils.withGrid(19),
        src: "images/waterAssets/box2.png", // Create a fourth debris image
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ]
    }),
};

const flocPositions = [
    { x: 35.5, y: 22 },
    { x: 39.5, y: 19 },
    { x: 37.5, y: 24 },
    { x: 42.5, y: 21 },
    { x: 36.5, y: 20 }
];

// Events
const introLevel1Event = {
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
}
// Update the collectDebris1Event to remove all button spaces
const collectDebris1Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris1"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(35.5), utils.withGrid(24));
                
                // Remove all button spaces for this debris
                delete map.buttonSpaces[utils.asGridCoords(35.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(35.5, 25)];
                delete map.buttonSpaces[utils.asGridCoords(34.5, 24)];
                delete map.buttonSpaces[utils.asGridCoords(36.5, 24)];
                
                // Check if all debris is collected
                Level1.checkDebrisCollected(map);
            }
        }
    ]
}

// Update the collectDebris2Event to remove all button spaces
const collectDebris2Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris2"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(41.5), utils.withGrid(23));
                
                // Remove all button spaces for this debris
                delete map.buttonSpaces[utils.asGridCoords(41.5, 22)];
                delete map.buttonSpaces[utils.asGridCoords(41.5, 24)];
                delete map.buttonSpaces[utils.asGridCoords(40.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(42.5, 23)];
                
                // Check if all debris is collected
                Level1.checkDebrisCollected(map);
            }
        }
    ]
}

// Update the collectDebris3Event to remove all button spaces
const collectDebris3Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris3"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(38.5), utils.withGrid(21));
                
                // Remove all button spaces for this debris
                delete map.buttonSpaces[utils.asGridCoords(38.5, 20)];
                delete map.buttonSpaces[utils.asGridCoords(38.5, 22)];
                delete map.buttonSpaces[utils.asGridCoords(37.5, 21)];
                delete map.buttonSpaces[utils.asGridCoords(39.5, 21)];
                
                // Check if all debris is collected
                Level1.checkDebrisCollected(map);
            }
        }
    ]
}

// Update the collectDebris4Event to remove all button spaces
const collectDebris4Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris4"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(40.5), utils.withGrid(19));
                
                // Remove all button spaces for this debris
                delete map.buttonSpaces[utils.asGridCoords(40.5, 18)];
                delete map.buttonSpaces[utils.asGridCoords(40.5, 20)];
                delete map.buttonSpaces[utils.asGridCoords(39.5, 19)];
                delete map.buttonSpaces[utils.asGridCoords(41.5, 19)];
                
                // Check if all debris is collected
                Level1.checkDebrisCollected(map);
            }
        }
    ]
}

const coagulantsStageEvent = { 
    type: "custom",
    action: (map) => {
      // Set a flag indicating that the coagulants stage has started.
      map.coagulantsStageStarted = true;

      // Update objective to direct player back to operator.
      map.updateObjective("Mix coagulants: Check the dispenser for remaining coagulants");

      // Create and add an arrow indicator at grid position (34.5, 12).
      map.gameObjects["arrowIndicator"] = new AnimatedGifSprite({
        x: utils.withGrid(32.5),
        y: utils.withGrid(20.5),
        src: "images/waterAssets/arrowDown.gif",  // Base name still used
        frameCount: 6,  // Number of frames in your animation
        animationSpeed: 130,  // Milliseconds between frame changes
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    });

      // Dynamically add the faucet/dispenser button so the player can activate it.
      map.buttonSpaces[utils.asGridCoords(32.5, 21)] = {
        text: "Add Coagulants",
        action: "startCutscene",
        events: [
          { type: "textMessage", text: "You've activated the coagulant dispenser!" },
          addCoagulantsEvent,
        ]
      };
    }
  }

// Fix the addCoagulantsEvent to properly call the Level1.addCoagulants method
const addCoagulantsEvent = {  
    type: "custom",
    action: (map) => {
      // The issue is here - need to pass the map parameter to the addCoagulants method
      Level1.addCoagulants(map, 5);

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

// Update the startCoagulantsEvent to ensure full cleanup
const startCoagulantsEvent = {
    text: "Add Coagulants",
    action: "startCutscene",
    events: [
        { type: "textMessage", text: "You've activated the coagulant dispenser!" },
        { 
            type: "custom",
            action: (map) => {
                // Add coagulant objects at fixed positions in the water
                Level1.addCoagulants(map, 5);
                
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

const followOperatorEvent = { 
    type: "custom",
    action: (map) => {

        map.updateObjective("Follow the operator to the next stage");
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