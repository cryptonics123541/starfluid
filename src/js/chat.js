class ChatBot {
    constructor() {
        this.messages = [];
        this.messageContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    async sendMessage() {
        const userMessage = this.input.value.trim();
        if (!userMessage) return;

        this.addMessageToChat('user', userMessage);
        this.input.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response');
            }

            const data = await response.json();
            if (!data.content || !data.content[0] || !data.content[0].text) {
                throw new Error('Invalid response format');
            }
            
            const botResponse = data.content[0].text;
            this.addMessageToChat('bot', botResponse);
        } catch (error) {
            console.error('Error details:', error);
            this.addMessageToChat('bot', `Error: ${error.message}. Please try again.`);
        }
    }

    addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}-message`;
        messageDiv.textContent = content;
        this.messageContainer.appendChild(messageDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
}); 