// Route to the simulation
function startSimulation() {
    window.location.href = '/src/index.html'; // Adjust the path if necessary
}

// Chatbox functionality
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const userMessage = input.value;

    if (!userMessage.trim()) return; // Ignore empty messages

    // Display user's message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.textContent = `You: ${userMessage}`;
    userMessageDiv.style.color = '#00FF00';
    messages.appendChild(userMessageDiv);

    input.value = ''; // Clear the input field

    // Mock response from Claude AI (replace this with an actual API call if available)
    const responseMessageDiv = document.createElement('div');
    responseMessageDiv.textContent = `Claude AI: I'm here to help!`;
    responseMessageDiv.style.color = '#FFA500';
    messages.appendChild(responseMessageDiv);

    // Scroll to the latest message
    messages.scrollTop = messages.scrollHeight;
}
