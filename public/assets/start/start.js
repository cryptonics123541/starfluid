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
    userMessageDiv.style.color = '#00FF00'; // Green for user's messages
    messages.appendChild(userMessageDiv);

    input.value = ''; // Clear the input field

    try {
        // Send message to the Vercel backend
        const response = await fetch('/api/claude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch AI response');
        }

        const data = await response.json();

        // Display Claude AI's response
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.textContent = `Claude AI: ${data.reply}`;
        aiMessageDiv.style.color = '#FFA500'; // Orange for AI's messages
        messages.appendChild(aiMessageDiv);
    } catch (error) {
        console.error('Error:', error);
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.textContent = 'Error: Unable to communicate with Claude AI.';
        errorMessageDiv.style.color = 'red';
        messages.appendChild(errorMessageDiv);
    }

    // Scroll to the latest message
    messages.scrollTop = messages.scrollHeight;
}
