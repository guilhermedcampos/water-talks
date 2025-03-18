// Events

const addCoagulantsEvent = {  
    type: "custom",
    action: (map) => {
      // Add coagulant objects at fixed positions in the water.
      map.addCoagulants(5);

      // Update the objective 
      map.updateObjective("Mix coagulants");

      // Remove the arrow indicator
      if (map.gameObjects["arrowIndicator"]) {
        // Call destroy method to clear any animation intervals
        if (map.gameObjects["arrowIndicator"].destroy) {
            map.gameObjects["arrowIndicator"].destroy();
        }
        delete map.gameObjects["arrowIndicator"];
    }
      
      // Remove the faucet button so it never shows again.
      delete map.buttonSpaces[utils.asGridCoords(34.5, 12)];
    }
  }

const introLevel1Event = {
    text: "Talk",
    action: "startCutscene",
    events: [
        { type: "textMessage", text: "Welcome to the water treatment facility!", faceHero: "operator" },
        { type: "textMessage", text: "I'm the operator here. Did you know that your toilet flush travels through an extensive sewer system to get here?" },
        { type: "textMessage", text: "The water you flush goes through multiple treatment stages before it's returned to the environment." },
        { type: "textMessage", text: "Your first task is to cleanse this reservoir of visible impurities." },
        { type: "textMessage", text: "Please, collect and dispose of any floating debris or trash contaminating these waters." },
        // Update objective after conversation
        { 
            type: "custom",
            action: (map) => {
                map.talkedToOperator = true;
                map.updateObjective("Surface Sweep: Remove visible debris from the reservoir");
            }
        }
    ]
}

const collectDebris1Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris1"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(28.5), utils.withGrid(18));
                
                // Check if all debris is collected
                map.checkDebrisCollected();
            }
        }
    ]
}

const collectDebris2Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris2"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(31.5), utils.withGrid(19));
                
                // Check if all debris is collected
                map.checkDebrisCollected();
            }
        }
    ]
}

const collectDebris3Event = {
    text: "Collect",
    action: "startCutscene",
    events: [
        { 
            type: "custom",
            action: (map) => {
                // Remove the debris object
                delete map.gameObjects["debris3"];
                
                // Remove the wall at this position to ensure it's not blocking
                map.removeWall(utils.withGrid(25.5), utils.withGrid(20));
                
                // Check if all debris is collected
                map.checkDebrisCollected();
            }
        }
    ]
}

const startCoagulantsEvent = {
    text: "Add Coagulants",
    action: "startCutscene",
    events: [
        { type: "textMessage", text: "You've activated the coagulant dispenser!" },
        { 
            type: "custom",
            action: (map) => {
                // Add coagulant objects at fixed positions in the water
                map.addCoagulants(5);
                
                // Update objective to direct player back to operator immediately
                map.updateObjective("Mix coagulants");
                
                // Remove the arrow indicator
                if (map.gameObjects["arrowIndicator"]) {
                    // Call destroy method to clear any animation intervals
                    if (map.gameObjects["arrowIndicator"].destroy) {
                        map.gameObjects["arrowIndicator"].destroy();
                    }
                    delete map.gameObjects["arrowIndicator"];
                }
                
                // Disable the faucet button after use
                delete map.buttonSpaces[utils.asGridCoords(34.5, 12)];
            }
        }
    ]
}