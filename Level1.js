class Level1 {
    
    // Static helper methods
    static isOperatorPosition(map, x, y) {
        if (!map.gameObjects["operator"]) return false;
        
        const operatorX = map.gameObjects["operator"].x;
        const operatorY = map.gameObjects["operator"].y;
        
        // Check if position is adjacent to operator (in all 4 directions)
        return (
            (x === operatorX && y === operatorY - 16) || // above
            (x === operatorX + 16 && y === operatorY) || // right
            (x === operatorX && y === operatorY + 16) || // below
            (x === operatorX - 16 && y === operatorY)    // left
        );
    }
 
    // Level1-specific button trigger logic
    static checkForButtonTriggerLevel1(map, hero, buttonMatch) {
        // Control access to operator dialogue based on game state
        if (buttonMatch.text === "Talk" && Level1.isOperatorPosition(map, hero.x, hero.y)) {
            // Check if all debris are collected
            const debrisCount = Object.keys(map.gameObjects).filter(key => key.startsWith("debris")).length;
            
            // Check if all coagulants are mixed
            const coagulantCount = Object.keys(map.gameObjects).filter(key => key.startsWith("coagulant")).length;
            
            // Check if all flocs are observed
            const observedFlocs = map.observedFlocs ? Object.keys(map.observedFlocs).length : 0;
            const totalFlocs = Object.keys(map.gameObjects).filter(key => key.startsWith("floc")).length;
            const allFlocsObserved = observedFlocs === totalFlocs && totalFlocs > 0;
            
            // Different stages of the game
            if (debrisCount > 0 && !map.talkedToOperator) {
                // Initial stage: Allow first conversation with operator
                return true;
            } else if (debrisCount > 0 && map.talkedToOperator) {
                // Still need to collect debris - don't allow talking to operator again
                return false;
            } else if (debrisCount === 0 && !map.coagulantsStageStarted) {
                // Debris collected but coagulant stage not started - allow talking
                return true;
            } else if (coagulantCount > 0) {
                // Still need to mix coagulants - don't allow talking to operator
                return false;
            } else if (coagulantCount === 0 && totalFlocs === 0) {
                // All coagulants mixed but flocs not added - allow talking
                return true;
            } else if (!allFlocsObserved) {
                // Still need to observe flocs - don't allow talking to operator
                return false;
            } else {
                // All tasks completed - allow talking to operator
                return true;
            }
        } else if (buttonMatch.text === "Add Coagulants" && !map.coagulantsStageStarted) {
            // Don't show coagulant button until stage is started
            return false;
        } else if (buttonMatch.text === "Collect" && !map.talkedToOperator) {
            // Don't show collect button until operator is talked to
            return false;
        } else {
            // For all other buttons (Collect, Mix, Observe), show them if conditions are met
            return true;
        }
    }
}






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
