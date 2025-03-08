class GameObject {
    constructor(config) {
        // The id of the game object
        this.id = null;

        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "images/characters/people/ben.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorIndex = 0;
    }

    // Mount the game object to the map
    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // If we have a behavior loop, start the behavior loop with delay
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    update() {

    }

    // Do the behavior event, async tells us that this function returns a promise
    async doBehaviorEvent(map) {

        // If a cutscene is playing, or there is no behavior loop, return
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {  
            return; 
        }
        // Get the current event
        let eventConfig = this.behaviorLoop[this.behaviorIndex];
        eventConfig.who = this.id;

        // Create a new instance of the OverworldEvent class
        const eventHandler = new OverworldEvent({ map, event: eventConfig});
        await eventHandler.init(); // returns promise

        // Once the event is done, increment the behavior index
        this.behaviorIndex += 1;
        if (this.behaviorIndex === this.behaviorLoop.length) {
            // If we've reached the end of the behavior loop, start over
            this.behaviorIndex = 0;
        }

        // Fire the next event
        this.doBehaviorEvent(map);
    }
}