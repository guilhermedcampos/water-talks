class OverworldEvent {
    constructor({map, event}) {
        this.map = map;
        this.event = event;
    }

    // Initialize the event
    init() {
        return new Promise(resolve => {
            // Call the event type
            this[this.event.type](resolve)
        });
    }

    stand(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map,
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time,
        })

            
        //Set up a handler to complete when correct person is done walking, then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
            document.removeEventListener("PersonStandComplete", completeHandler);
            resolve();
            }
        }
        document.addEventListener("PersonStandComplete", completeHandler);
    }

    
    walk(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map,
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        // Set up handler to complete if correct person finished walking, then resolve event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    textMessage(resolve){

        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.getOppositeDirection(this.map.gameObjects["ben"].direction);
        }

        // Create a new text message
        const msg = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        });
        
        // Initialize the text message at the game container
        msg.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {
        // Use the spawnpoint defined in the map config if no specific coordinates are given
        const targetMap = window.OverworldMaps[this.event.map];
        
        // Start the new map
        this.map.overworld.startMap(targetMap, {
            x: this.event.x || targetMap.spawnpoint.x,
            y: this.event.y || targetMap.spawnpoint.y,
            direction: this.event.direction
        });
        
        resolve();
    }

    custom(resolve) {
        if (this.event.action) {
            this.event.action(this.map);
        }
        resolve();
    }
        

}