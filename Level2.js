class Level2 {

    static startSedimentationStage(map) {
        console.log("Starting sedimentation stage");

        // Create walking event sequence
        const walkEvents = [
            { type: "textMessage", text: "Welcome to the Sedimentation Stage!" },
            { type: "textMessage", text: "Follow me, I'll show you how this process works." },
        ];

        // Add events for operator to walk down 7 steps
        for (let i = 0; i < 7; i++) {
            walkEvents.push({ type: "walk", who: "operator", direction: "down" });
        }

        // Add events for operator to walk right 3 steps
        for (let i = 0; i < 3; i++) {
            walkEvents.push({ type: "walk", who: "operator", direction: "right" });
        }

        walkEvents.push({ type: "stand", who: "operator", direction: "right", time: 1 });

        // After walking, add explanation of sedimentation
        walkEvents.push({ type: "textMessage", text: "This is the sedimentation tank where the flocs we formed earlier settle to the bottom." });
        walkEvents.push({ type: "textMessage", text: "Gravity does most of the work here - the heavier particles gradually sink, leaving clearer water at the top." });
        walkEvents.push({ type: "textMessage", text: "Your task is to watch and learn how these flocs sink." });

        // Update objective
        walkEvents.push({ 
            type: "custom", 
            action: (map) => {
                map.updateObjective("Watch the flocs settle to the bottom of the tank with the computer.");
            }
        });

        // Start the cutscene
        map.startCutscene(walkEvents);
    }
}

// Constants

const level2GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5), 
        src: "images/characters/people/mainCharacter.png",
        id: "ben"
    }),
    
    operator: new Person({
        x: utils.withGrid(34.5),
        y: utils.withGrid(17),
        src: "images/characters/people/operator.png",
        id: "operator",
        behaviorLoop: [
            
        ],
    }),
}

// Events

const initLevel2Event = { events: [ { type: "custom", action: (map) => Level1.initLevel2(map) } ] };