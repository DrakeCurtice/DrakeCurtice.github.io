const target = document.getElementById('target');
        const info = document.getElementById('info');
        const startScreen = document.getElementById('startScreen');
        const endScreen = document.getElementById('endScreen');
        const successfulClicksSpan = document.getElementById('successfulClicks');
        const missCountSpan = document.getElementById('missCount');
        const misclicksSpan = document.getElementById('misclicks');
        const highScoreSpan = document.getElementById('highScore');
        const durationInput = document.getElementById('duration');
        const targetSizeInput = document.getElementById('targetSize');
        const targetTimeInput = document.getElementById('targetTime');
        const targetColorInput = document.getElementById('targetColor');
        let clicks = 0;
        let misses = 0;
        let totalClicks = 0;
        let highScore = 0;
        let gameTimer = null;
        let targetTimeout = null;
        let countdownInterval = null;
        let shouldStartGame = false;
    
        function moveTarget() {
    clearTimeout(targetTimeout);
    const margin = 50;
    const minX = 35 + margin;
    const maxX = window.innerWidth - target.offsetWidth - margin - 35;
    const minY = 65 + margin;
    const maxY = window.innerHeight - target.offsetHeight - margin - 35;
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    target.style.left = `${randomX}px`; // Turn random into string and make it into px
    target.style.top = `${randomY}px`;

    // Reset the target for animation by first hiding it
    target.style.opacity = 0;
    target.style.transform = 'scale(0.5)';
    target.style.display = 'block'; // Make sure the target is visible

    // Trigger the animation with a slight delay to ensure the browser applies the 'display: block' state
    setTimeout(() => {
        target.style.transition = 'opacity 0.3s, transform 0.3s';
        target.style.opacity = 1;
        target.style.transform = 'scale(1)';
    }, 10); // A short timeout to allow style reset

    targetTimeout = setTimeout(() => {
        // Animate the target disappearing
        target.style.opacity = 0;
        target.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            target.style.display = 'none'; // Hide after animation to prevent clicks
            document.getElementById('missSound').play();
            misses++;
            moveTarget();
        }, 200); // Match the transition duration, originally was 300
    }, parseFloat(targetTimeInput.value) * 1000);
}
    
        
function startGame(event) {
    event.stopPropagation();
    if (gameTimer) return;

    shouldStartGame = true; // Set the flag to true when the game is supposed to start
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('countdown').style.display = 'flex';

    let countdownValue = 3;
    document.getElementById('countdownNumber').textContent = countdownValue;

    countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue > 0) {
            document.getElementById('countdownNumber').textContent = countdownValue;
        } else {
            clearInterval(countdownInterval);
            document.getElementById('countdown').style.display = 'none';
            if (shouldStartGame) { // Check if the game should start
                beginGame();
            }
        }
    }, 600); //600 is the amount of MS. 1000 is 3 seconds in this case.
}


