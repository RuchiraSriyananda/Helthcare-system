<?php
session_start();
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'patient') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$message = $_POST['message'] ?? '';
if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Message is required']);
    exit;
}

// Get patient information for context
$patients = readData('patients.json');
$patient = null;
foreach ($patients as $p) {
    if ($p['user_id'] == $_SESSION['user_id']) {
        $patient = $p;
        break;
    }
}

// Get patient's medical history for context
$medical_records = readData('medical_records.json');
$patient_records = array_filter($medical_records, fn($r) => $r['patient_id'] == ($patient['id'] ?? 0));

$medical_history = '';
if (!empty($patient_records)) {
    $recent_records = array_slice($patient_records, -3); // Last 3 records
    foreach ($recent_records as $record) {
        $medical_history .= "Date: {$record['visit_date']}, Diagnosis: {$record['diagnosis']}, Treatment: {$record['treatment']}. ";
    }
}

// Get departments for recommendations
$departments = readData('departments.json');
$department_list = '';
foreach ($departments as $dept) {
    $department_list .= "{$dept['name']} (Location: {$dept['location']}), ";
}

// Prepare the prompt for OpenAI
$system_prompt = "You are a healthcare AI assistant. Your role is to:
1. Analyze symptoms described by patients
2. Provide general health information and guidance
3. Suggest appropriate medical departments for consultation
4. Recommend when to seek immediate medical attention
5. NEVER provide specific medical diagnoses or treatment recommendations
6. Always encourage consulting with healthcare professionals for serious concerns

Available departments: {$department_list}

Patient context:
- Name: {$patient['first_name']} {$patient['last_name']}
- Age: " . (isset($patient['date_of_birth']) ? date_diff(date_create($patient['date_of_birth']), date_create('today'))->y : 'Unknown') . "
- Gender: {$patient['gender']}
- Recent medical history: {$medical_history}

Respond in a caring, professional manner. Keep responses concise but informative.";

$user_message = "Patient symptoms/concern: {$message}";

// Make API call to OpenAI
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, OPENAI_API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . OPENAI_API_KEY
]);

$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => $system_prompt],
        ['role' => 'user', 'content' => $user_message]
    ],
    'max_tokens' => 300,
    'temperature' => 0.7
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $result = json_decode($response, true);
    if (isset($result['choices'][0]['message']['content'])) {
        $ai_response = $result['choices'][0]['message']['content'];
        
        // Extract department recommendations
        $recommended_departments = [];
        foreach ($departments as $dept) {
            if (stripos($ai_response, $dept['name']) !== false) {
                $recommended_departments[] = $dept;
            }
        }
        
        echo json_encode([
            'success' => true,
            'response' => $ai_response,
            'departments' => $recommended_departments
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid API response']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'AI service temporarily unavailable']);
}
?>