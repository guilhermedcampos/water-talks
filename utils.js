const utils = { 
    // Converts coordinate to grid coordinate
    withGrid(n) {
        return n * 16;
    },
    // Converts x and y to a string in the format "x,y"
    asGridCoords(x, y) {
        return `${x*16},${y*16}`;
    },

    // Calculates the next position of a game object
    nextPosition(initX, initY, direction) {
        let x = initX;
        let y = initY;
        const size = 16;
        if (direction === "up") {
            y -= size;
        } else if (direction === "down") { 
            y += size;
        }
        if (direction === "left") {
            x -= size;
        } else if (direction === "right") {
            x += size;
        }

        // Return the new position
        return { x, y };
    },

    emitEvent(name, detail) {
        const event = new CustomEvent(name, {
            detail
        });
        document.dispatchEvent(event);
    }
}