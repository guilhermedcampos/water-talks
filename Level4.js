class Level4{

    static init(map){
    }

    static shootUVLight(map){
        // Make Ben uncontrollable
        map.gameObjects["ben"].isPlayerControlled = false;

        // Move Ben and operator off the grid temporarily
        const curBen = [ map.gameObjects["ben"].x, map.gameObjects["ben"].y];
        map.gameObjects["ben"].x = utils.withGrid(-10);
        map.gameObjects["ben"].y = utils.withGrid(-10);

        const curOperator = [map.gameObjects["operator"].x, map.gameObjects["operator"].y];
        map.gameObjects["operator"].x = utils.withGrid(-10);
        map.gameObjects["operator"].y = utils.withGrid(-10);

        // Change the lowerSrc to the sedimentation overlay image
        map.lowerImage.src = "images/maps/Level4ShootingUV.png";
        map.isCutscenePlaying = true;

        // Get the canvas context
        const ctx = document.querySelector(".game-canvas").getContext("2d");

        // Force the map to re-render to reflect the changes
        map.drawLowerImage(ctx, map.gameObjects["ben"]);

        // Change the camera focus to a different position
        map.cameraPerson = { x: utils.withGrid(31.5), y: utils.withGrid(23) };

        Level4.removeWalls(map);

        Level4.drawBacteria(ctx, map, 0);

        Level4.shootBacteria(map);

    }

    static drawBacteria(ctx, map) {
        const bacteriaPositions = [
            { x: 30.5, y: 20 },
            { x: 33.5, y: 22 },
            { x: 31.5, y: 21 },
            { x: 28.5, y: 24 },
            { x: 29.5, y: 23 },
            { x: 32.5, y: 25 },
            { x: 27.5, y: 21 },
        ];

        bacteriaPositions.forEach((position, index) => {
            const bacteriaId = `bacteria${index + 1}`;
            const bacteria = map.gameObjects[bacteriaId];
            bacteria.x = utils.withGrid(position.x);
            bacteria.y = utils.withGrid(position.y);
        });
    }

    static killBacteria(map){
        for(let i = 1; i <= 7; i++){
            setTimeout(() => {
                const bacteriaId = `bacteria${i}`;
                const bacteria = map.gameObjects[bacteriaId];
                if (bacteria) {
                    bacteria.x = utils.withGrid(-10);
                    bacteria.y = utils.withGrid(-10);
                }
            }, 1000 * i);
        }
    }

    static shootBacteria(map) {
        const bacteriaIds = ["bacteria1", "bacteria2", "bacteria3", "bacteria4", "bacteria5", "bacteria6", "bacteria7"];
        let remainingBacteria = bacteriaIds.length;
    
        // Add a click event listener to the canvas
        const canvas = document.querySelector(".game-canvas");

        const handleClick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = (event.clientX - rect.left) / 4 + 332; // Adjust for scaling
            const clickY = (event.clientY - rect.top) / 4 + 276; // Adjust for scaling

            console.log(`Click position: (${clickX}, ${clickY})`);
    
            // Check if the click is on any bacteria
            bacteriaIds.forEach((bacteriaId) => {
                const bacteria = map.gameObjects[bacteriaId];
                if (bacteria) {
                    const bacteriaX = bacteria.x;
                    const bacteriaY = bacteria.y;

                    console.log(`Bacteria ${bacteriaId} position: (${bacteriaX}, ${bacteriaY})`);
    
                    // Check if the click is within the bacteria's grid cell
                    if (
                        clickX >= bacteriaX &&
                        clickX <= bacteriaX + 16 &&
                        clickY >= bacteriaY &&
                        clickY <= bacteriaY + 16
                    ) {
                        // Remove the bacteria
                        bacteria.x = utils.withGrid(-10);
                        bacteria.y = utils.withGrid(-10);
                        remainingBacteria--;
    
                        // Check if all bacteria are removed
                        if (remainingBacteria === 0) {
                            // Remove the click event listener
                            canvas.removeEventListener("click", handleClick);
    
                            // Trigger the level4UVlightTaskComplete event
                            map.startCutscene(level4UVlightTaskComplete.events);
                        }
                    }
                }
            });
        };
    
        canvas.addEventListener("click", handleClick);
    }

    static removeWalls(map){
        // Pool
        delete map.walls[utils.asGridCoords(33.5, 19)];
        delete map.walls[utils.asGridCoords(33.5, 20)];
        delete map.walls[utils.asGridCoords(33.5, 21)];
        delete map.walls[utils.asGridCoords(33.5, 22)];

        //Counter
        delete map.walls[utils.asGridCoords(33.5, 23)];
        delete map.walls[utils.asGridCoords(32.5, 23)];
        delete map.walls[utils.asGridCoords(31.5, 23)]; 
        delete map.walls[utils.asGridCoords(30.5, 23)];
        delete map.walls[utils.asGridCoords(29.5, 23)];
        delete map.walls[utils.asGridCoords(28.5, 23)];
        delete map.walls[utils.asGridCoords(27.5, 23)];
    }

    static returnToLevel4(map){
        // Change the lowerSrc back to the normal image 
        map.lowerImage.src = "images/maps/Level4Lower.png";

        // Force the map to re-render to reflect the changes
        const ctx = document.querySelector(".game-canvas").getContext("2d");
        map.drawLowerImage(ctx, map.gameObjects["ben"]);

        // Add the walls back to the map
        map.walls[utils.asGridCoords(33.5, 19)] = true;
        map.walls[utils.asGridCoords(33.5, 20)] = true;
        map.walls[utils.asGridCoords(33.5, 21)] = true;
        map.walls[utils.asGridCoords(33.5, 22)] = true;
        map.walls[utils.asGridCoords(33.5, 23)] = true;
        map.walls[utils.asGridCoords(32.5, 23)] = true;
        map.walls[utils.asGridCoords(31.5, 23)] = true;
        map.walls[utils.asGridCoords(30.5, 23)] = true;
        map.walls[utils.asGridCoords(29.5, 23)] = true;
        map.walls[utils.asGridCoords(28.5, 23)] = true;
        map.walls[utils.asGridCoords(27.5, 23)] = true;

        // Move Ben and operator back to the grid
        map.gameObjects["ben"].x = utils.withGrid(30.5);
        map.gameObjects["ben"].y = utils.withGrid(24);
        map.gameObjects["ben"].isPlayerControlled = true;

        map.gameObjects["operator"].x = utils.withGrid(34.5);
        map.gameObjects["operator"].y = utils.withGrid(23);

        // Change the camera focus back to Ben
        map.cameraPerson = map.gameObjects["ben"];
        map.isCutscenePlaying = false;
    }
}

