class Level2 {

    static startSedimentationStage(map) {
        console.log("Starting sedimentation stage");

        // Start the cutscene with the combined operatorWalkEvent
        map.startCutscene(operatorWalkEvent);
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
}

// Constants


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

