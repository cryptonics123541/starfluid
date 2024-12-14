document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatOutput = document.getElementById('chat-output');
  
    if (chatForm && chatInput && chatOutput) {
      chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userMessage = chatInput.value.trim();
  
        if (!userMessage) {
          return;
        }
  
        chatOutput.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
        chatInput.value = '';
  
        try {
          const response = await fetch('/api/claude', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userMessage }),
          });
  
          if (!response.ok) {
            throw new Error('API request failed');
          }
  
          const data = await response.json();
          chatOutput.innerHTML += `<p><strong>Claude:</strong> ${data.completion}</p>`;
        } catch (error) {
          chatOutput.innerHTML += `<p><strong>Error:</strong> Unable to get a response.</p>`;
          console.error(error);
        }
      });
    }
  });
  