/**
 * Wall definitions for all game levels
 * Each level has its own wall configuration to define boundaries and obstacles
 * Walls are stored as key-value pairs where keys are grid coordinates and values are boolean
 */

// Bathroom level walls
const wallsHouse = {        
    // Horizontal walls (top)
    [utils.asGridCoords(45.5, 21)]: true,
    [utils.asGridCoords(46.5, 21)]: true,
    [utils.asGridCoords(47.5, 21)]: true,
    [utils.asGridCoords(48.5, 21)]: true,
    [utils.asGridCoords(49.5, 21)]: true,
    [utils.asGridCoords(50.5, 21)]: true,
    [utils.asGridCoords(51.5, 21)]: true,
    [utils.asGridCoords(52.5, 21)]: true,
    [utils.asGridCoords(53.5, 21)]: true,
    [utils.asGridCoords(54.5, 21)]: true,
    
    // Horizontal walls (bottom)
    [utils.asGridCoords(45.5, 33)]: true,
    [utils.asGridCoords(46.5, 33)]: true,
    [utils.asGridCoords(47.5, 33)]: true,
    [utils.asGridCoords(48.5, 33)]: true,
    [utils.asGridCoords(49.5, 33)]: true,
    [utils.asGridCoords(50.5, 33)]: true,
    [utils.asGridCoords(51.5, 33)]: true,
    [utils.asGridCoords(52.5, 33)]: true,
    [utils.asGridCoords(53.5, 33)]: true,
    [utils.asGridCoords(54.5, 33)]: true,

    // Inner Horizontal walls
    [utils.asGridCoords(45.5, 28)]: true,
    [utils.asGridCoords(46.5, 28)]: true,
    [utils.asGridCoords(47.5, 28)]: true,
    [utils.asGridCoords(48.5, 28)]: true,
    [utils.asGridCoords(50.5, 28)]: true,
    [utils.asGridCoords(50.5, 29)]: true,
    [utils.asGridCoords(51.5, 28)]: true,
    [utils.asGridCoords(51.5, 29)]: true,
    [utils.asGridCoords(52.5, 28)]: true,
    [utils.asGridCoords(52.5, 29)]: true,
    [utils.asGridCoords(53.5, 28)]: true,
    [utils.asGridCoords(53.5, 29)]: true,
    [utils.asGridCoords(54.5, 28)]: true,

    // Vertical walls (right)
    [utils.asGridCoords(54.5, 21)]: true,
    [utils.asGridCoords(54.5, 22)]: true,
    [utils.asGridCoords(54.5, 23)]: true,
    [utils.asGridCoords(54.5, 24)]: true,
    [utils.asGridCoords(54.5, 25)]: true,
    [utils.asGridCoords(54.5, 26)]: true,
    [utils.asGridCoords(54.5, 27)]: true,
    [utils.asGridCoords(54.5, 28)]: true,
    [utils.asGridCoords(54.5, 29)]: true,
    [utils.asGridCoords(54.5, 30)]: true,
    [utils.asGridCoords(54.5, 31)]: true,
    [utils.asGridCoords(54.5, 32)]: true,

    // Vertical walls (left)
    [utils.asGridCoords(44.5, 21)]: true,
    [utils.asGridCoords(44.5, 22)]: true,
    [utils.asGridCoords(44.5, 23)]: true,
    [utils.asGridCoords(44.5, 24)]: true,
    [utils.asGridCoords(44.5, 25)]: true,
    [utils.asGridCoords(44.5, 26)]: true,
    [utils.asGridCoords(44.5, 27)]: true,
    [utils.asGridCoords(44.5, 28)]: true,
    [utils.asGridCoords(44.5, 29)]: true,
    [utils.asGridCoords(44.5, 30)]: true,
    [utils.asGridCoords(44.5, 31)]: true,
    [utils.asGridCoords(44.5, 32)]: true,
};