//constants
const level4GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(37.5),
        y: utils.withGrid(19), 
        src: "images/characters/people/mainCharacter.png",
        id: "ben",
    }),

    operator: new Person({
        x: utils.withGrid(34.5),
        y: utils.withGrid(23),
        src: "images/characters/people/operator.png",
        id: "operator",
        behaviorLoop: [
            { type: "stand", direction: "down", time: 3000 },
            { type: "stand", direction: "right", time: 2000 },
        ],
    }),

    // Define bacteria
    bacteria1: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria1",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    bacteria2: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria2",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    bacteria3: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria3",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    bacteria4: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria4",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    bacteria5: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria5",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    bacteria6: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria6",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    bacteria7: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/bacteria2.png",
        id: "bacteria7",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
}

//Events
const initLevel4Event = {
    events: [ 
        { 
            type: "custom", 
            action: (map) => {
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
                
                // Trigger fade in
                setTimeout(() => {
                    fadeOverlay.style.opacity = "1";

                    // After fade is complete, change map
                    setTimeout(() => {
                        // Change to Level2
                        map.startCutscene([
                            { type: "changeMap", map: "Level4" }
                        ]);
                        
                        // Start fade out after map change
                        setTimeout(() => {
                            fadeOverlay.style.opacity = "0";
                            
                            // Remove overlay after fade out
                            setTimeout(() => {
                                document.body.removeChild(fadeOverlay);
                                
                                // Update objective for Level4
                                if (map.overworld && map.overworld.map) {
                                    Level4.init(map.overworld.map);
                                }
                            }, 1500);
                        }, 500);
                    }, 1500);
                }, 50);
            } 
        } 
    ] 
};

