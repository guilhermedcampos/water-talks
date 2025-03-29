class Level2 {

    static startSedimentationStage(map) {
        console.log("Starting sedimentation stage");
        map.updateObjective("Follow the operator to the computer.");
        // Start the cutscene with the combined operatorWalkEvent
        map.startCutscene(operatorWalkEvent);
    }

    static showSedimentationOverlay(map) {
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
        map.lowerImage.src = "images/maps/Level2Sedimentation.png";
        map.isCutscenePlaying = true;

        // Get the canvas context
        const ctx = document.querySelector(".game-canvas").getContext("2d");

        // Force the map to re-render to reflect the changes
        map.drawLowerImage(ctx, map.gameObjects["ben"]);

        // Change the camera focus to a different position
        map.cameraPerson = { x: utils.withGrid(36.5), y: utils.withGrid(23) };

        // Draw sediments after the lower image has been rendered
        Level2.drawSediments(ctx, map, 0);

        // Drop sediments
        Level2.dropWalls(map);

        // Draw sediments with a timeout 
        Level2.dropAllSediments(ctx, map);

        // Add a delay before returning to the level
        setTimeout(() => {
            Level2.returnToLevel(curBen, curOperator, map);
            // Spawn the button after returning to the level
            map.updateObjective("Talk to the operator.");
            map.buttonSpaces[utils.asGridCoords(37.5, 23)] = talkToOperatorEvent;
        }, 10000);

    }

    static drawSediments(ctx, map, offset) {
        const sedimentsPositions = [
            { x: 41.5, y: 23 + offset},
            { x: 39.5, y: 23 + offset},
            { x: 37.5, y: 21 + offset}, 
            { x: 36.5, y: 22 + offset},
            { x: 35.5, y: 21 + offset},
            { x: 34.5, y: 23 + offset},
            { x: 32.5, y: 22 + offset}, 
        ];

        sedimentsPositions.forEach((position, index) => {
            const sedimentId = `sediment${index + 1}`;
            const sediment = map.gameObjects[sedimentId];
            if (sediment) {
                if (sediment.y < utils.withGrid(27)) {
                    sediment.x = utils.withGrid(position.x);
                    sediment.y = utils.withGrid(position.y);
                }
            }
        });
    }

    static dropWalls(map) {
        // Remove the desk (Walls) temporarily
        delete map.walls[utils.asGridCoords(38.5, 23)];
        delete map.walls[utils.asGridCoords(38.5, 24)];
        delete map.walls[utils.asGridCoords(38.5, 25)];
        delete map.walls[utils.asGridCoords(37.5, 25)];
    }

    static dropAllSediments(ctx, map) {
        setTimeout(() => Level2.drawSediments(ctx, map, 0.25), 375);
        setTimeout(() => Level2.drawSediments(ctx, map, 0.5), 750);
        setTimeout(() => Level2.drawSediments(ctx, map, 0.75), 1125);
        setTimeout(() => Level2.drawSediments(ctx, map, 1), 1500);
        setTimeout(() => Level2.drawSediments(ctx, map, 1.25), 1875);
        setTimeout(() => Level2.drawSediments(ctx, map, 1.5), 2250);
        setTimeout(() => Level2.drawSediments(ctx, map, 1.75), 2625);
        setTimeout(() => Level2.drawSediments(ctx, map, 2), 3000);
        setTimeout(() => Level2.drawSediments(ctx, map, 2.25), 3375);
        setTimeout(() => Level2.drawSediments(ctx, map, 2.5), 3750);
        setTimeout(() => Level2.drawSediments(ctx, map, 2.75), 4125);
        setTimeout(() => Level2.drawSediments(ctx, map, 3), 4500);
        setTimeout(() => Level2.drawSediments(ctx, map, 3.25), 4875);
        setTimeout(() => Level2.drawSediments(ctx, map, 3.5), 5250);
        setTimeout(() => Level2.drawSediments(ctx, map, 3.75), 5625);
        setTimeout(() => Level2.drawSediments(ctx, map, 4), 6000);
        setTimeout(() => Level2.drawSediments(ctx, map, 4.25), 6375);
        setTimeout(() => Level2.drawSediments(ctx, map, 4.5), 6750);
        setTimeout(() => Level2.drawSediments(ctx, map, 4.75), 7125);
        setTimeout(() => Level2.drawSediments(ctx, map, 5), 7500);
        setTimeout(() => Level2.drawSediments(ctx, map, 5.25), 7875);
        setTimeout(() => Level2.drawSediments(ctx, map, 5.5), 8250);
        setTimeout(() => Level2.drawSediments(ctx, map, 5.75), 8625);
        setTimeout(() => Level2.drawSediments(ctx, map, 6), 9000);
    }

    static returnToLevel(curBen, curOperator, map) {
        // Delete the sediments
        for (let i = 1; i <= 7; i++) {
            delete map.gameObjects[`sediment${i}`];
        }

        // Change the lowerSrc back to the normal image 
        map.lowerImage.src = "images/maps/Level2Lower.png";

        // Force the map to re-render to reflect the changes
        const ctx = document.querySelector(".game-canvas").getContext("2d");
        map.drawLowerImage(ctx, map.gameObjects["ben"]);

        // Add the desk (Walls) back
        map.walls[utils.asGridCoords(38.5, 23)] = true;
        map.walls[utils.asGridCoords(38.5, 24)] = true;
        map.walls[utils.asGridCoords(38.5, 25)] = true;
        map.walls[utils.asGridCoords(37.5, 25)] = true;

        // Move Ben and operator back to the grid
        map.gameObjects["ben"].x = curBen[0];
        map.gameObjects["ben"].y = curBen[1];
        map.gameObjects["ben"].isPlayerControlled = true;

        map.gameObjects["operator"].x = curOperator[0];
        map.gameObjects["operator"].y = curOperator[1];

        // Change the camera focus back to Ben
        map.cameraPerson = map.gameObjects["ben"];
        map.isCutscenePlaying = false;
    }

    static drawSinkSediments(ctx, map) {

        sedimentsToSinkPositions.forEach((position, index) => {
            const sedimentId = `sediment2${index + 1}`;
            const sediment = map.gameObjects[sedimentId];
            if (sediment) {
                sediment.x = utils.withGrid(position.x);
                sediment.y = utils.withGrid(position.y);
            }
        });
    }

    static spawnSinkButtons(map) {

        if (map.talkedToOperator2) {
            return;
        }
        // Loop through the sediments that need to sink
        for (let i = 0; i < sedimentsToSinkPositions.length; i++) {
            const position = sedimentsToSinkPositions[i];
            const sedimentId = `sediment2${i + 1}`;
            
            // Reposition existing sediment object
            if (map.gameObjects[sedimentId]) {
                map.gameObjects[sedimentId].x = utils.withGrid(position.x);
                map.gameObjects[sedimentId].y = utils.withGrid(position.y);
                
                // Add wall at sediment position to prevent walking over it
                map.walls[`${utils.withGrid(position.x)},${utils.withGrid(position.y)}`] = true;
                
                // Create a closure to keep the current sediment ID
                const createSinkHandler = (currentId, pos) => {
                    return (map) => {
                        // Move the sediment off-screen instead of deleting it
                        delete map.gameObjects[currentId];
                        
                        // Remove the wall at this position so player can walk through after sinking
                        delete map.walls[`${utils.withGrid(pos.x)},${utils.withGrid(pos.y)}`];
                        
                        // Remove all button spaces around this sediment
                        delete map.buttonSpaces[utils.asGridCoords(pos.x, pos.y - 1)]; // Above
                        delete map.buttonSpaces[utils.asGridCoords(pos.x + 1, pos.y)]; // Right
                        delete map.buttonSpaces[utils.asGridCoords(pos.x, pos.y + 1)]; // Below
                        delete map.buttonSpaces[utils.asGridCoords(pos.x - 1, pos.y)]; // Left
                        
                        // Check if all sediments have been sunk
                        Level2.checkAllSunk(map);
                    };
                };
                
                const sinkHandler = createSinkHandler(sedimentId, position);
                
                // Add button spaces around the sediment
                map.buttonSpaces[utils.asGridCoords(position.x, position.y - 1)] = { // Above
                    text: "Sink",
                    action: "startCutscene",
                    events: [{ type: "custom", action: sinkHandler }]
                };
                
                map.buttonSpaces[utils.asGridCoords(position.x + 1, position.y)] = { // Right
                    text: "Sink",
                    action: "startCutscene",
                    events: [{ type: "custom", action: sinkHandler }]
                };
                
                map.buttonSpaces[utils.asGridCoords(position.x, position.y + 1)] = { // Below
                    text: "Sink",
                    action: "startCutscene",
                    events: [{ type: "custom", action: sinkHandler }]
                };
                
                map.buttonSpaces[utils.asGridCoords(position.x - 1, position.y)] = { // Left
                    text: "Sink",
                    action: "startCutscene",
                    events: [{ type: "custom", action: sinkHandler }]
                };
            }
        }
    }

    // Check if all sediments have been sunk
    static checkAllSunk(map) {
        const allSunk = sedimentsToSinkPositions.every((_, index) => 
            !map.gameObjects[`sediment2${index + 1}`]
        );
    
        if (allSunk) {
            map.gameObjects["ben"].isPlayerControlled = false;
            delete map.walls[utils.asGridCoords(34.5, 26)];
            delete map.walls["34.5,26"];
            delete map.walls[utils.asGridCoords(35.5, 26)];
            delete map.walls["35.5,26"];
            map.startCutscene([
                { type: "textMessage", text: "All flocs have been settled!" },
                { type: "textMessage", text: "Let's move on to filtration." },
                { type: "custom", action: () => map.updateObjective("Follow the operator to the filtration stage.") },
                ...transitionToFiltrationEvent.events 
            ]);
        }
    }

    static initLevel3(map) {
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
                    { type: "changeMap", map: "Level3" }
                ]);
                
                // Start fade out after map change
                setTimeout(() => {
                    fadeOverlay.style.opacity = "0";
                    
                    // Remove overlay after fade out
                    setTimeout(() => {
                        document.body.removeChild(fadeOverlay);
                        
                        // Update objective for Level2 and start sedimentation stage
                        if (map.overworld && map.overworld.map) {
                            Level3.init(map.overworld.map);
                        }
                    }, 1500);
                }, 500);
            }, 1500);
        }, 50);
    }
    
}
// Constants

