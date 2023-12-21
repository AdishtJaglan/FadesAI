document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chatForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const userMessage = document.getElementById('userMessage').value;
  
      try {
        // Send user message to the chatbot API via a POST request
        const response = await fetch('/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userMessage })
        });
  
        if (response.ok) {
          const data = await response.json();
          displayChatbotResponse(data.response);
        } else {
          throw new Error('Chatbot request failed');
        }
      } catch (error) {
        console.error('Error sending message to chatbot:', error);
        displayChatbotResponse('Error communicating with the chatbot');
      }
    });
  
    function displayChatbotResponse(responseData) {
      const chatDisplay = document.getElementById('chatDisplay');
  
      if (isImageUrl(responseData)) {
        const imageElement = document.createElement('img');
        imageElement.src = responseData;
        imageElement.style.maxWidth = '100%';
        chatDisplay.appendChild(imageElement);
      } else {
        const chatMessage = document.createElement('p');
        chatMessage.textContent = `Chatbot: ${responseData}`;
        chatDisplay.appendChild(chatMessage);
      }
    }
  
    function isImageUrl(url) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    }
  });
  