const level4OperatorTalk = {
    text: "Talk",
    action: "startCutscene",
    events:[
        {
            type: "custom",
            action: (map) => {
                console.log("Talk button clicked");

                // Get the operator object
                const operator = map.gameObjects["operator"];
                if (operator) {
                    operator.behaviorLoop = []; // Disable the behaviorLoop
                }

                delete map.buttonSpaces[utils.asGridCoords(35.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(34.5, 24)];

                // Remove active button display
                console.log("Removing active button display");
                map.removeButton();
            }
        },
        { type: "textMessage", text: "Welcome to the desinfection stage of water treatment!", faceHero: "operator" },
        { type: "textMessage", text: "Here is where we make sure all harmful bacteria, viruses, and other pathogens are eliminated." },
        { type: "textMessage", text: "First, we add chlorine to the water, which works by breaking down the cells of harmful organisms." },
        { type: "textMessage", text: "The chlorine is carefully controlled to ensure it's effective but doesn't leave harmful levels behind." },
        { type: "textMessage", text: "Go to the tank controlls and add the chlorine to the tanks." },
        {
            type: "custom",
            action: (map) => {
                map.updateObjective("Add chlorine to the tanks.");

                map.buttonSpaces[utils.asGridCoords(31.5, 24)] = level4ChlorineTask;
                map.buttonSpaces[utils.asGridCoords(29.5, 24)] = level4ChlorineTask;
                map.buttonSpaces[utils.asGridCoords(27.5, 24)] = level4ChlorineTask;
                
                // Add the arrow indicator over the buttons 
                map.gameObjects["arrowIndicator1"] = new AnimatedGifSprite({
                    x: utils.withGrid(31.5), 
                    y: utils.withGrid(23), 
                    src: "images/waterAssets/arrowDown.gif",
                    frameCount: 6,
                    animationSpeed: 130,
                    id: "arrowIndicator",
                    behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
                    collides: false,
                });

                map.gameObjects["arrowIndicator2"] = new AnimatedGifSprite({
                    x: utils.withGrid(29.5), 
                    y: utils.withGrid(23), 
                    src: "images/waterAssets/arrowDown.gif",
                    frameCount: 6,
                    animationSpeed: 130,
                    id: "arrowIndicator",
                    behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
                    collides: false,
                });

                map.gameObjects["arrowIndicator3"] = new AnimatedGifSprite({
                    x: utils.withGrid(27.5), 
                    y: utils.withGrid(23), 
                    src: "images/waterAssets/arrowDown.gif",
                    frameCount: 6,
                    animationSpeed: 130,
                    id: "arrowIndicator",
                    behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
                    collides: false,
                });

                const operator = map.gameObjects["operator"];
                operator.behaviorLoop = [ { type: "stand", direction: "left", time: 99999 }, ];
            }
        },
    ]
}

const level4ChlorineTask = {
    text: "Add Chlorine",
    action: "startCutscene",
    events: [
        {
            type: "custom",
            action: (map) => {
                console.log("Chlorine button clicked");

                delete map.buttonSpaces[utils.asGridCoords(31.5, 24)];
                delete map.buttonSpaces[utils.asGridCoords(29.5, 24)];
                delete map.buttonSpaces[utils.asGridCoords(27.5, 24)];

                // Remove the arrow indicators
                delete map.gameObjects["arrowIndicator1"];
                delete map.gameObjects["arrowIndicator2"];
                delete map.gameObjects["arrowIndicator3"];

                // Remove active button display
                console.log("Removing active button display");
                map.removeButton();
            }
        },
        {
            type: "custom",
            action: (map) => {
                map.updateObjective("Return to the operator.");

                map.buttonSpaces[utils.asGridCoords(35.5, 23)] = level4ChlorineTaskComplete;
                map.buttonSpaces[utils.asGridCoords(34.5, 24)] = level4ChlorineTaskComplete;
                
                const operator = map.gameObjects["operator"];
                operator.behaviorLoop = [];
                operator.behaviorLoop = [
                    { type: "stand", direction: "down", time: 3000 },
                    { type: "stand", direction: "right", time: 2000 },
                ];
            }
        },
    ]
}

const level4ChlorineTaskComplete = {
    text: "Talk",
    action: "startCutscene",
    events:[
        {
            type: "custom",
            action: (map) => {
                console.log("Talk button clicked");

                // Get the operator object
                const operator = map.gameObjects["operator"];
                if (operator) {
                    // Temporarily disable the behaviorLoop
                    operator.behaviorLoop = []; // Disable the behaviorLoop
                }

                delete map.buttonSpaces[utils.asGridCoords(35.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(34.5, 24)];

                // Remove active button display
                console.log("Removing active button display");
                map.removeButton();
            }
        },
        { type: "textMessage", text: "Good job! Now let's use UV light to finish the desinfection.", faceHero: "operator" },
        { type: "textMessage", text: "UV light damages the DNA of pathogens, preventing them from multiplying." },
        { type: "textMessage", text: "It's a chemical-free method, and it's really effective for eliminating microorganisms like bacteria and viruses." },
        { type: "textMessage", text: "Go to the shooting range and zap anything harmful that you find with UV light!" },
        {
            type: "custom",
            action: (map) => {
                map.updateObjective("Shoot UV light at the pathogens.");

                map.buttonSpaces[utils.asGridCoords(30.5, 24)] = level4UVlightTask;
                map.buttonSpaces[utils.asGridCoords(28.5, 24)] = level4UVlightTask;

                // Add the arrow indicator over the buttons
                map.gameObjects["arrowIndicator1"] = new AnimatedGifSprite({
                    x: utils.withGrid(30.5), 
                    y: utils.withGrid(23), 
                    src: "images/waterAssets/arrowDown.gif",
                    frameCount: 6,
                    animationSpeed: 130,
                    id: "arrowIndicator",
                    behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
                    collides: false,
                });

                map.gameObjects["arrowIndicator2"] = new AnimatedGifSprite({
                    x: utils.withGrid(28.5), 
                    y: utils.withGrid(23), 
                    src: "images/waterAssets/arrowDown.gif",
                    frameCount: 6,
                    animationSpeed: 130,
                    id: "arrowIndicator",
                    behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
                    collides: false,
                });

                const operator = map.gameObjects["operator"];
                operator.behaviorLoop = [ { type: "stand", direction: "left", time: 99999 }, ];
            }
        },
    ]
}

const level4UVlightTask = {
    text: "Shoot UV light",
    action: "startCutscene",
    events: [
        {
            type: "custom",
            action: (map) => {
                console.log("UV light button clicked");

                delete map.buttonSpaces[utils.asGridCoords(30.5, 24)];
                delete map.buttonSpaces[utils.asGridCoords(28.5, 24)];

                // Remove the arrow indicators
                delete map.gameObjects["arrowIndicator1"];
                delete map.gameObjects["arrowIndicator2"];

                // Remove active button display
                console.log("Removing active button display");
                map.removeButton();
            }
        },
        {
            type: "custom",
            action: (map) => {
                Level4.shootUVLight(map);
            } 
        },
    ]
}

const level4UVlightTaskComplete = {
    events: [
        {
            type: "custom",
            action: (map) => {
                Level4.returnToLevel4(map);

                map.updateObjective("Return to the operator.");

                map.buttonSpaces[utils.asGridCoords(35.5, 23)] = level4EndGame;
                map.buttonSpaces[utils.asGridCoords(34.5, 24)] = level4EndGame;

                const operator = map.gameObjects["operator"];
                operator.behaviorLoop = [];
                operator.behaviorLoop = [
                    { type: "stand", direction: "down", time: 3000 },
                    { type: "stand", direction: "right", time: 2000 },
                ];
            }
        },
    ]
}

const level4EndGame = {
    text: "Talk",
    action: "startCutscene",
    events:[
        {
            type: "custom",
            action: (map) => {
                console.log("Talk button clicked");

                // Get the operator object
                const operator = map.gameObjects["operator"];
                if (operator) {
                    // Temporarily disable the behaviorLoop
                    operator.behaviorLoop = []; // Disable the behaviorLoop
                }

                delete map.buttonSpaces[utils.asGridCoords(35.5, 23)];
                delete map.buttonSpaces[utils.asGridCoords(34.5, 24)];

                // Remove active button display
                console.log("Removing active button display");
                map.removeButton();
            }
        },
        { type: "textMessage", text: "Good shooting! The water is now safe and clean.", faceHero: "operator" },
        { type: "textMessage", text: "Now we can start distributing it." },
        { type: "textMessage", text: "Follow me." },
        {
            type: "custom",
            action: (map) => {
                map.updateObjective("Follow the Operator.");

                delete map.walls[utils.asGridCoords(37.5, 27)];
                delete map.walls[utils.asGridCoords(36.5, 27)];

                map.cutSceneSpaces[utils.asGridCoords(37.5, 27)] = teleportToLevel5Event;
                map.cutSceneSpaces[utils.asGridCoords(36.5, 27)] = teleportToLevel5Event;

                const walkingOperator = [];

                walkingOperator.push({ type: "walk", who: "ben", direction: "down" });

                for (let i = 0; i < 3; i++) {
                    walkingOperator.push({ type: "walk", who: "operator", direction: "right" });
                }
                for (let i = 0; i < 4; i++) {
                    walkingOperator.push({ type: "walk", who: "operator", direction: "down" });
                }
                walkingOperator.push({ 
                    type: "custom",
                    action: (map) => {
                        map.walls[utils.asGridCoords(37.5, 27)] = false;
                        // Delete the operator at the exit point
                        delete map.gameObjects["operator"];
                    }
                });
                map.startCutscene(walkingOperator);
            }
        },
    ]
}