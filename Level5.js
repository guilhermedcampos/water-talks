/**
 * Level5 module
 * Contains event handlers and logic specific to the advanced water treatment level
 * Implements a knowledge quiz about water treatment at the end of the journey
 */

window.Level5 = {
    /**
     * Quiz questions about water treatment process
     * Each question has a prompt and three possible answers with one correct answer
     */
    quizQuestions: [
        {
            question: "What is the approximate length of Lisbon's water distribution network?",
            options: [
                "About 475 kilometers",
                "About 1,449 kilometers",
                "About 2,567 kilometers"
            ],
            correctAnswer: 1, // Index of correct answer (0-based)
            explanation: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines, connecting 13 reservoirs and managed by 11 pumping stations."
        },
        {
            question: "What was the first step in the water treatment process you observed?",
            options: [
                "Adding chemicals to the water",
                "Filtering through sand",
                "Removing large debris and screening"
                
            ],
            correctAnswer: 2,
            explanation: "The first step in water treatment is physical screening to remove large debris and objects from the water."
        },
        {
            question: "What chemicals are typically added to help particles clump together?",
            options: [
                "Chlorine and fluoride",
                "Coagulants like aluminum sulfate",
                "Sodium and calcium"
            ],
            correctAnswer: 1,
            explanation: "Coagulants like aluminum sulfate are added to help small particles clump together into larger flocs that can be more easily removed."
        },
        {
            question: "How many supply branches efficiently deliver water throughout Lisbon?",
            options: [
                "Around 45,000 supply branches",
                "Around 104,285 supply branches",
                "Around 200,000 supply branches"
            ],
            correctAnswer: 1,
            explanation: "Lisbon's water system includes around 104,285 supply branches that efficiently deliver water throughout the city."
        },
        {
            question: "What happens after water is treated at the treatment plant?",
            options: [
                "It flows directly to homes",
                "It is stored in underground tanks",
                "It is distributed through a network of pipes with continuous monitoring"
            ],
            correctAnswer: 2,
            explanation: "After treatment, water requires continuous monitoring and maintenance to prevent leaks and ensure optimal pressure throughout the distribution system."
        },
        {
            question: "What is the second phase of water treatment?",
            options: [
                "Sedimentation",
                "Filtration",
                "Disinfection"
            ],
            correctAnswer: 0,
            explanation: "The second phase of water treatment is sedimentation, where flocs settle at the bottom of the tank."
        },
        {
            question: "What happens during the sedimentation process in water treatment?",
            options: [
                "Particles are filtered through layers of sand and gravel",
                "Water is disinfected with chlorine or ozone",
                "Heavier particles settle at the bottom of the tank, forming sludge"
            ],
            correctAnswer: 2,
            explanation: "During sedimentation, heavier particles settle at the bottom of the tank, forming sludge, while clearer water rises to the top for further treatment."
        },
        {
            question: "What is the primary purpose of the filtration process in water treatment?",
            options: [
                "To chemically neutralize dissolved contaminants",
                "To trap and remove fine particles and some microorganisms left after sedimentation",
                "To ensure the water has an optimal mineral balance for consumption"
            ],
            correctAnswer: 1,
            explanation: "The filtration process traps and removes fine particles and some microorganisms that may have escaped sedimentation, ensuring cleaner water."
        },
        {
            question: "What is the purpose of using UV light in water disinfection?",
            options: [
                "To damage the DNA of pathogens, preventing them from multiplying",
                "To remove large debris from the water",
                "To add minerals to the water for better taste"
            ],
            correctAnswer: 0, 
            explanation: "UV light damages the DNA of pathogens, such as bacteria and viruses, preventing them from multiplying and ensuring the water is safe to drink."
        },
        {
            question: "What is the role of activated carbon in water filtration?",
            options: [
                "It removes large debris from the water",
                "It chemically attracts and binds contaminants to its surface",
                "It adds minerals to the water for better taste"
            ],
            correctAnswer: 1, 
            explanation: "Activated carbon works through adsorption, chemically attracting and binding contaminants like chlorine and organic compounds to its surface, ensuring cleaner water."
        }
    ],
    
    /**
     * Quiz state management
     * Tracks current question, score, and quiz completion
     */
    quizState: {
        currentQuestion: 0,
        score: 0,
        inProgress: false,
        completed: false
    },
    
    /**
     * Starts the water knowledge quiz
     * @param {OverworldMap} map - Current map instance
     */
    startQuiz: function(map) {
        this.quizState.currentQuestion = 0;
        this.quizState.score = 0;
        this.quizState.inProgress = true;
        this.quizState.completed = false;
        
        // Update objective
        if (map && map.updateObjective) {
            map.updateObjective("Complete the water knowledge quiz.");
        }
        
        // Show first question
        this.showQuestion(map);
    },
    
    /**
     * Displays the current question with answer options
     * @param {OverworldMap} map - Current map instance
     */
    showQuestion: function(map) {
        // Get current question data
        const questionData = this.quizQuestions[this.quizState.currentQuestion];
        if (!questionData) return;
        
        // Remove any existing quiz UI
        this.removeQuizUI();
        
        // Create quiz container
        const quizContainer = document.createElement("div");
        quizContainer.id = "quiz-container";
        quizContainer.style.position = "absolute";
        quizContainer.style.top = "50%";
        quizContainer.style.left = "50%";
        quizContainer.style.transform = "translate(-50%, -50%)";
        quizContainer.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        quizContainer.style.border = "4px solid #3c3c54";
        quizContainer.style.borderRadius = "0px";
        quizContainer.style.padding = "20px";
        quizContainer.style.minWidth = "500px";
        quizContainer.style.maxWidth = "600px";
        quizContainer.style.zIndex = "1000";
        quizContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        
        // Add question counter
        const counter = document.createElement("div");
        counter.textContent = `Question ${this.quizState.currentQuestion + 1} of ${this.quizQuestions.length}`;
        counter.style.fontFamily = "'Pixelify Sans', sans-serif";
        counter.style.fontSize = "16px";
        counter.style.color = "#666";
        counter.style.marginBottom = "10px";
        quizContainer.appendChild(counter);
        
        // Add question text
        const questionElement = document.createElement("div");
        questionElement.textContent = questionData.question;
        questionElement.style.fontFamily = "'Pixelify Sans', sans-serif";
        questionElement.style.fontSize = "24px";
        questionElement.style.color = "#3c3c54";
        questionElement.style.marginBottom = "20px";
        questionElement.style.fontWeight = "bold";
        quizContainer.appendChild(questionElement);
        
        // Create options container
        const optionsContainer = document.createElement("div");
        optionsContainer.style.display = "flex";
        optionsContainer.style.flexDirection = "column";
        optionsContainer.style.gap = "10px";
        
        // Add answer options
        questionData.options.forEach((option, index) => {
            const optionButton = document.createElement("button");
            optionButton.textContent = option;
            optionButton.style.fontFamily = "'Pixelify Sans', sans-serif";
            optionButton.style.fontSize = "18px";
            optionButton.style.padding = "12px 20px";
            optionButton.style.backgroundColor = "white";
            optionButton.style.color = "#3c3c54";
            optionButton.style.border = "3px solid #3c3c54";
            optionButton.style.borderRadius = "0px";
            optionButton.style.cursor = "pointer";
            optionButton.style.textAlign = "left";
            optionButton.style.transition = "all 0.2s ease";
            
            // Add hover effect
            optionButton.addEventListener("mouseover", () => {
                optionButton.style.backgroundColor = "#3c3c54";
                optionButton.style.color = "white";
            });
            
            optionButton.addEventListener("mouseout", () => {
                optionButton.style.backgroundColor = "white";
                optionButton.style.color = "#3c3c54";
            });
            
            // Add click handler
            optionButton.addEventListener("click", () => {
                this.handleAnswer(map, index);
            });
            
            optionsContainer.appendChild(optionButton);
        });
        
        quizContainer.appendChild(optionsContainer);
        document.body.appendChild(quizContainer);
    },
    
    /**
     * Handles player's answer selection
     * @param {OverworldMap} map - Current map instance
     * @param {number} selectedIndex - Index of selected answer
     */
    handleAnswer: function(map, selectedIndex) {
        const questionData = this.quizQuestions[this.quizState.currentQuestion];
        const correct = selectedIndex === questionData.correctAnswer;
        
        // Remove quiz UI
        this.removeQuizUI();
        
        // Create feedback container
        const feedbackContainer = document.createElement("div");
        feedbackContainer.id = "feedback-container";
        feedbackContainer.style.position = "absolute";
        feedbackContainer.style.top = "50%";
        feedbackContainer.style.left = "50%";
        feedbackContainer.style.transform = "translate(-50%, -50%)";
        feedbackContainer.style.backgroundColor = correct ? "rgba(220, 255, 220, 0.95)" : "rgba(255, 220, 220, 0.95)";
        feedbackContainer.style.border = `4px solid ${correct ? "#2a5d2a" : "#5d2a2a"}`;
        feedbackContainer.style.borderRadius = "0px";
        feedbackContainer.style.padding = "20px";
        feedbackContainer.style.minWidth = "500px";
        feedbackContainer.style.maxWidth = "600px";
        feedbackContainer.style.zIndex = "1000";
        
        // Result text
        const resultText = document.createElement("div");
        resultText.textContent = correct ? "Correct!" : "Incorrect";
        resultText.style.fontFamily = "'Pixelify Sans', sans-serif";
        resultText.style.fontSize = "28px";
        resultText.style.fontWeight = "bold";
        resultText.style.color = correct ? "#2a5d2a" : "#5d2a2a";
        resultText.style.marginBottom = "15px";
        feedbackContainer.appendChild(resultText);
        
        // Explanation
        const explanation = document.createElement("div");
        explanation.textContent = questionData.explanation;
        explanation.style.fontFamily = "'Pixelify Sans', sans-serif";
        explanation.style.fontSize = "18px";
        explanation.style.marginBottom = "20px";
        feedbackContainer.appendChild(explanation);
        
        // Continue button
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.style.fontFamily = "'Pixelify Sans', sans-serif";
        continueButton.style.fontSize = "18px";
        continueButton.style.padding = "12px 24px";
        continueButton.style.backgroundColor = "#3c3c54";
        continueButton.style.color = "white";
        continueButton.style.border = "none";
        continueButton.style.borderRadius = "0px";
        continueButton.style.cursor = "pointer";
        continueButton.style.marginTop = "10px";
        
        continueButton.addEventListener("click", () => {
            // Update score if correct
            if (correct) {
                this.quizState.score++;
            }
            
            // Remove feedback UI
            if (feedbackContainer.parentNode) {
                document.body.removeChild(feedbackContainer);
            }
            
            // Move to next question or end quiz
            this.quizState.currentQuestion++;
            if (this.quizState.currentQuestion < this.quizQuestions.length) {
                this.showQuestion(map);
            } else {
                this.endQuiz(map);
            }
        });
        
        feedbackContainer.appendChild(continueButton);
        document.body.appendChild(feedbackContainer);
    },
    
    /**
     * Ends the quiz and displays final score
     * @param {OverworldMap} map - Current map instance
     */
    endQuiz: function(map) {
        this.quizState.inProgress = false;
        this.quizState.completed = true;
        
        // Create results container
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "results-container";
        resultsContainer.style.position = "absolute";
        resultsContainer.style.top = "50%";
        resultsContainer.style.left = "50%";
        resultsContainer.style.transform = "translate(-50%, -50%)";
        resultsContainer.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        resultsContainer.style.border = "4px solid #3c3c54";
        resultsContainer.style.borderRadius = "0px";
        resultsContainer.style.padding = "30px";
        resultsContainer.style.minWidth = "500px";
        resultsContainer.style.maxWidth = "600px";
        resultsContainer.style.zIndex = "1000";
        resultsContainer.style.textAlign = "center";
        
        // Title
        const title = document.createElement("div");
        title.textContent = "Quiz Complete!";
        title.style.fontFamily = "'Pixelify Sans', sans-serif";
        title.style.fontSize = "32px";
        title.style.fontWeight = "bold";
        title.style.color = "#3c3c54";
        title.style.marginBottom = "20px";
        resultsContainer.appendChild(title);
        
        // Score
        const scoreText = document.createElement("div");
        const percentage = Math.round((this.quizState.score / this.quizQuestions.length) * 100);
        scoreText.textContent = `You scored ${this.quizState.score} out of ${this.quizQuestions.length} (${percentage}%)`;
        scoreText.style.fontFamily = "'Pixelify Sans', sans-serif";
        scoreText.style.fontSize = "24px";
        scoreText.style.marginBottom = "30px";
        resultsContainer.appendChild(scoreText);
        
        // Feedback based on score
        const feedback = document.createElement("div");
        if (percentage >= 80) {
            feedback.textContent = "Excellent! You've gained a deep understanding of water treatment processes!";
        } else if (percentage >= 60) {
            feedback.textContent = "Good job! You've learned a lot about water treatment, but there's still more to discover.";
        } else {
            feedback.textContent = "You've made a good start in learning about water treatment. Consider revisiting some areas to deepen your understanding.";
        }
        feedback.style.fontFamily = "'Pixelify Sans', sans-serif";
        feedback.style.fontSize = "18px";
        feedback.style.marginBottom = "30px";
        feedback.style.lineHeight = "1.4";
        resultsContainer.appendChild(feedback);
        
        // Finish button
        const finishButton = document.createElement("button");
        finishButton.textContent = "Finish Journey";
        finishButton.style.fontFamily = "'Pixelify Sans', sans-serif";
        finishButton.style.fontSize = "20px";
        finishButton.style.padding = "15px 30px";
        finishButton.style.backgroundColor = "#3c3c54";
        finishButton.style.color = "white";
        finishButton.style.border = "none";
        finishButton.style.borderRadius = "0px";
        finishButton.style.cursor = "pointer";
        
        finishButton.addEventListener("click", () => {
            if (resultsContainer.parentNode) {
                document.body.removeChild(resultsContainer);
            }
            
            // Update objective
            if (map && map.updateObjective) {
                map.updateObjective("Journey complete!");
            }
            
            // Start the final cutscene and speeches - using the text from OverworldMap.js
            map.startCutscene([
                { 
                    type: "textMessage",
                    text: "Wow, what an amazing journey we've been on! We've learned so much about water treatment in Lisbon." 
                },
                { 
                    type: "textMessage",
                    text: "Thank you for joining me on this adventure. Until next time, stay curious and keep exploring!" 
                },
                { 
                    type: "custom", 
                    action: (map) => {
                        // Show the end screen with static text
                        this.showEndScreen(map);
                    }
                }
            ]);
        });
        
        resultsContainer.appendChild(finishButton);
        document.body.appendChild(resultsContainer);
    },
    
    /**
     * Shows "The End" screen with final messages
     * Uses the same static text display approach as Level1.showFlushMessages
     * @param {OverworldMap} map - Current map instance
     */
    showEndScreen: function(map) {
        map.isCutscenePlaying = true;
        
        // End screen messages
        const messages = [
            "The End.",
            "Thank you for learning about Lisbon's water treatment journey.",
            "Remember, every drop counts...",
            "Water is our most precious resource."
        ];
        
        // Remove any existing overlay
        const oldOverlay = document.getElementById("end-fade-overlay");
        if (oldOverlay) {
            document.body.removeChild(oldOverlay);
        }
        
        // Create fade overlay element
        const fadeOverlay = document.createElement("div");
        fadeOverlay.id = "end-fade-overlay";
        fadeOverlay.style.position = "fixed";
        fadeOverlay.style.top = "0";
        fadeOverlay.style.left = "0";
        fadeOverlay.style.width = "100%";
        fadeOverlay.style.height = "100%";
        fadeOverlay.style.backgroundColor = "black";
        fadeOverlay.style.opacity = "0";
        fadeOverlay.style.transition = "opacity 1.5s ease";
        fadeOverlay.style.zIndex = "2000";
        document.body.appendChild(fadeOverlay);
        
        // Create the typing sound element
        const typingSound = new Audio("sounds/typing.mp3");
        typingSound.loop = true;
        typingSound.volume = 0.5;
        
        // Trigger fade in
        setTimeout(() => {
            fadeOverlay.style.opacity = "1";
            
            // After fade is complete, show text messages
            setTimeout(() => {
                // Create text container element
                const textContainer = document.createElement("div");
                textContainer.style.position = "fixed";
                textContainer.style.top = "50%";
                textContainer.style.left = "50%";
                textContainer.style.transform = "translate(-50%, -50%)";
                textContainer.style.width = "80%";
                textContainer.style.maxWidth = "800px";
                textContainer.style.color = "white";
                textContainer.style.fontFamily = "'Pixelify Sans', sans-serif";
                textContainer.style.fontSize = "48px"; // Larger font for "The End"
                textContainer.style.lineHeight = "1.6";
                textContainer.style.textAlign = "center";
                textContainer.style.zIndex = "2001";
                document.body.appendChild(textContainer);
                
                const typingSpeed = 70; // Slightly slower for dramatic effect
                
                // Recursive function to display messages in sequence
                const showMessages = (index) => {
                    if (index < messages.length) {
                        // Make first message ("The End") larger
                        textContainer.style.fontSize = "24px";
                        textContainer.style.fontWeight = "normal";
                        
                        this.typeText(messages[index], textContainer, typingSound, typingSpeed, () => {
                            showMessages(index + 1);
                        });
                    } else {
                        // All messages are shown – add Play Again button
                        typingSound.pause();
                        typingSound.currentTime = 0;
                        
                        setTimeout(() => {
                            const playAgainButton = document.createElement("button");
                            playAgainButton.textContent = "Play Again";
                            playAgainButton.style.fontFamily = "'Pixelify Sans', sans-serif";
                            playAgainButton.style.fontSize = "24px";
                            playAgainButton.style.padding = "15px 30px";
                            playAgainButton.style.backgroundColor = "transparent";
                            playAgainButton.style.color = "white";
                            playAgainButton.style.border = "2px solid white";
                            playAgainButton.style.borderRadius = "0px";
                            playAgainButton.style.cursor = "pointer";
                            playAgainButton.style.marginTop = "40px";
                            playAgainButton.style.display = "block";
                            playAgainButton.style.margin = "40px auto 0";
                            playAgainButton.style.transition = "background-color 0.3s ease";
                            
                            // Hover effects
                            playAgainButton.addEventListener("mouseover", () => {
                                playAgainButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                            });
                            
                            playAgainButton.addEventListener("mouseout", () => {
                                playAgainButton.style.backgroundColor = "transparent";
                            });
                            
                            // Reset the game when clicked
                            playAgainButton.addEventListener("click", () => {
                                window.location.reload();
                            });
                            
                            textContainer.appendChild(playAgainButton);
                        }, 2000);
                    }
                };
                
                // Start showing messages
                showMessages(0);
                
            }, 1500); // Wait 1.5 seconds for fade in to complete
        }, 50); // Initial slight delay
    },
    
    /**
     * Types out a message character by character
     * Same implementation as in Level1.typeText
     * @param {string} message - The message to type
     * @param {HTMLElement} textContainer - The container element
     * @param {HTMLAudioElement} typingSound - Typing sound effect
     * @param {number} typingSpeed - Speed of typing
     * @param {Function} callback - Function to call after typing completes
     */
    typeText: function(message, textContainer, typingSound, typingSpeed, callback) {
        textContainer.innerHTML = "";
        let i = 0;
        // Start the typing sound immediately
        typingSound.currentTime = 0;
        typingSound.play();
        
        const typing = setInterval(() => {
            if (i < message.length) {
                textContainer.innerHTML += message.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                // Stop typing sound when done
                typingSound.pause();
                typingSound.currentTime = 0;
                setTimeout(() => {
                    callback();
                }, 2000); // Wait 2 seconds after message is complete
            }
        }, typingSpeed);
    },
    
    /**
     * Removes quiz UI elements from the DOM
     */
    removeQuizUI: function() {
        // Remove question container if exists
        const quizContainer = document.getElementById("quiz-container");
        if (quizContainer && quizContainer.parentNode) {
            document.body.removeChild(quizContainer);
        }
        
        // Remove feedback container if exists
        const feedbackContainer = document.getElementById("feedback-container");
        if (feedbackContainer && feedbackContainer.parentNode) {
            document.body.removeChild(feedbackContainer);
        }
        
        // Remove results container if exists
        const resultsContainer = document.getElementById("results-container");
        if (resultsContainer && resultsContainer.parentNode) {
            document.body.removeChild(resultsContainer);
        }
    }
};