document.getElementById('info').style.display = 'none'; // Hide info initially
function beginGame() {
    // Initialize game settings and start spawning targets
    info.style.display = 'block';
    target.style.width = targetSizeInput.value + 'px';  // Update target size based on settings
    target.style.height = targetSizeInput.value + 'px';  // Ensure height is also updated
    endScreen.style.display = 'none';

    moveTarget();
    let startTime = Date.now();
    gameTimer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = parseFloat(durationInput.value) - elapsedTime;
        updateInfo(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            gameTimer = null;
            clearTimeout(targetTimeout);
            target.style.display = 'none';
            showEndScreen();
        }
    }, 1000);
}
    
        function incrementClicks(event) {
            event.stopPropagation(); // Prevent further propagation
            clicks++;
            totalClicks++;
            document.getElementById('hitSound').play(); // Play hit sound
            updateHighScore(); // Check and update high score
             // Reset target appearance before moving to ensure animation triggers
    target.style.opacity = 0;
    target.style.transform = 'scale(0.5)';
    target.style.transition = 'none'; // Remove transition to instantly hide
    setTimeout(() => {
        moveTarget(); // Immediately move the target to a new position
    }, 10); // Short delay to ensure the style reset applies correctly
}
    
        function updateHighScore() {
            if (clicks > highScore) {
                highScore = clicks;
                highScoreSpan.textContent = highScore;
            }
        }
    
        function updateInfo(timeLeft) {
            info.textContent = `Time: ${timeLeft}s | Clicks: ${clicks}`;
        }
    
        function showEndScreen() {
            endScreen.style.display = 'flex';
            successfulClicksSpan.textContent = clicks;
            missCountSpan.textContent = misses;
            misclicksSpan.textContent = totalClicks - clicks; // Update misclicks calculation
        }
    
        function resetGame() {
    if (targetTimeout) clearTimeout(targetTimeout);
    if (gameTimer) clearInterval(gameTimer);
    if (countdownInterval) clearInterval(countdownInterval);

    gameTimer = null;
    targetTimeout = null;
    countdownInterval = null;

    target.style.display = 'none'; // Ensure target is not visible
    target.style.opacity = 0; // Reset opacity
    target.style.transform = 'scale(0.5)'; // Reset scale

    info.style.display = 'none';
    document.getElementById('countdown').style.display = 'none';

    startScreen.style.display = 'flex';
    endScreen.style.display = 'none';
    document.getElementById('info').textContent = "Time: 0s | Clicks: 0";

    clicks = 0;
    misses = 0;
    totalClicks = 0;
}
        function recordClick() {
            if (!gameTimer) return; // Only count clicks when the game is active
            if (event.target.id !== 'target') {
        document.getElementById('misclickSound').play(); // Play misclick sound if the click is not on the target
        }
            totalClicks++;
        }
    
        function toggleNightMode() {
    const body = document.body;
    const isNightMode = body.classList.contains('body-light-mode');

    if (isNightMode) {
        // Currently light mode, switch to night mode
        body.style.backgroundColor = '#333';
        body.style.color = 'white';
        body.classList.remove('body-light-mode'); // Remove class for light mode
        document.getElementById('toggleMode').textContent = 'Light Mode'; // Set text to Light Mode because we are now in Night Mode
        document.getElementById('crosshair').classList.remove('light-mode');
    } else {
        // Currently night mode, switch to light mode
        body.style.backgroundColor = '#f0f0f0';
        body.style.color = 'black';
        body.classList.add('body-light-mode'); // Add class for light mode
        document.getElementById('toggleMode').textContent = 'Night Mode'; // Set text to Night Mode because we are now in Light Mode
        document.getElementById('crosshair').classList.add('light-mode');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    toggleNightMode(); // Ensure it runs once on load
});


function initializeNightMode() {
    // Check if the body has the light mode class already
    if (document.body.classList.contains('body-light-mode')) {
        toggleNightMode(); // This will switch it to night mode
    }
}

document.addEventListener('DOMContentLoaded', initializeNightMode); //calls night mode when the page loads

    
        document.addEventListener('keydown', function(event) {
            if (event.key === 'r' || event.key === 'R') {
                resetGame();
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
    const target = document.getElementById('target');
    const targetColorInput = document.getElementById('targetColor');

    targetColorInput.addEventListener('change', function() {
        target.style.backgroundColor = this.value;
    });
});

durationInput.addEventListener('input', resetHighScore);
    targetSizeInput.addEventListener('input', resetHighScore);
    targetTimeInput.addEventListener('input', resetHighScore);

    // Function to reset the high score
    function resetHighScore() {
        highScore = 0;
        highScoreSpan.textContent = highScore;
    }

    document.addEventListener('mousemove', function(e) {
        var crosshair = document.getElementById('crosshair');
        crosshair.style.left = e.clientX + 'px';
        crosshair.style.top = e.clientY + 'px';
        crosshair.style.display = 'block'; // Ensure the crosshair is visible when moving
    });
    
    function hideCrosshair() {
        document.getElementById('crosshair').style.display = 'none';
    }
    
    function showCrosshair() {
        document.getElementById('crosshair').style.display = 'block';
    }