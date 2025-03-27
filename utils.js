/**
 * Utility functions for the Water Talks game
 * Contains helper methods for grid calculations, movement, and event handling
 */
const utils = { 
    /**
     * Converts a grid coordinate to pixel position
     * The game uses a 16x16 pixel grid system for positioning
     * 
     * @param {Number} n - Grid coordinate (1 = 16 pixels)
     * @returns {Number} - Position in pixels
     */
    withGrid(n) {
        return n * 16;
    },
    
    /**
     * Converts x and y coordinates to a string key for map lookups
     * Used for wall and interaction detection in grid-based maps
     * 
     * @param {Number} x - X coordinate in grid units
     * @param {Number} y - Y coordinate in grid units
     * @returns {String} - String in format "x,y" where x and y are in pixels
     */
    asGridCoords(x, y) {
        return `${x*16},${y*16}`;
    },

    /**
     * Calculates the next position based on current position and direction
     * Used for movement and collision detection
     * 
     * @param {Number} initX - Initial X position in pixels
     * @param {Number} initY - Initial Y position in pixels
     * @param {String} direction - Direction to move ("up", "down", "left", "right")
     * @returns {Object} - New position as {x, y} in pixels
     */
    nextPosition(initX, initY, direction) {
        let x = initX;
        let y = initY;
        const size = 16;  // Size of one grid cell in pixels
        
        // Adjust Y coordinate for vertical movement
        if (direction === "up") {
            y -= size;
        } else if (direction === "down") { 
            y += size;
        }
        
        // Adjust X coordinate for horizontal movement
        if (direction === "left") {
            x -= size;
        } else if (direction === "right") {
            x += size;
        }

        // Return the new position
        return { x, y };
    },

    /**
     * Returns the opposite direction of the given direction
     * Useful for character facing and movement calculations
     * 
     * @param {String} direction - Input direction ("up", "down", "left", "right")
     * @returns {String} - Opposite direction
     */
    getOppositeDirection(direction) {
        switch(direction) {
            case "up":
                return "down";
            case "down":
                return "up";
            case "left":
                return "right";
            case "right":
                return "left";
            default:
                return direction; // Return unchanged if not a recognized direction
        }
    },

    /**
     * Creates and dispatches a custom event
     * Used for game-wide communication between components
     * 
     * @param {String} name - Name of the event to emit
     * @param {Object} detail - Data to include with the event
     */
    emitEvent(name, detail) {
        const event = new CustomEvent(name, {
            detail
        });
        document.dispatchEvent(event);
    },
    
    /**
     * Calculates distance between two points
     * Useful for proximity-based interactions
     * 
     * @param {Number} x1 - First point X coordinate
     * @param {Number} y1 - First point Y coordinate
     * @param {Number} x2 - Second point X coordinate
     * @param {Number} y2 - Second point Y coordinate
     * @returns {Number} - Distance between points
     */
    distance(x1, y1, x2, y2) {
        return Math.sqrt(
            Math.pow(x2 - x1, 2) + 
            Math.pow(y2 - y1, 2)
        );
    },
    
    /**
     * Checks if a value is between min and max (inclusive)
     * Useful for boundary checks
     * 
     * @param {Number} value - Value to check
     * @param {Number} min - Minimum acceptable value
     * @param {Number} max - Maximum acceptable value
     * @returns {Boolean} - True if value is between min and max
     */
    isBetween(value, min, max) {
        return value >= min && value <= max;
    },
    
    /**
     * Returns a random integer between min and max (inclusive)
     * Used for random selections and behaviors
     * 
     * @param {Number} min - Minimum value (inclusive)
     * @param {Number} max - Maximum value (inclusive)
     * @returns {Number} - Random integer
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};