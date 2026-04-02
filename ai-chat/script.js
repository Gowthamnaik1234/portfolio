document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.querySelector('.send-btn');
  const chatFeed = document.getElementById('chat-feed');
  const promptPills = document.querySelectorAll('.prompt-pill');

  // Auto-resize textarea
  promptInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    if (this.value.trim() !== '') {
      sendBtn.removeAttribute('disabled');
    } else {
      sendBtn.setAttribute('disabled', 'true');
    }
  });

  // Handle enter key to submit (Shift+Enter for new line)
  promptInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (this.value.trim() !== '') {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Click on pill fills input
  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const text = pill.textContent.replace(/^(🎨|💻|✨)\s*/, '');
      promptInput.value = text;
      promptInput.dispatchEvent(new Event('input'));
    });
  });

  // Submit form
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = promptInput.value.trim();
    if (!message) return;

    // Reset input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    sendBtn.setAttribute('disabled', 'true');

    // Add User Message
    addUserMessage(message);

    // Simulate AI typing delay
    setTimeout(() => {
      generateAIResponse(message);
    }, 600);
  });

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `
      <div class="msg-avatar">GN</div>
      <div class="msg-content">
        <p>${text.replace(/\n/g, '<br>')}</p>
      </div>
    `;
    chatFeed.appendChild(msgDiv);
    scrollToBottom();
  }

  function generateAIResponse(userMessage) {
    const aiResponses = [
      "That's an interesting approach! Let's explore the visual layout and structure to make sure it aligns with your goals.",
      "I can certainly help with that. By utilizing a soft color palette and progressive disclosure, we can reduce cognitive load significantly.",
      "Based on modern UI/UX principles, I recommend switching to a clean, geometric sans-serif font like Inter or Outfit for maximum readability.",
      "Absolutely! Let's structure the wireframes first before moving to high-fidelity prototyping in Figma."
    ];
    
    // Pick a random response
    const rawText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message incoming ai-streaming';
    msgDiv.innerHTML = `
      <div class="msg-avatar">O</div>
      <div class="msg-content">
        <p class="streaming-text"></p>
      </div>
    `;
    chatFeed.appendChild(msgDiv);
    scrollToBottom();

    const textTarget = msgDiv.querySelector('.streaming-text');
    
    // Split text into characters for streaming effect
    const chars = rawText.split('');
    let currentIndex = 0;

    // Fast streaming interval
    const streamInterval = setInterval(() => {
      if (currentIndex < chars.length) {
        textTarget.innerHTML += chars[currentIndex];
        currentIndex++;
        scrollToBottom();
      } else {
        clearInterval(streamInterval);
        msgDiv.classList.remove('ai-streaming');
      }
    }, 15); // 15ms per character creates a fast typing effect
  }

  function scrollToBottom() {
    chatFeed.scrollTo({
      top: chatFeed.scrollHeight,
      behavior: 'smooth'
    });
  }
});
