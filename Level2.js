class Level2 {

    static startSedimentationStage(map) {

    // Create walking event sequence
    const walkEvents = [];
    
    // Add events for operator to walk down 7 steps
    for (let i = 0; i < 7; i++) {
        walkEvents.push({ type: "walk", who: "operator", direction: "down" });
    }
    
    // Add events for operator to walk right 3 steps
    for (let i = 0; i < 3; i++) {
        walkEvents.push({ type: "walk", who: "operator", direction: "right" });
    }
    
    // After walking, add explanation of sedimentation
    walkEvents.push({ type: "textMessage", text: "This is the sedimentation tank where the flocs we formed earlier settle to the bottom.", faceHero: "operator" });
    walkEvents.push({ type: "textMessage", text: "Gravity does most of the work here - the heavier particles gradually sink, leaving clearer water at the top." });
    walkEvents.push({ type: "textMessage", text: "Your task is to manage the sedimentation process for optimal results." });
    
    // Update objective
    walkEvents.push({ 
        type: "custom", 
        action: (map) => {
            map.updateObjective("Watch flocs settle in the sedimentation tank.");
        }
    });
    
    map.startCutscene(walkEvents);
    }
}


// Constants

const level2GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5), 
        src: "images/characters/people/mainCharacter.png"
    }),
    
    // Update the operator in the Level1 map
    operator: new Person({
        x: utils.withGrid(34.5),
        y: utils.withGrid(17),
        src: "images/characters/people/operator.png",
        // Make the operator stand still by using a simple behavior loop
        // with only one standing direction for a very long time
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ],
    }),
}

// Events