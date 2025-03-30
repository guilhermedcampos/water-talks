class Level4{
    static init(map){
        // Set initial objective
        if (map && map.updateObjective) {
            console.log("Setting initial objective for Level3");
            map.updateObjective("Talk to the operator about desinfection.");
        }
    }
}

//constants
const level4GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(36),
        y: utils.withGrid(17), 
        src: "images/characters/people/mainCharacter.png",
        id: "ben",
    }),
}