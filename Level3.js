class Level3 {
    // Current filtration stage tracker
    static currentStage = "none";
    
    // Initialize Level3
    static init(map) {
        console.log("Level3.init called", map);
        // Reset the filtration stage
        Level3.currentStage = "none";
        
        // Set initial objective
        if (map && map.updateObjective) {
            console.log("Setting initial objective for Level3");
            map.updateObjective("Talk to the operator about filtration.");
        }
        
        // Initialize operator's position and behavior
        const operator = map.gameObjects["operator"];
        if (operator) {
            console.log("Positioning operator at 27.5, 23");
            operator.x = utils.withGrid(27.5);
            operator.y = utils.withGrid(23);
            operator.direction = "up";
        } else {
            console.error("Operator NPC not found in gameObjects!");
        }
        
        // Add talk buttons around the operator
        console.log("Adding talk buttons around operator");
    }
    
    // Handle sand filter activation
    static activateSandFilter(map) {
        console.log("activateSandFilter called");
        // Update current stage
        Level3.currentStage = "sand";
        console.log("Updated currentStage to:", Level3.currentStage);
        
        // Remove the buttons
        console.log("Removing active button");
        map.removeButton();
        
        // Start dialogue sequence after animation
        console.log("Setting timeout for dialogue sequence");
        map.startCutscene([
            { type: "textMessage", text: "Excellent! You've activated the sand filter.", faceHero: "operator" },
            { type: "textMessage", text: "Sand filtration is one of the oldest and most reliable methods of water treatment." },
            { type: "textMessage", text: "As water passes through the fine sand layer, particles get trapped in the tiny spaces between sand grains." },
            { type: "textMessage", text: "This effectively removes sediment, algae, and many impurities from the water." },
            { 
                type: "custom", 
                action: (map) => {
                    // Update objective
                    if (map && map.updateObjective) {
                        map.updateObjective("Talk to the operator.");
                    } else {
                        console.error("map.updateObjective not available");
                    }
                }
            }
        ]);
        
        map.buttonSpaces[utils.asGridCoords(27.5, 22)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(26.5, 23)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(28.5, 23)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(27.5, 24)] = OperatorTalk

        // Remove the sand filter buttons from spaces
        console.log("Removing sand filter buttons");
        delete map.buttonSpaces[utils.asGridCoords(30.5, 18)];
        delete map.buttonSpaces[utils.asGridCoords(31.5, 18)];
    }
    
    // Handle gravel filter activation
    static activateGravelFilter(map) {
        console.log("activateGravelFilter called");
        // Update current stage
        Level3.currentStage = "gravel";
        console.log("Updated currentStage to:", Level3.currentStage);
        
        // Remove the buttons
        console.log("Removing active button");
        map.removeButton();
        
        // Start dialogue sequence after animation
        console.log("Setting timeout for dialogue sequence");

        map.startCutscene([
            { type: "textMessage", text: "Great job activating the gravel filter!", faceHero: "operator" },
            { type: "textMessage", text: "Gravel filters use larger particles than sand filters." },
            { type: "textMessage", text: "They're excellent for removing larger debris and preparing water for finer filtration." },
            { type: "textMessage", text: "Gravel filters often serve as a pre-filter in multi-stage filtration systems." },
            { type: "textMessage", text: "The difference between sand and gravel is that gravel allows for faster water flow but catches only larger particles." },
            { type: "textMessage", text: "Now for our final filtration medium - activated carbon. This one works quite differently..." },
            { 
                type: "custom", 
                action: (map) => {
                    console.log("Updating objective to activate carbon filter");
                    // Update objective
                    if (map && map.updateObjective) {
                        map.updateObjective("Talk to the operator.");
                    }
                }
            }
        ]);
        
        map.buttonSpaces[utils.asGridCoords(27.5, 22)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(26.5, 23)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(28.5, 23)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(27.5, 24)] = OperatorTalk

        // Remove the gravel filter buttons from spaces
        console.log("Removing gravel filter buttons");
        delete map.buttonSpaces[utils.asGridCoords(32.5, 18)];
        delete map.buttonSpaces[utils.asGridCoords(33.5, 18)];
    }
    
    // Handle carbon filter activation
    static activateCarbonFilter(map) {
        console.log("activateCarbonFilter called");
        // Update current stage
        Level3.currentStage = "carbon";
        console.log("Updated currentStage to:", Level3.currentStage);
        
        // Remove the buttons
        console.log("Removing active button");
        map.removeButton();

        
        // Start dialogue sequence after animation
        console.log("Setting timeout for dialogue sequence");
        map.startCutscene([
            { type: "textMessage", text: "Excellent! You've activated the carbon filter.", faceHero: "operator" },
            { type: "textMessage", text: "Activated carbon is remarkable for water purification." },
            { type: "textMessage", text: "Unlike sand and gravel that work through mechanical filtration, carbon uses adsorption." },
            { type: "textMessage", text: "This means it chemically attracts and binds contaminants to its surface." },
            { type: "textMessage", text: "Carbon is especially effective at removing chlorine, volatile organic compounds, and unpleasant tastes and odors." },
            { type: "textMessage", text: "By combining these three filtration methods - sand, gravel, and carbon - we create a comprehensive filtration system." },
            { type: "textMessage", text: "Each medium targets different contaminants, ensuring thoroughly clean water." },
            { type: "textMessage", text: "You've now seen how we use multiple filtration methods to ensure water quality." },
            { type: "textMessage", text: "Let's move forward to the next stage of water treatment." },
            { 
                type: "custom", 
                action: (map) => {
                    console.log("Carbon filter dialogue complete, updating objective");
                    // Update objective
                    if (map && map.updateObjective) {
                        map.updateObjective("Return to the operator.");
                    } 
                    
                    // Mark all filters as complete
                    map.filtersCompleted = true;
                    console.log("Set filtersCompleted flag to true");
                    
                    // Add talk buttons again for final conversation
                    console.log("Adding talk buttons again for final conversation");
                }
            }
        ]);
        
        map.buttonSpaces[utils.asGridCoords(27.5, 22)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(26.5, 23)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(28.5, 23)] = OperatorTalk
        map.buttonSpaces[utils.asGridCoords(27.5, 24)] = OperatorTalk

        // Remove the carbon filter buttons from spaces
        console.log("Removing carbon filter buttons");
        delete map.buttonSpaces[utils.asGridCoords(34.5, 18)];
        delete map.buttonSpaces[utils.asGridCoords(35.5, 18)];
    }
    
    // Get the appropriate dialogue based on current stage
    static getOperatorDialogue(map) {
        console.log("getOperatorDialogue called, currentStage:", Level3.currentStage, "filtersCompleted:", map.filtersCompleted);
        
        // If we've completed carbon filter and returned to operator, offer to proceed
        if (Level3.currentStage === "carbon" && map.filtersCompleted) {
            console.log("Returning final completion dialogue");
            return [
                { type: "textMessage", text: "Excellent job! You've successfully operated all three filtration systems.", faceHero: "operator" },
                { type: "textMessage", text: "Now our water has gone through complete filtration and is nearly ready for distribution." },
                { type: "textMessage", text: "Let's move on to the final stage of water treatment." },
                { 
                    type: "custom", 
                    action: (map) => {
                        console.log("Initiating transition to next level");
                        // Play transition animation to next level
                        Level3.transitionToNextLevel(map);
                    }
                }
            ];
        }
        
        // Normal progression based on current stage
        console.log("Returning dialogue for stage:", Level3.currentStage);
        switch(Level3.currentStage) {
            case "none":
                return [
                    { type: "textMessage", text: "Welcome to the filtration stage! This is where we remove remaining particles from the water.", faceHero: "operator" },
                    { type: "textMessage", text: "We use multiple filtration methods to ensure the best water quality." },
                    { type: "textMessage", text: "Let's start with the sand filter. It's one of the most common methods used in water treatment." },
                    { type: "textMessage", text: "Please go to the sand filter tank and activate it. You'll find the controls at the top of the tank." },
                    { 
                        type: "custom", 
                        action: (map) => {
                            console.log("Setting objective to activate sand filter");
                            // Update objective
                            if (map && map.updateObjective) {
                                map.updateObjective("Activate the sand filter.");
                            } else {
                                console.error("map.updateObjective not available");
                            }
                            map.buttonSpaces[utils.asGridCoords(30.5, 18)] = sandFilter1;
                            map.buttonSpaces[utils.asGridCoords(31.5, 18)] = sandFilter2;
                        }
                    }
                ];
            case "sand":
                return [
                    { type: "textMessage", text: "Good progress! Now, please activate the gravel filter.", faceHero: "operator" },
                    { type: "textMessage", text: "Look for the green tank." },
                    { 
                        type: "custom", 
                        action: (map) => {
                            console.log("Setting objective to activate gravel filter");
                            // Update objective
                            if (map && map.updateObjective) {
                                map.updateObjective("Activate the gravel filter.");
                            } 
                            map.buttonSpaces[utils.asGridCoords(32.5, 18)] = gravelFilter1;
                            map.buttonSpaces[utils.asGridCoords(33.5, 18)] = gravelFilter2;
                        }
                    }
                ];
            case "gravel":
                return [
                    { type: "textMessage", text: "Almost there! Now activate the carbon filter to complete the filtration process.", faceHero: "operator" },
                    { type: "textMessage", text: "The blue tank is what you're looking for." },
                    { 
                        type: "custom", 
                        action: (map) => {
                            console.log("Setting objective to activate carbon filter");
                            // Update objective
                            if (map && map.updateObjective) {
                                map.updateObjective("Activate the carbon filter.");
                            } 
                            map.buttonSpaces[utils.asGridCoords(34.5, 18)] = carbonFilter1;
                            map.buttonSpaces[utils.asGridCoords(35.5, 18)] = carbonFilter2;
                        }
                    }
                ];
            case "carbon":
                return [
                    { type: "textMessage", text: "Great job on activating the carbon filter!", faceHero: "operator" },
                    { type: "textMessage", text: "Return to me when you're ready to proceed to the next stage." },
                    { 
                        type: "custom", 
                        action: (map) => {
                            console.log("Setting objective to return to operator");
                            // Update objective
                            if (map && map.updateObjective) {
                                map.updateObjective("Return to the operator.");
                            } 
                        }
                    }
                ];
            default:
                console.warn("Unknown stage:", Level3.currentStage);
                return [
                    { type: "textMessage", text: "Let's continue with our water treatment process.", faceHero: "operator" }
                ];
        }
    }
    
    // Transition to the next level
    static transitionToNextLevel(map) {
        console.log("transitionToNextLevel called");
        // Create fade overlay
        const fadeOverlay = document.createElement("div");
        fadeOverlay.style.position = "fixed";
        fadeOverlay.style.top = "0";
        fadeOverlay.style.left = "0";
        fadeOverlay.style.width = "100%";
        fadeOverlay.style.height = "100%";
        fadeOverlay.style.backgroundColor = "black";
        fadeOverlay.style.opacity = "0";
        fadeOverlay.style.transition = "opacity 2s ease";
        fadeOverlay.style.zIndex = "1000";
        document.body.appendChild(fadeOverlay);
        console.log("Fade overlay created and added to DOM");
        
        // Start transition
        setTimeout(() => {
            console.log("Fading to black");
            fadeOverlay.style.opacity = "1";
            
            setTimeout(() => {
                console.log("Changing map to Level5");
                // Move to Level5
                map.startCutscene([
                    { type: "changeMap", map: "Level5" }
                ]);
                
                // Fade out
                setTimeout(() => {
                    console.log("Fading out transition overlay");
                    fadeOverlay.style.opacity = "0";
                    
                    setTimeout(() => {
                        console.log("Removing transition overlay from DOM");
                        document.body.removeChild(fadeOverlay);
                    }, 2000);
                }, 1000);
            }, 2000);
        }, 500);
    }
}

