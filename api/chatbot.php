<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

try {
    // Validate request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new InvalidArgumentException('Invalid request method', 405);
    }

    // Authenticate user
    session_start();
    if (!isset($_SESSION['user_id'])) {
        throw new RuntimeException('Unauthorized access', 401);
    }

    // Validate input
    $message = trim($_POST['message'] ?? '');
    if (empty($message)) {
        throw new InvalidArgumentException('Message is required', 400);
    }

    // Get patient context
    $patient = $this->getPatientContext($_SESSION['user_id']);
    $medicalHistory = $this->getMedicalHistory($patient['id'] ?? 0);

    // Prepare AI prompt
    $prompt = new HealthcarePromptBuilder();
    $prompt->setPatientContext($patient)
           ->setMedicalHistory($medicalHistory)
           ->setDepartments(DataRepository::readData('departments.json'))
           ->setUserMessage($message);

    // Call AI service
    $aiService = new AIChatService(OPENAI_API_URL, OPENAI_API_KEY);
    $response = $aiService->getResponse($prompt->build());

    // Process response
    $result = [
        'success' => true,
        'response' => $response['content'],
        'departments' => $this->extractDepartments($response['content'])
    ];

    // Log interaction
    $this->logInteraction($_SESSION['user_id'], $message, $response['content']);

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
}

class HealthcarePromptBuilder {
    // ... prompt building implementation ...
}

class AIChatService {
    // ... AI service implementation ...
}
?>