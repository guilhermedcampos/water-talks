class Level2 {

    static startSedimentationStage(map) {
        console.log("Starting sedimentation stage");
        map.updateObjective("Follow the operator to the computer.");

        // Start the cutscene with the combined operatorWalkEvent
        map.startCutscene(operatorWalkEvent);
    }

    static showSedimentationOverlay(map) {
    // Move ben and operator off the grid temp
    map.gameObjects["ben"].isPlayerControlled = false;

    map.gameObjects["ben"].x = utils.withGrid(-10);
    map.gameObjects["ben"].y = utils.withGrid(-10);

    map.gameObjects["operator"].x = utils.withGrid(-10);
    map.gameObjects["operator"].y = utils.withGrid(-10);

    // Change the upperSrc to the sedimentation overlay image
    map.lowerImage.src = "images/maps/Level2Sedimentation.png";
    map.isCutscenePlaying = true;

    // Get the canvas context
    const ctx = document.querySelector(".game-canvas").getContext("2d");

    // Force the map to re-render to reflect the changes
    map.drawLowerImage(ctx, map.gameObjects["ben"]);
    
    // Change the camera focus to a different position
    map.cameraPerson = { x: utils.withGrid(36.5), y: utils.withGrid(23) };

    Level2.drawSediments(ctx, map);
    }

    static drawSediments(ctx, map) {
        const sedimentsPositions = [
            { x: 39.5, y: 24 },
            { x: 37.5, y: 22 }, 
            { x: 36.5, y: 23 },
            { x: 35.5, y: 22 },
            { x: 34.5, y: 24 },
            { x: 32.5, y: 23 },
        ];

        sedimentsPositions.forEach((position, index) => {
            const sedimentId = `sediment${index + 1}`;
            const sediment = map.gameObjects[sedimentId];
            if (sediment) {
                sediment.x = utils.withGrid(position.x);
                sediment.y = utils.withGrid(position.y);
            }
        });
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

const sedimentsPositons = [
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