// Level1 walls - Water treatment primary stage
const level1Walls = {            
    // Vertical walls (left)
    [utils.asGridCoords(44.5, 15)]: true,
    [utils.asGridCoords(44.5, 16)]: true,
    [utils.asGridCoords(44.5, 17)]: true,
    [utils.asGridCoords(44.5, 18)]: true,
    [utils.asGridCoords(44.5, 19)]: true,
    [utils.asGridCoords(44.5, 20)]: true,
    [utils.asGridCoords(44.5, 21)]: true,
    [utils.asGridCoords(44.5, 22)]: true,
    [utils.asGridCoords(44.5, 23)]: true,
    [utils.asGridCoords(44.5, 24)]: true,
    [utils.asGridCoords(44.5, 25)]: true,
    [utils.asGridCoords(44.5, 26)]: true,

    // Horizontal walls (top)
    [utils.asGridCoords(30.5, 15)]: true,
    [utils.asGridCoords(31.5, 15)]: true,
    [utils.asGridCoords(32.5, 15)]: true,
    [utils.asGridCoords(33.5, 15)]: true,
    [utils.asGridCoords(34.5, 15)]: true,
    [utils.asGridCoords(35.5, 15)]: true,
    [utils.asGridCoords(36.5, 15)]: true,
    [utils.asGridCoords(37.5, 15)]: true,
    [utils.asGridCoords(38.5, 15)]: true,
    [utils.asGridCoords(39.5, 15)]: true,
    [utils.asGridCoords(40.5, 15)]: true,
    [utils.asGridCoords(41.5, 15)]: true,
    [utils.asGridCoords(42.5, 15)]: true,
    [utils.asGridCoords(43.5, 15)]: true,
    [utils.asGridCoords(44.5, 15)]: true,

    // Vertical walls (right)
    [utils.asGridCoords(30.5, 26)]: true,
    [utils.asGridCoords(30.5, 25)]: true,
    [utils.asGridCoords(30.5, 24)]: true,
    [utils.asGridCoords(30.5, 23)]: true,
    [utils.asGridCoords(30.5, 22)]: true,
    [utils.asGridCoords(30.5, 21)]: true,
    [utils.asGridCoords(30.5, 20)]: true,
    [utils.asGridCoords(30.5, 19)]: true,
    [utils.asGridCoords(30.5, 18)]: true,
    [utils.asGridCoords(30.5, 17)]: true,
    [utils.asGridCoords(30.5, 16)]: true,
    [utils.asGridCoords(30.5, 15)]: true,

    // Horizontal walls (bottom)
    [utils.asGridCoords(30.5, 26)]: true,
    [utils.asGridCoords(31.5, 26)]: true,
    [utils.asGridCoords(32.5, 26)]: true,
    [utils.asGridCoords(33.5, 26)]: true,
    [utils.asGridCoords(34.5, 26)]: true,
    [utils.asGridCoords(35.5, 26)]: true,
    [utils.asGridCoords(36.5, 26)]: true,
    [utils.asGridCoords(37.5, 26)]: true,
    [utils.asGridCoords(38.5, 26)]: true,
    [utils.asGridCoords(39.5, 26)]: true,
    [utils.asGridCoords(40.5, 26)]: true,
    [utils.asGridCoords(41.5, 26)]: true,
    [utils.asGridCoords(42.5, 26)]: true,
    [utils.asGridCoords(43.5, 26)]: true,
    [utils.asGridCoords(44.5, 26)]: true,
    [utils.asGridCoords(33.5, 25)] : true,
    [utils.asGridCoords(32.5, 25)] : true,

    // Shelf
    [utils.asGridCoords(31.5, 19)]: true,
    [utils.asGridCoords(31.5, 20)]: true,

    // Alarm
    [utils.asGridCoords(31.5, 16)]: true,

    // Cano Baixo
    [utils.asGridCoords(35.5, 25)]: true,
    [utils.asGridCoords(36.5, 25)]: true,
    [utils.asGridCoords(37.5, 25)]: true,
    [utils.asGridCoords(38.5, 25)]: true,
    [utils.asGridCoords(39.5, 25)]: true,

    // Canos Cima
    [utils.asGridCoords(43.5, 19)]: true,
    [utils.asGridCoords(43.5, 18)]: true,
    [utils.asGridCoords(43.5, 17)]: true,

    [utils.asGridCoords(42.5, 16)]: true,
    [utils.asGridCoords(41.5, 16)]: true,
};

