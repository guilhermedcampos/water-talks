(function() {
    console.log('Initializing...');

    // Show introduction context about the character before game start
    function showIntroduction() {
        // Create overlay for introduction
        const introOverlay = document.createElement("div");
        introOverlay.style.position = "fixed";
        introOverlay.style.top = "0";
        introOverlay.style.left = "0";
        introOverlay.style.width = "100%";
        introOverlay.style.height = "100%";
        introOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        introOverlay.style.zIndex = "1000";
        introOverlay.style.display = "flex";
        introOverlay.style.flexDirection = "column";
        introOverlay.style.justifyContent = "center";
        introOverlay.style.alignItems = "center";
        introOverlay.style.padding = "20px";
        
        // Create initial title and button container
        const initialContainer = document.createElement("div");
        initialContainer.id = "initial-container";
        initialContainer.style.textAlign = "center";
        initialContainer.style.color = "white";
        
        // Create game title
        const gameTitle = document.createElement("h1");
        gameTitle.textContent = "Water Talks";
        gameTitle.style.fontFamily = "'Pixelify Sans', sans-serif";
        gameTitle.style.fontSize = "60px";
        gameTitle.style.color = "white";
        gameTitle.style.marginBottom = "40px";
        gameTitle.style.textShadow = "0 0 10px rgba(0, 150, 255, 0.5)";
        initialContainer.appendChild(gameTitle);
        
        // Create subtitle
        const subtitle = document.createElement("p");
        subtitle.textContent = "A journey through Lisbon's water system";
        subtitle.style.fontFamily = "'Pixelify Sans', sans-serif";
        subtitle.style.fontSize = "24px";
        subtitle.style.color = "#e8e8e8";
        subtitle.style.marginBottom = "60px";
        initialContainer.appendChild(subtitle);
        
        // Create Start Game button in the same style as Play Again
        const startButton = document.createElement("button");
        startButton.textContent = "Start Game";
        startButton.style.fontFamily = "'Pixelify Sans', sans-serif";
        startButton.style.fontSize = "24px";
        startButton.style.padding = "15px 30px";
        startButton.style.backgroundColor = "transparent";
        startButton.style.color = "white";
        startButton.style.border = "2px solid white";
        startButton.style.borderRadius = "0px";
        startButton.style.cursor = "pointer";
        startButton.style.marginTop = "40px";
        startButton.style.display = "block";
        startButton.style.margin = "40px auto 0";
        startButton.style.transition = "background-color 0.3s ease";
        
        // Hover effects
        startButton.addEventListener("mouseover", () => {
            startButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        });
        
        startButton.addEventListener("mouseout", () => {
            startButton.style.backgroundColor = "transparent";
        });
        
        initialContainer.appendChild(startButton);
        introOverlay.appendChild(initialContainer);
        
        // Story scenes
        const scenes = [
            {
                type: "voiceover",
                text: "Lisbon is facing a water crisis. Reservoirs are running dry, and urgent action is needed."
            },
            {
                type: "voiceover",
                text: "You, Benjamin, have been chosen to explore the city's water system and ensure its survival."
            },
            {
                type: "voiceover",
                text: "Your journey begins now. The future of Lisbon's water is in your hands."
            }
        ];
        
        let currentScene = 0;
        let isAnimating = false;
        
        // Function to show text in typing animation style like in the game
        // Based on Level1.typeText implementation
        function typeText(container, text, callback, soundType = "typing") {
            let sound;
            
            // Select appropriate sound based on the type of message
            if (soundType === "npcTalking") {
                sound = new Audio("sounds/npcTalking1.mp3");
            } else {
                // Default typing sound for voiceovers and notifications
                sound = new Audio("sounds/typing.mp3");
                sound.loop = true;
                sound.volume = 0.5;
            }
            
            let i = 0;
            container.textContent = "";
            isAnimating = true;
            
            // Start sound immediately
            sound.currentTime = 0;
            sound.play();
            
            const typing = setInterval(() => {
                if (i < text.length) {
                    container.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    
                    // Stop sound when typing is complete
                    sound.pause();
                    sound.currentTime = 0;
                    
                    isAnimating = false;
                    setTimeout(() => {
                        if (callback) callback();
                    }, 2000); // Wait 2 seconds after message is complete before advancing
                }
            }, 30);
        }
        
        // Function to show a scene
        function showScene(scene) {
            // If there's an existing message container, remove it
            const existingContainer = document.querySelector('.intro-message-container');
            if (existingContainer) {
                introOverlay.removeChild(existingContainer);
            }
            
            // Create new container
            let container;
            let soundType = "typing"; // Default sound
            
            if (scene.type === "dialog") {
                // Create styled message container for dialog
                container = document.createElement("div");
                container.className = "intro-message-container";
                container.style.backgroundColor = "white";
                container.style.border = "4px solid #3c3c54";
                container.style.borderRadius = "0px"; 
                container.style.padding = "30px";
                container.style.paddingTop = "40px";
                container.style.maxWidth = "700px";
                container.style.width = "80%";
                container.style.color = "#3c3c54";
                container.style.position = "relative";
                container.style.fontFamily = "'Pixelify Sans', sans-serif";
                container.style.fontSize = "20px";
                container.style.lineHeight = "1.5";
                
            
            // Use NPC talking sound for Benjamin's dialog
            soundType = "npcTalking";
        
                
            } else if (scene.type === "notification") {
                // Create styled container for notification
                container = document.createElement("div");
                container.className = "intro-message-container";
                container.style.padding = "30px";
                container.style.paddingTop = "40px";
                container.style.maxWidth = "700px";
                container.style.width = "80%";
                container.style.color = "#d9534f";
                container.style.fontFamily = "'Pixelify Sans', sans-serif";
                container.style.fontSize = "20px";
                container.style.position = "relative";
                container.style.textAlign = "center";
                
                
            } else if (scene.type === "voiceover") {
                // Create styled container for voiceover
                container = document.createElement("div");
                container.className = "intro-message-container";
                container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                container.style.padding = "30px";
                container.style.paddingTop = "40px";
                container.style.maxWidth = "700px";
                container.style.width = "80%";
                container.style.color = "#e8e8e8";
                container.style.textAlign = "center";
                container.style.fontFamily = "'Pixelify Sans', sans-serif";
                container.style.fontSize = "22px";
                container.style.position = "relative";
                
            }
            
            introOverlay.appendChild(container);
            
            // Type the text with animation using the appropriate sound
            // After typing is complete, automatically advance to the next scene
            typeText(container, scene.text, () => {
                advanceScene();
            }, soundType);
        }
        
        // Update the advanceScene function to include a fade out transition

        function advanceScene() {
            if (isAnimating) return;
            
            currentScene++;
            if (currentScene < scenes.length) {
                showScene(scenes[currentScene]);
            } else {
                // All scenes shown, add fade out effect before starting the game
                const fadeOutOverlay = document.createElement("div");
                fadeOutOverlay.style.position = "fixed";
                fadeOutOverlay.style.top = "0";
                fadeOutOverlay.style.left = "0";
                fadeOutOverlay.style.width = "100%";
                fadeOutOverlay.style.height = "100%";
                fadeOutOverlay.style.backgroundColor = "black";
                fadeOutOverlay.style.opacity = "0";
                fadeOutOverlay.style.zIndex = "1001";
                fadeOutOverlay.style.transition = "opacity 3s ease";
                document.body.appendChild(fadeOutOverlay);
                
                // Start fade out
                setTimeout(() => {
                    fadeOutOverlay.style.opacity = "1";
                    
                    // Wait for fade to complete, then start game
                    setTimeout(() => {
                        document.body.removeChild(introOverlay);
                        document.body.removeChild(fadeOutOverlay);
                        startGame();
                    }, 3000);
                }, 1000);
            }
        }
        
        // Add Start Game button click handler to begin the story
        startButton.addEventListener("click", () => {
            // Remove the initial title and button
            introOverlay.removeChild(initialContainer);
            
            // Start showing scenes
            showScene(scenes[0]);
        });
        
        // Add keyboard support to advance scenes once started
        document.addEventListener("keydown", function(e) {
            if ((e.key === "Enter" || e.key === " " || e.key === "Escape") && !isAnimating) {
                if (document.querySelector('.intro-message-container')) {
                    advanceScene();
                } else if (document.getElementById('initial-container')) {
                    startButton.click(); // Trigger the start button if on the initial screen
                }
            }
        });
        
        // Add to the document
        document.body.appendChild(introOverlay);
    }

    function startGame() {
        // Original game initialization code
        const overworld = new Overworld({
            element: document.querySelector(".game-container")
        });
        overworld.init();
    }

    // Show introduction before starting the game
    document.addEventListener("DOMContentLoaded", function() {
        // Check if we have the sound files, if not, create placeholders
        try {
            new Audio("sounds/npcTalking1.mp3");
            new Audio("sounds/typing.mp3");
        } catch (e) {
            console.warn("Sound files not found, adding empty sounds");
            const emptyAudio1 = document.createElement("audio");
            emptyAudio1.id = "npcTalkingSound";
            document.body.appendChild(emptyAudio1);
            
            const emptyAudio2 = document.createElement("audio");
            emptyAudio2.id = "typingSound";
            document.body.appendChild(emptyAudio2);
        }
        
        showIntroduction();
    });
})();