// Constants
const OperatorTalk = {
    text: "Talk",
    action: "startCutscene",
    events: [
        {
            type: "custom",
            action: (map) => {
                console.log("Talk button clicked");

                // Get the operator object
                const operator = map.gameObjects["operator"];
                if (operator) {
                    // Temporarily disable the behaviorLoop
                    operator.savedBehaviorLoop = operator.behaviorLoop; // Save the current behaviorLoop
                    operator.behaviorLoop = []; // Disable the behaviorLoop
                }

                // Get appropriate dialogue based on current stage
                const dialogueEvents = Level3.getOperatorDialogue(map);
                console.log("Got dialogue events:", dialogueEvents.length);

                delete map.buttonSpaces[utils.asGridCoords(27.5, 22)];
                delete map.buttonSpaces[utils.asGridCoords(26.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(28.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(27.5, 24)];

                // Remove active button display
                console.log("Removing active button display");
                map.removeButton();
                
                // Start the cutscene with the dialogue
                console.log("Starting cutscene with dialogue");
                map.startCutscene([
                    ...dialogueEvents,
                    {
                        type: "custom",
                        action: (map) => {
                            // Re-enable the operator's behaviorLoop after the conversation
                            if (operator && operator.savedBehaviorLoop) {
                                operator.behaviorLoop = operator.savedBehaviorLoop;
                                delete operator.savedBehaviorLoop; // Clean up the saved behaviorLoop
                            }
                        }
                    }
                ]);

                // Set a flag to track that initial conversation happened
                map.initialOperatorTalkComplete = true;
                console.log("Set initialOperatorTalkComplete flag to true");
            }
        }
    ]
};

const sandFilter1 = {
    text: "Activate Sand Filter",
    action: "custom", 
    callback: (map) => {
        console.log("Sand filter button clicked (30.5, 18)");
        Level3.activateSandFilter(map);
    }
};

const sandFilter2 = {
    text: "Activate Sand Filter",
    action: "custom",
    callback: (map) => {
        console.log("Sand filter button clicked (31.5, 18)");
        Level3.activateSandFilter(map);
    }
};

const gravelFilter1 = {
    text: "Activate Gravel Filter", 
    action: "custom",
    callback: (map) => {
        console.log("Gravel filter button clicked (32.5, 18)");
        Level3.activateGravelFilter(map);
    }
};

const gravelFilter2 = {
    text: "Activate Gravel Filter",
    action: "custom", 
    callback: (map) => {
        console.log("Gravel filter button clicked (33.5, 18)");
        Level3.activateGravelFilter(map);
    }
};

const carbonFilter1 = {
    text: "Activate Carbon Filter",
    action: "custom",
    callback: (map) => {
        console.log("Carbon filter button clicked (34.5, 18)");
        Level3.activateCarbonFilter(map);
    }
};

const carbonFilter2 = {
    text: "Activate Carbon Filter",
    action: "custom",
    callback: (map) => {
        console.log("Carbon filter button clicked (35.5, 18)");
        Level3.activateCarbonFilter(map);
    }
};

const level3GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(28.5),
        y: utils.withGrid(17), 
        src: "images/characters/people/mainCharacter.png",
        id: "ben",
    }),
    operator: new Person({
        x: utils.withGrid(27.5),
        y: utils.withGrid(23),
        src: "images/characters/people/operator.png",
        id: "operator",
        behaviorLoop: [
            { type: "stand", direction: "up", time: 3000 },
            { type: "stand", direction: "right", time: 2000 },
            { type: "stand", direction: "up", time: 3000 },
            { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
            {
                events: (map) => {
                    console.log("Operator talking event triggered");
                    return Level3.getOperatorDialogue(map);
                }
            }
        ]
    }),
};  