// Events

const startQuizEvent = {
    text: "Talk",
    action: "startCutscene",
    events: [   
        {
        type: "custom",
        action: (map) => {
            delete map.buttonSpaces[utils.asGridCoords(30.5, 20)];
            delete map.buttonSpaces[utils.asGridCoords(31.5, 21)];
            delete map.buttonSpaces[utils.asGridCoords(32.5, 20)];
            delete map.buttonSpaces[utils.asGridCoords(31.5, 19)];
        }

        },
                { type: "textMessage", text: "Welcome to the lifeblood of our community. From the bustling streets of Lisbon to serene farms like this,", faceHero: "operator" },
                { type: "textMessage", text: "our mission is to deliver clean, safe water to every home, field, and creature." },
                { type: "textMessage", text: "Lisbon's water distribution network spans approximately 1,449 kilometers of pipelines," },
                { type: "textMessage", text: "connecting 13 reservoirs and managed by 11 pumping stations." },
                { type: "textMessage", text: "This extensive system ensures that around 104,285 supply branches efficiently deliver water throughout the city." },
                { type: "textMessage", text: "Our journey doesn't end at purification." },
                { type: "textMessage", text: "Continuous monitoring and maintenance prevent leaks and ensure optimal pressure," },
                { type: "textMessage", text: "By understanding and supporting this system, you help Lisbon thrive." },
                { type: "textMessage", text: "Now, let's see if you've learned anything from this journey. Are you ready for a quick test?" },
        { 
            type: "custom", 
            action: (map) => {
                // Set flag that player has talked to operator
                map.talkedToOperator = true;
                
                // Start the quiz after clicking the Talk button
                Level5.startQuiz(map);
                
                // Update objective once conversation is complete
                if (map && map.updateObjective) {
                    map.updateObjective("Complete the water knowledge quiz.");
                }
            }
        }
    ]
}