// Level2 walls - Sedimentation tank
const level2Walls = {

    // Cutscene walls
    [utils.asGridCoords(36.5, 17)]: true,
    [utils.asGridCoords(35.5, 18)]: true,
    
    // Horizontal walls (top)
    [utils.asGridCoords(25.5, 16)]: true,
    [utils.asGridCoords(26.5, 16)]: true,
    [utils.asGridCoords(27.5, 16)]: true,
    [utils.asGridCoords(28.5, 16)]: true,
    [utils.asGridCoords(29.5, 16)]: true,
    [utils.asGridCoords(30.5, 16)]: true,
    [utils.asGridCoords(31.5, 16)]: true,
    [utils.asGridCoords(32.5, 16)]: true,
    [utils.asGridCoords(33.5, 16)]: true,
    [utils.asGridCoords(34.5, 16)]: true,
    [utils.asGridCoords(35.5, 16)]: true,
    [utils.asGridCoords(36.5, 16)]: true,
    [utils.asGridCoords(37.5, 16)]: true,
    [utils.asGridCoords(38.5, 16)]: true,
    [utils.asGridCoords(39.5, 16)]: true,

    // Vertical walls (right)
    [utils.asGridCoords(39.5, 17)]: true,
    [utils.asGridCoords(39.5, 18)]: true,
    [utils.asGridCoords(39.5, 19)]: true,
    [utils.asGridCoords(39.5, 20)]: true,
    [utils.asGridCoords(39.5, 21)]: true,
    [utils.asGridCoords(39.5, 22)]: true,
    [utils.asGridCoords(39.5, 23)]: true,
    [utils.asGridCoords(39.5, 24)]: true,
    [utils.asGridCoords(39.5, 25)]: true,
    [utils.asGridCoords(39.5, 26)]: true,

    // Horizontal walls (bottom)
    [utils.asGridCoords(25.5, 26)]: true,
    [utils.asGridCoords(26.5, 26)]: true,
    [utils.asGridCoords(27.5, 26)]: true,
    [utils.asGridCoords(28.5, 26)]: true,
    [utils.asGridCoords(29.5, 26)]: true,
    [utils.asGridCoords(30.5, 26)]: true,
    [utils.asGridCoords(31.5, 26)]: true,
    [utils.asGridCoords(32.5, 26)]: true,
    [utils.asGridCoords(33.5, 26)]: true,
    [utils.asGridCoords(34.5, 26)]: true,
    [utils.asGridCoords(35.5, 27)]: true,
    [utils.asGridCoords(34.5, 27)]: true,
    [utils.asGridCoords(35.5, 26)]: true,
    [utils.asGridCoords(36.5, 26)]: true,
    [utils.asGridCoords(37.5, 26)]: true,
    [utils.asGridCoords(38.5, 26)]: true,
    [utils.asGridCoords(39.5, 26)]: true,

    // Vertical walls (left)
    [utils.asGridCoords(25.5, 17)]: true,
    [utils.asGridCoords(25.5, 18)]: true,
    [utils.asGridCoords(25.5, 19)]: true,
    [utils.asGridCoords(25.5, 20)]: true,
    [utils.asGridCoords(25.5, 21)]: true,
    [utils.asGridCoords(25.5, 22)]: true,
    [utils.asGridCoords(25.5, 23)]: true,
    [utils.asGridCoords(25.5, 24)]: true,
    [utils.asGridCoords(25.5, 25)]: true,
    [utils.asGridCoords(25.5, 26)]: true,

    // Vertical Tube
    [utils.asGridCoords(26.5, 26)]: true,
    [utils.asGridCoords(26.5, 25)]: true,
    [utils.asGridCoords(26.5, 24)]: true,
    [utils.asGridCoords(26.5, 23)]: true,
    [utils.asGridCoords(26.5, 22)]: true,
    [utils.asGridCoords(26.5, 21)]: true,
    [utils.asGridCoords(26.5, 20)]: true,
    [utils.asGridCoords(26.5, 19)]: true,
    [utils.asGridCoords(26.5, 18)]: true,
    [utils.asGridCoords(26.5, 17)]: true,

    [utils.asGridCoords(27.5, 19)]: true,
    [utils.asGridCoords(27.5, 18)]: true,
    [utils.asGridCoords(27.5, 17)]: true,

    [utils.asGridCoords(27.5, 25)]: true,
    [utils.asGridCoords(28.5, 25)]: true,
    [utils.asGridCoords(29.5, 25)]: true,

    [utils.asGridCoords(38.5, 19)]: true,
    [utils.asGridCoords(38.5, 18)]: true,
    [utils.asGridCoords(38.5, 17)]: true,

    // Desk
    [utils.asGridCoords(38.5, 23)]: true,
    [utils.asGridCoords(38.5, 24)]: true,
    [utils.asGridCoords(38.5, 25)]: true,
    [utils.asGridCoords(37.5, 25)]: true,
}