// Initialize Level3
const initLevel3Event = { 
    events: [ 
        { 
            type: "custom", 
            action: (map) => {
                console.log("initLevel3Event triggered, current map ID:", map.id);
                // First check if we need to transition to Level3
                if (map.id !== "Level3") {
                    console.log("Transitioning from another level to Level3");
                    // Create fade transition overlay
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
                    
                    // Fade to black
                    setTimeout(() => {
                        console.log("Fading to black for transition");
                        fadeOverlay.style.opacity = "1";
                        
                        setTimeout(() => {
                            console.log("Changing map to Level3");
                            // Change to Level3
                            map.startCutscene([
                                { type: "changeMap", map: "Level3" }
                            ]);
                            
                            // Wait for map to change, then initialize Level3
                            setTimeout(() => {
                                console.log("Fading out transition overlay");
                                // Fade out the overlay
                                fadeOverlay.style.opacity = "0";
                                
                                setTimeout(() => {
                                    console.log("Removing transition overlay");
                                    document.body.removeChild(fadeOverlay);
                                }, 1500);
                            }, 500);
                        }, 1500);
                    }, 50);
                }
                Level3.init(map);
            } 
        } 
    ] 
};

// Export the necessary components
console.log("Exporting Level3 components to global scope");
window.Level3 = Level3;
window.level3GameObjects = level3GameObjects;
window.initLevel3Event = initLevel3Event;
console.log("Level3.js fully loaded and initialized");
