<div class="chatbot-container">
  <div class="chatbot-header">
    <div class="header-content">
      <div class="ai-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div>
        <h2>AI Health Assistant</h2>
        <p>Describe your symptoms for medical guidance</p>
      </div>
    </div>
    <div class="header-actions">
      <button id="clear-chat" class="btn-secondary">
        <i class="fas fa-trash-alt"></i> Clear
      </button>
    </div>
  </div>

  <div class="chat-messages" id="chat-messages">
    <!-- Messages will be inserted here by JavaScript -->
  </div>

  <div class="chat-input-area">
    <div class="input-container">
      <textarea 
        id="message-input" 
        placeholder="Describe your symptoms here..." 
        rows="1"
        aria-label="Type your health concern"
      ></textarea>
      <button id="send-button" class="btn-primary">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    
    <div class="quick-symptoms">
      <p>Common symptoms:</p>
      <div class="symptom-tags">
        <button class="tag" data-symptom="Headache">Headache</button>
        <button class="tag" data-symptom="Fever">Fever</button>
        <button class="tag" data-symptom="Chest pain">Chest pain</button>
        <button class="tag" data-symptom="Stomach ache">Stomach ache</button>
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <p><i class="fas fa-info-circle"></i> This AI assistant provides general health information only. For medical emergencies, contact your healthcare provider immediately.</p>
  </div>
</div>

<script type="module">
  import HealthcareChatbot from '/assets/js/modules/HealthcareChatbot.js';
  
  document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new HealthcareChatbot({
      apiEndpoint: '/api/chatbot.php',
      container: '#chat-messages',
      input: '#message-input',
      sendButton: '#send-button',
      clearButton: '#clear-chat'
    });
    
    // Quick symptom buttons
    document.querySelectorAll('.tag').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('#message-input').value = button.dataset.symptom;
      });
    });
  });
</script>