// Level5 walls - Final stage of distribution
const level5Walls = {
    // Vertical left wall
    [utils.asGridCoords(22.5, 21)]: true,
    [utils.asGridCoords(22.5, 22)]: true,
    [utils.asGridCoords(22.5, 23)]: true,
    [utils.asGridCoords(22.5, 24)]: true,
    [utils.asGridCoords(22.5, 25)]: true,
    [utils.asGridCoords(22.5, 26)]: true,
    [utils.asGridCoords(22.5, 27)]: true,
    [utils.asGridCoords(22.5, 28)]: true,
    [utils.asGridCoords(22.5, 20)]: true,
    [utils.asGridCoords(22.5, 19)]: true,
    [utils.asGridCoords(22.5, 18)]: true,
    [utils.asGridCoords(22.5, 17)]: true,
    [utils.asGridCoords(22.5, 16)]: true,

    // Vertical right wall
    [utils.asGridCoords(37.5, 16)]: true,
    [utils.asGridCoords(37.5, 17)]: true,
    [utils.asGridCoords(37.5, 18)]: true,
    [utils.asGridCoords(37.5, 19)]: true,
    [utils.asGridCoords(37.5, 20)]: true,
    [utils.asGridCoords(37.5, 21)]: true,
    [utils.asGridCoords(37.5, 22)]: true,
    [utils.asGridCoords(37.5, 23)]: true,
    [utils.asGridCoords(37.5, 24)]: true,
    [utils.asGridCoords(37.5, 25)]: true,
    [utils.asGridCoords(37.5, 26)]: true,
    [utils.asGridCoords(37.5, 27)]: true,
    [utils.asGridCoords(37.5, 28)]: true,

    // Horizontal top wall
    [utils.asGridCoords(23.5, 17)]: true,
    [utils.asGridCoords(24.5, 17)]: true,
    [utils.asGridCoords(25.5, 17)]: true,
    [utils.asGridCoords(26.5, 17)]: true,
    [utils.asGridCoords(27.5, 17)]: true,
    [utils.asGridCoords(28.5, 17)]: true,
    [utils.asGridCoords(29.5, 17)]: true,
    [utils.asGridCoords(30.5, 17)]: true,
    [utils.asGridCoords(31.5, 17)]: true,
    [utils.asGridCoords(32.5, 17)]: true,
    [utils.asGridCoords(33.5, 17)]: true,
    [utils.asGridCoords(34.5, 17)]: true,
    [utils.asGridCoords(35.5, 17)]: true,
    [utils.asGridCoords(36.5, 17)]: true,
    [utils.asGridCoords(37.5, 17)]: true,
    [utils.asGridCoords(38.5, 17)]: true,

    // Horizontal bottom wall
    [utils.asGridCoords(23.5, 27)]: true,
    [utils.asGridCoords(24.5, 27)]: true,
    [utils.asGridCoords(25.5, 27)]: true,
    [utils.asGridCoords(26.5, 27)]: true,
    [utils.asGridCoords(27, 27)]: true,
    [utils.asGridCoords(28.5, 27)]: true,
    [utils.asGridCoords(29.5, 27)]: true,
    [utils.asGridCoords(30.5, 27)]: true,
    [utils.asGridCoords(31.5, 27)]: true,
    [utils.asGridCoords(32, 27)]: true,
    [utils.asGridCoords(33.5, 27)]: true,
    [utils.asGridCoords(34.5, 27)]: true,
    [utils.asGridCoords(35.5, 27)]: true,
    [utils.asGridCoords(36.5, 27)]: true,
    [utils.asGridCoords(37.5, 27)]: true,
    [utils.asGridCoords(38.5, 27)]: true,
    
    // Operator position wall
    [utils.asGridCoords(31.5, 20)]: true,
};

