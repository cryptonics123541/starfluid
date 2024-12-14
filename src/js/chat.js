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

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            const botResponse = data.content[0].text;
            this.addMessageToChat('bot', botResponse);
        } catch (error) {
            console.error('Error:', error);
            this.addMessageToChat('bot', 'Sorry, I encountered an error.');
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