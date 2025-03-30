class Level4{
    static init(map){
        // Set initial objective
        if (map && map.updateObjective) {
            console.log("Setting initial objective for Level4");
            map.updateObjective("Talk to the operator about desinfection.");
        }
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
                    // Temporarily disable the behaviorLoop
                    operator.savedBehaviorLoop = operator.behaviorLoop; // Save the current behaviorLoop
                    operator.behaviorLoop = []; // Disable the behaviorLoop
                }

                delete map.buttonSpaces[utils.asGridCoords(34.5, 22)];
                delete map.buttonSpaces[utils.asGridCoords(33.5, 23)];
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
            }
        },
    ]
}