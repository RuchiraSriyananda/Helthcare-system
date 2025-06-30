<?php
require_once 'config/config.php';
$user_role = $_SESSION['role'] ?? 'patient';

// Only patients can access the chatbot
if ($user_role !== 'patient') {
    header('Location: ?page=dashboard');
    exit;
}
?>

<div class="p-6">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
            <div class="flex items-center space-x-3">
                <i class="fas fa-robot text-3xl"></i>
                <div>
                    <h1 class="text-2xl font-bold">AI Health Assistant</h1>
                    <p class="text-blue-100">Describe your symptoms and get instant health insights</p>
                </div>
            </div>
        </div>
        
        <!-- Chat Container -->
        <div class="bg-white border-x border-gray-200 h-96 overflow-y-auto p-4" id="chat-container">
            <div class="space-y-4" id="chat-messages">
                <!-- Initial AI message -->
                <div class="flex items-start space-x-3">
                    <div class="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="bg-gray-100 rounded-lg p-3 max-w-lg">
                        <p class="text-gray-800">Hello! I'm your AI Health Assistant. I can help you understand your symptoms and suggest which medical department might be best for your concerns. Please describe your symptoms or health concerns.</p>
                        <p class="text-xs text-gray-500 mt-2">Note: I'm not a replacement for professional medical advice. Always consult with healthcare professionals for serious concerns.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Input Area -->
        <div class="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4">
            <div class="flex space-x-3">
                <input type="text" 
                       id="symptom-input" 
                       placeholder="Describe your symptoms here..." 
                       class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <button id="send-button" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200 flex items-center space-x-2">
                    <i class="fas fa-paper-plane"></i>
                    <span>Send</span>
                </button>
            </div>
            
            <!-- Quick Symptoms -->
            <div class="mt-3">
                <p class="text-sm text-gray-600 mb-2">Quick symptoms:</p>
                <div class="flex flex-wrap gap-2">
                    <button class="quick-symptom bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition duration-200">Headache</button>
                    <button class="quick-symptom bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition duration-200">Fever</button>
                    <button class="quick-symptom bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition duration-200">Chest pain</button>
                    <button class="quick-symptom bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition duration-200">Stomach ache</button>
                    <button class="quick-symptom bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition duration-200">Cough</button>
                    <button class="quick-symptom bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition duration-200">Back pain</button>
                </div>
            </div>
        </div>
        
        <!-- Suggested Departments -->
        <div id="department-suggestions" class="mt-6 hidden">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-800 mb-3">Suggested Departments</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="department-list">
                    <!-- Departments will be populated here -->
                </div>
            </div>
        </div>
        
        <!-- Available Doctors -->
        <div id="doctor-suggestions" class="mt-6 hidden">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-green-800 mb-3">Available Doctors</h3>
                <div class="space-y-3" id="doctor-list">
                    <!-- Doctors will be populated here -->
                </div>
            </div>
        </div>
    </div>
</div>

<style>
#chat-container {
    scroll-behavior: smooth;
}

.typing-indicator {
    display: inline-block;
    width: 4px;
    height: 4px;
    background-color: #3B82F6;
    border-radius: 50%;
    animation: typing 1.4s infinite both;
}

.typing-indicator:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.5;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}
</style>