const level3Walls = {
    // Vertical Locker 
    [utils.asGridCoords(25.5, 19)]: true,
    [utils.asGridCoords(25.5, 20)]: true,
    [utils.asGridCoords(25.5, 21)]: true,

    // Vertical wall left
    [utils.asGridCoords(24.5, 16)]: true,
    [utils.asGridCoords(24.5, 17)]: true,
    [utils.asGridCoords(24.5, 18)]: true,
    [utils.asGridCoords(24.5, 19)]: true,
    [utils.asGridCoords(24.5, 20)]: true,
    [utils.asGridCoords(24.5, 21)]: true,
    [utils.asGridCoords(24.5, 22)]: true,
    [utils.asGridCoords(24.5, 23)]: true,
    [utils.asGridCoords(24.5, 24)]: true,
    [utils.asGridCoords(24.5, 25)]: true,
    [utils.asGridCoords(24.5, 26)]: true,

    // Bottom wall
    [utils.asGridCoords(25.5, 26)]: true,
    [utils.asGridCoords(26.5, 26)]: true,
    [utils.asGridCoords(27.5, 26)]: true,
    [utils.asGridCoords(28.5, 26)]: true,
    [utils.asGridCoords(29.5, 26)]: true,
    [utils.asGridCoords(30.5, 26)]: true,
    [utils.asGridCoords(31.5, 26)]: true,
    [utils.asGridCoords(32.5, 26)]: true,
    [utils.asGridCoords(33.5, 26)]: true,
    [utils.asGridCoords(34.5, 26)]: true,
    [utils.asGridCoords(35.5, 26)]: true,
    [utils.asGridCoords(36.5, 26)]: true,
    [utils.asGridCoords(37.5, 26)]: true,
    [utils.asGridCoords(38.5, 26)]: true,

    // Vertical wall right
    [utils.asGridCoords(38.5, 16)]: true,
    [utils.asGridCoords(38.5, 17)]: true,
    [utils.asGridCoords(38.5, 18)]: true,
    [utils.asGridCoords(38.5, 19)]: true,
    [utils.asGridCoords(38.5, 20)]: true,
    [utils.asGridCoords(38.5, 21)]: true,
    [utils.asGridCoords(38.5, 22)]: true,
    [utils.asGridCoords(38.5, 23)]: true,
    [utils.asGridCoords(38.5, 24)]: true,
    [utils.asGridCoords(38.5, 25)]: true,

    // Top wall
    [utils.asGridCoords(24.5, 16)]: true,
    [utils.asGridCoords(25.5, 16)]: true,
    [utils.asGridCoords(26.5, 16)]: true,
    [utils.asGridCoords(27.5, 16)]: true,
    [utils.asGridCoords(28.5, 16)]: true,
    [utils.asGridCoords(29.5, 16)]: true,
    [utils.asGridCoords(30.5, 16)]: true,
    [utils.asGridCoords(31.5, 16)]: true,
    [utils.asGridCoords(32.5, 16)]: true,
    [utils.asGridCoords(33.5, 16)]: true,
    [utils.asGridCoords(34.5, 16)]: true,
    [utils.asGridCoords(35.5, 16)]: true,
    [utils.asGridCoords(36.5, 16)]: true,
    [utils.asGridCoords(37.5, 16)]: true,

    // Red Tubes
    [utils.asGridCoords(29.5, 17)]: true,
    [utils.asGridCoords(30.5, 17)]: true,
    [utils.asGridCoords(31.5, 17)]: true,
    [utils.asGridCoords(32.5, 17)]: true,
    [utils.asGridCoords(33.5, 17)]: true,
    [utils.asGridCoords(34.5, 17)]: true,
    [utils.asGridCoords(35.5, 17)]: true,
    [utils.asGridCoords(36.5, 17)]: true,

    // Vertical Tube
    [utils.asGridCoords(37.5, 17)]: true,
    [utils.asGridCoords(37.5, 18)]: true,
    [utils.asGridCoords(37.5, 19)]: true,
    [utils.asGridCoords(37.5, 20)]: true,
    [utils.asGridCoords(37.5, 21)]: true,
    [utils.asGridCoords(37.5, 22)]: true,
    [utils.asGridCoords(37.5, 23)]: true,
    [utils.asGridCoords(37.5, 24)]: true,
    [utils.asGridCoords(37.5, 25)]: true,

    // Other 
    [utils.asGridCoords(36.5, 22)]: true,
    [utils.asGridCoords(36.5, 20)]: true,
    [utils.asGridCoords(36.5, 19)]: true,
    [utils.asGridCoords(35.5, 19)]: true,

    // Horizontal bottom tube
    [utils.asGridCoords(28.5, 25)]: true,
    [utils.asGridCoords(27.5, 25)]: true,
    [utils.asGridCoords(26.5, 25)]: true,
    [utils.asGridCoords(25.5, 25)]: true,

};

