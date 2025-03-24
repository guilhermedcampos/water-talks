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
        map.gameObjects["ben"].x = utils.withGrid(-10);
        map.gameObjects["ben"].y = utils.withGrid(-10);

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

        // Draw sediments with a timeout of half second between each drawing
        setTimeout(() => Level2.drawSediments(ctx, map, 1), 1000);
        setTimeout(() => Level2.drawSediments(ctx, map, 1.25), 1250);
        setTimeout(() => Level2.drawSediments(ctx, map, 1.5), 1500);
        setTimeout(() => Level2.drawSediments(ctx, map, 1.75), 1750);
        setTimeout(() => Level2.drawSediments(ctx, map, 2), 2000);
        setTimeout(() => Level2.drawSediments(ctx, map, 2.25), 2250);
        setTimeout(() => Level2.drawSediments(ctx, map, 2.5), 2500);
        setTimeout(() => Level2.drawSediments(ctx, map, 2.75), 2750);
        setTimeout(() => Level2.drawSediments(ctx, map, 3), 3000);
        setTimeout(() => Level2.drawSediments(ctx, map, 3.25), 3250);
        setTimeout(() => Level2.drawSediments(ctx, map, 3.5), 3500);
        setTimeout(() => Level2.drawSediments(ctx, map, 3.75), 3750);
        setTimeout(() => Level2.drawSediments(ctx, map, 4), 4000);
        setTimeout(() => Level2.drawSediments(ctx, map, 4.25), 4250);
        setTimeout(() => Level2.drawSediments(ctx, map, 4.5), 4500);
        setTimeout(() => Level2.drawSediments(ctx, map, 4.75), 4750);
        setTimeout(() => Level2.drawSediments(ctx, map, 5), 5000);
    }

    static drawSediments(ctx, map, offset) {
        const sedimentsPositions = [
            { x: 39.5, y: 24 + offset},
            { x: 37.5, y: 22 + offset}, 
            { x: 36.5, y: 23 + offset},
            { x: 35.5, y: 22 + offset},
            { x: 34.5, y: 24 + offset},
            { x: 32.5, y: 23 + offset},
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



// Events

const initLevel2Event = { events: [ { type: "custom", action: (map) => Level1.initLevel2(map) } ] };

const operatorWalkEvent = [
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

