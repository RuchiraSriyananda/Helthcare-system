// AI Chatbot functionality for Healthcare Management System

class HealthcareChatbot {
    constructor() {
        this.chatContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('symptom-input');
        this.sendButton = document.getElementById('send-button');
        this.departmentSuggestions = document.getElementById('department-suggestions');
        this.doctorSuggestions = document.getElementById('doctor-suggestions');
        
        this.initializeEventListeners();
        this.loadChatHistory();
    }
    
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Quick symptom buttons
        document.querySelectorAll('.quick-symptom').forEach(button => {
            button.addEventListener('click', (e) => {
                this.inputField.value = e.target.textContent;
                this.sendMessage();
            });
        });
        
        // Auto-resize input
        this.inputField.addEventListener('input', () => {
            autoResize(this.inputField);
        });
    }
    
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.inputField.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Disable input while processing
        this.setInputState(false);
        
        try {
            const response = await this.callChatbotAPI(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            if (response.success) {
                // Add AI response
                this.addMessage(response.response, 'ai');
                
                // Show department suggestions if any
                if (response.departments && response.departments.length > 0) {
                    this.showDepartmentSuggestions(response.departments);
                }
                
                // Save to chat history
                this.saveChatHistory();
            } else {
                this.addMessage('I apologize, but I\'m having trouble processing your request right now. Please try again later or contact our staff directly.', 'ai');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('I\'m experiencing technical difficulties. Please try again or contact our medical staff for immediate assistance.', 'ai');
            console.error('Chatbot error:', error);
        }
        
        // Re-enable input
        this.setInputState(true);
    }
    
    async callChatbotAPI(message) {
        const formData = new FormData();
        formData.append('message', message);
        
        const response = await fetch('api/chatbot.php', {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
    }
    
    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-3 chat-message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex-1 text-right">
                    <div class="inline-block bg-blue-500 text-white rounded-lg p-3 max-w-lg chat-bubble user">
                        <p class="text-sm">${this.escapeHtml(message)}</p>
                        <p class="text-xs opacity-75 mt-1">${timestamp}</p>
                    </div>
                </div>
                <div class="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="flex-1">
                    <div class="bg-gray-100 rounded-lg p-3 max-w-lg chat-bubble ai">
                        <p class="text-sm text-gray-800">${this.formatAIResponse(message)}</p>
                        <p class="text-xs text-gray-500 mt-1">${timestamp}</p>
                    </div>
                </div>
            `;
        }
        
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start space-x-3';
        typingDiv.innerHTML = `
            <div class="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                <i class="fas fa-robot"></i>
            </div>
            <div class="bg-gray-100 rounded-lg p-3 max-w-lg">
                <div class="flex space-x-1">
                    <div class="typing-indicator"></div>
                    <div class="typing-indicator"></div>
                    <div class="typing-indicator"></div>
                </div>
            </div>
        `;
        
        this.chatContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    showDepartmentSuggestions(departments) {
        const departmentList = document.getElementById('department-list');
        departmentList.innerHTML = '';
        
        departments.forEach(dept => {
            const deptDiv = document.createElement('div');
            deptDiv.className = 'department-card bg-white p-3 rounded-lg border hover:border-blue-500 cursor-pointer transition-all duration-200';
            deptDiv.innerHTML = `
                <h4 class="font-semibold text-blue-800">${dept.name}</h4>
                <p class="text-sm text-gray-600">${dept.location}</p>
            `;
            
            deptDiv.addEventListener('click', () => {
                this.selectDepartment(dept);
            });
            
            departmentList.appendChild(deptDiv);
        });
        
        this.departmentSuggestions.classList.remove('hidden');
    }
    
    selectDepartment(department) {
        // Show available doctors for this department
        this.showDoctorSuggestions(department);
        
        // Add confirmation message
        this.addMessage(`Great! I recommend consulting with the ${department.name} department. Here are the available doctors:`, 'ai');
    }
    
    async showDoctorSuggestions(department) {
        try {
            // In a real implementation, you would fetch doctors from the API
            // For now, we'll show a placeholder message
            const doctorList = document.getElementById('doctor-list');
            doctorList.innerHTML = `
                <div class="bg-white p-4 rounded-lg border">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-user-md text-green-600 text-2xl"></i>
                        <div>
                            <h4 class="font-semibold">Dr. Smith</h4>
                            <p class="text-sm text-gray-600">${department.name} Specialist</p>
                            <p class="text-xs text-gray-500">Available: Mon-Fri 9:00 AM - 5:00 PM</p>
                        </div>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                            Book Appointment
                        </button>
                    </div>
                </div>
            `;
            
            this.doctorSuggestions.classList.remove('hidden');
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }
    
    formatAIResponse(response) {
        // Format the AI response with basic HTML
        return response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setInputState(enabled) {
        this.inputField.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.inputField.focus();
        }
    }
    
    scrollToBottom() {
        const container = document.getElementById('chat-container');
        container.scrollTop = container.scrollHeight;
    }
    
    saveChatHistory() {
        // Save chat history to localStorage for this session
        const messages = Array.from(this.chatContainer.children).map(msg => ({
            html: msg.innerHTML,
            timestamp: Date.now()
        }));
        
        localStorage.setItem('healthcare_chat_history', JSON.stringify(messages));
    }
    
    loadChatHistory() {
        // Load recent chat history from localStorage
        const history = localStorage.getItem('healthcare_chat_history');
        if (history) {
            try {
                const messages = JSON.parse(history);
                // Only load messages from the last hour
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                const recentMessages = messages.filter(msg => msg.timestamp > oneHourAgo);
                
                recentMessages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.innerHTML = msg.html;
                    this.chatContainer.appendChild(messageDiv);
                });
                
                if (recentMessages.length > 0) {
                    this.scrollToBottom();
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }
    
    clearChat() {
        this.chatContainer.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 max-w-lg">
                    <p class="text-gray-800">Hello! I'm your AI Health Assistant. I can help you understand your symptoms and suggest which medical department might be best for your concerns. Please describe your symptoms or health concerns.</p>
                    <p class="text-xs text-gray-500 mt-2">Note: I'm not a replacement for professional medical advice. Always consult with healthcare professionals for serious concerns.</p>
                </div>
            </div>
        `;
        
        // Hide suggestions
        this.departmentSuggestions.classList.add('hidden');
        this.doctorSuggestions.classList.add('hidden');
        
        // Clear localStorage
        localStorage.removeItem('healthcare_chat_history');
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('chat-messages')) {
        const chatbot = new HealthcareChatbot();
        
        // Add clear chat button functionality if it exists
        const clearButton = document.getElementById('clear-chat');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                chatbot.clearChat();
            });
        }
    }
});