const level4Walls = {
    // Vertical wall left
    [utils.asGridCoords(26.5, 19)]: true,
    [utils.asGridCoords(26.5, 20)]: true,
    [utils.asGridCoords(26.5, 21)]: true,
    [utils.asGridCoords(26.5, 22)]: true,
    [utils.asGridCoords(26.5, 23)]: true,
    [utils.asGridCoords(26.5, 24)]: true,
    [utils.asGridCoords(26.5, 25)]: true,
    [utils.asGridCoords(26.5, 26)]: true,
    [utils.asGridCoords(26.5, 27)]: true,

    // Bottom wall
    [utils.asGridCoords(26.5, 28)]: true,
    [utils.asGridCoords(27.5, 28)]: true,
    [utils.asGridCoords(28.5, 28)]: true,
    [utils.asGridCoords(29.5, 28)]: true,
    [utils.asGridCoords(30.5, 28)]: true,
    [utils.asGridCoords(31.5, 28)]: true,
    [utils.asGridCoords(32.5, 28)]: true,
    [utils.asGridCoords(33.5, 28)]: true,
    [utils.asGridCoords(34.5, 28)]: true,
    [utils.asGridCoords(35.5, 28)]: true,
    [utils.asGridCoords(36.5, 28)]: true,
    [utils.asGridCoords(37.5, 28)]: true,
    [utils.asGridCoords(38.5, 28)]: true,
    [utils.asGridCoords(39.5, 28)]: true,
    [utils.asGridCoords(40.5, 28)]: true,

    // Vertical wall right
    [utils.asGridCoords(40.5, 19)]: true,
    [utils.asGridCoords(40.5, 20)]: true,
    [utils.asGridCoords(40.5, 21)]: true,
    [utils.asGridCoords(40.5, 22)]: true,
    [utils.asGridCoords(40.5, 23)]: true,
    [utils.asGridCoords(40.5, 24)]: true,
    [utils.asGridCoords(40.5, 25)]: true,
    [utils.asGridCoords(40.5, 26)]: true,
    [utils.asGridCoords(40.5, 27)]: true,

    // Top wall
    [utils.asGridCoords(26.5, 18)]: true,
    [utils.asGridCoords(27.5, 18)]: true,
    [utils.asGridCoords(28.5, 18)]: true,
    [utils.asGridCoords(29.5, 18)]: true,
    [utils.asGridCoords(30.5, 18)]: true,
    [utils.asGridCoords(31.5, 18)]: true,
    [utils.asGridCoords(32.5, 18)]: true,
    [utils.asGridCoords(33.5, 18)]: true,
    [utils.asGridCoords(34.5, 18)]: true,
    [utils.asGridCoords(35.5, 18)]: true,
    [utils.asGridCoords(36.5, 18)]: true,
    [utils.asGridCoords(37.5, 18)]: true,
    [utils.asGridCoords(38.5, 18)]: true,
    [utils.asGridCoords(39.5, 18)]: true,
    [utils.asGridCoords(40.5, 18)]: true,

    // Pool
    [utils.asGridCoords(33.5, 19)]: true,
    [utils.asGridCoords(33.5, 20)]: true,
    [utils.asGridCoords(33.5, 21)]: true,
    [utils.asGridCoords(33.5, 22)]: true,

    //Counter
    [utils.asGridCoords(33.5, 23)]: true,
    [utils.asGridCoords(32.5, 23)]: true,
    [utils.asGridCoords(31.5, 23)]: true,
    [utils.asGridCoords(30.5, 23)]: true,
    [utils.asGridCoords(29.5, 23)]: true,
    [utils.asGridCoords(28.5, 23)]: true,
    [utils.asGridCoords(27.5, 23)]: true,
};