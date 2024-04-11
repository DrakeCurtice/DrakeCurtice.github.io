// Variables to track mouse movement and timing for both instantaneous and average calculations
let lastMoveTime = performance.now();
let moveCount = 0; // Total movements for average calculation
let instantMoveCount = 0; // Movements for instantaneous calculation

// Update the average rate every second and the instantaneous rate at the desired frequency
function updateRates() {
    const currentTime = performance.now();
    const timeSinceLastMove = currentTime - lastMoveTime;

    // Update average rate every second
    if (timeSinceLastMove >= 1000) {
        const avgRefreshRate = moveCount / (timeSinceLastMove / 1000); // Calculate average movements per second
        document.getElementById('avgRefreshRate').textContent = Math.round(avgRefreshRate);
        
        // Reset counters for the next average calculation
        lastMoveTime = currentTime;
        moveCount = 0;
    }

    // Instantaneous rate calculation and update handled separately
    displayInstantaneousRate();
}

// Calculate and display instantaneous rate based on recent activity
function displayInstantaneousRate() {
    const instantRateInterval = 125; // Interval in ms for updating the instantaneous rate (8 times per second)
    const now = performance.now();
    const elapsed = now - lastUpdateTime;

    if (elapsed >= instantRateInterval) {
        const instantRate = Math.round((instantMoveCount / elapsed) * 1000); // Calculate movements per second
        addRateEntry(instantRate);

        // Reset for next instant calculation
        instantMoveCount = 0;
        lastUpdateTime = now;
    }
}

// Function to insert rate entries into the DOM for instantaneous rates
function addRateEntry(rate) {
    const container = document.getElementById('instantRatesContainer');
    const entry = document.createElement('div');
    entry.textContent = `${rate} Hz`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;

    // Limit the number of entries to keep the page responsive
    while (container.children.length > 100) {
        container.removeChild(container.firstChild);
    }
}

// Variables for timing
let lastUpdateTime = performance.now();

// Event listener for mouse movement
document.addEventListener('mousemove', () => {
    moveCount++; // Count for average rate
    instantMoveCount++; // Count for instantaneous rate
    updateRates();
});