class Level3 {

    static init(map) {

    }


}

// Constants

const level3GameObjects = {
    ben: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5), 
        src: "images/characters/people/mainCharacter.png",
        id: "ben",
    }),
}

// Events

const initLevel3Event = { events: [ { type: "custom", action: (map) => Level2.initLevel3(map) } ] };

