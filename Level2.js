// Constants

level2GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5), 
        src: "images/characters/people/mainUnderwater.png"
    }),
    
    // Update the operator in the Level1 map
    operator: new Person({
        x: utils.withGrid(25.5),
        y: utils.withGrid(12),
        src: "images/characters/people/operator.png",
        // Make the operator stand still by using a simple behavior loop
        // with only one standing direction for a very long time
        behaviorLoop: [
            { type: "stand", direction: "down", time: 999999 }
        ],
    }),
}