const level2GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5), 
        src: "images/characters/people/mainCharacter.png",
        id: "ben",
    }),
    
    operator: new Person({
        x: utils.withGrid(34.5),
        y: utils.withGrid(17),
        src: "images/characters/people/operator.png",
        id: "operator",
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ],
    }),

    // Define sediments
    sediment1: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment1",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment2: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment2",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment3: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment3",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment4: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment4",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment5: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment5",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment6: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment6",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment7: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment7",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),

    arrowIndicator: new AnimatedGifSprite({
        x: utils.withGrid(-10), 
        y: utils.withGrid(-10), 
        src: "images/waterAssets/arrowDown.gif",
        frameCount: 6,
        animationSpeed: 130,
        id: "arrowIndicator",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    

    sediment21: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment21",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment22: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment22",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment23: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment23",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
    sediment24: new Person({
        x: utils.withGrid(-10),
        y: utils.withGrid(-10),
        src: "images/waterAssets/sediment.png",
        id: "sediment24",
        behaviorLoop: [{ type: "stand", direction: "down", time: 999999 }],
        collides: false,
    }),
}

// Constants

const sedimentsPositions = [
    { x: 39.5, y: 24 },
    { x: 37.5, y: 22 }, 
    { x: 36.5, y: 23 },
    { x: 35.5, y: 22 },
    { x: 34.5, y: 24 },
    { x: 32.5, y: 23 },
];

const sedimentsToSinkPositions = [
    { x: 31.5, y: 23 },
    { x: 29.5, y: 21 },
    { x: 28.5, y: 23 }, 
    { x: 31.5, y: 19 },
];

// Events

const initLevel2Event = { events: [ { type: "custom", action: (map) => Level1.initLevel2(map) } ] };

const operatorWalkEvent = [
    { 
        type: "custom", 
        action: (map) => { 
            // Remove cutscene walls to allow movement
            delete map.walls[utils.asGridCoords(36.5, 17)];
            delete map.walls[utils.asGridCoords(35.5, 18)];
        }
    },
    { type: "textMessage", text: "Welcome to the Sedimentation Stage!"},
    { type: "textMessage", text: "Follow me, I'll show you how this process works." },

    ...Array(7).fill({ type: "walk", who: "operator", direction: "down" }),
    ...Array(6).fill({ type: "walk", who: "ben", direction: "down" }),

    ...Array(3).fill({ type: "walk", who: "operator", direction: "right" }),

    { type: "textMessage", text: "This is the sedimentation tank where the flocs we formed earlier settle to the bottom." },
    { type: "textMessage", text: "Gravity does most of the work here - the heavier particles gradually sink, leaving clearer water at the top." },
    { type: "textMessage", text: "Your task is to watch and learn how these flocs sink." },

    { type: "custom", action: (map) => { map.updateObjective("Watch the flocs settle to the bottom of the tank with the computer."); } },

    { type: "custom", action: (map) => { map.gameObjects["operator"].behaviorLoop = [ { type: "stand", direction: "down", time: 999999 } ]; }}
];

const observeSedimentationEvent = {
    text: "Observe",
    action: "startCutscene",
    events: [
        {
            type: "custom",
            action: (map) => {
                // Remove the button spaces
                delete map.buttonSpaces[utils.asGridCoords(37.5, 23)];

                // Show the sedimentation observation overlay
                Level2.showSedimentationOverlay(map);
            }
        }
    ]
};

const talkToOperatorEvent = {
    text: "Talk",
    action: "startCutscene",
    events: [
        { type: "textMessage", text: "Looks like sedimentation is complete!" },
        { type: "textMessage", text: "Do you understand how sedimentation works?" },
        { type: "textMessage", text: "Before we continue to filtration, sink the remaining flocs." },
        {
            type: "custom",
            action: (map) => {
                delete map.buttonSpaces[utils.asGridCoords(37.5, 23)];
                map.updateObjective("Sink the remaining flocs.");
                const ctx = document.querySelector(".game-canvas").getContext("2d");
                Level2.drawSinkSediments(ctx, map);
                Level2.spawnSinkButtons(map);
            }
        },
    ]
};

const transitionToFiltrationEvent = {
    events: [
        { type: "textMessage", text: "Follow me to the filtration stage." },
        // Operator walks left 3 steps
        { type: "walk", who: "operator", direction: "left" },
        { type: "walk", who: "operator", direction: "left" },
        { type: "walk", who: "operator", direction: "left" },
        // Operator walks down 3 steps
        { type: "walk", who: "operator", direction: "down" },
        { type: "walk", who: "operator", direction: "down" },
        {
            type: "custom",
            action: (map) => {
                map.walls[utils.asGridCoords(34.5, 26)] = false;
                // Re-enable player control after the cutscene and delete the operator
                delete map.gameObjects["operator"];
                map.gameObjects["ben"].isPlayerControlled = true;
            }
        }
    ]
};