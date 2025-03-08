(function () {
    console.log('Initializing...');

    // Create a new instance of the Overworld class
    const overworld = new Overworld({
        element: document.querySelector('.game-container')
    });
    overworld.init();
    
})();