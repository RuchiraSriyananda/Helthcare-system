<?php
// Database configuration (using JSON files for simplicity in WebContainer)
define('DATA_DIR', __DIR__ . '/../data/');

// OpenAI API Configuration
define('OPENAI_API_KEY', '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');
define('OPENAI_API_URL', 'https://api.openai.com/v1/chat/completions');

// Ensure data directory exists
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Initialize data files if they don't exist
$data_files = [
    'users.json' => [],
    'patients.json' => [],
    'doctors.json' => [],
    'departments.json' => [
        ['id' => 1, 'name' => 'Cardiology', 'location' => 'Building A, Floor 2'],
        ['id' => 2, 'name' => 'Neurology', 'location' => 'Building B, Floor 1'],
        ['id' => 3, 'name' => 'Orthopedics', 'location' => 'Building A, Floor 3'],
        ['id' => 4, 'name' => 'Pediatrics', 'location' => 'Building C, Floor 1'],
        ['id' => 5, 'name' => 'General Medicine', 'location' => 'Building A, Floor 1']
    ],
    'appointments.json' => [],
    'medical_records.json' => [],
    'prescriptions.json' => [],
    'medications.json' => [
        ['id' => 1, 'name' => 'Aspirin', 'description' => 'Pain reliever and anti-inflammatory', 'manufacturer' => 'Bayer'],
        ['id' => 2, 'name' => 'Amoxicillin', 'description' => 'Antibiotic', 'manufacturer' => 'GlaxoSmithKline'],
        ['id' => 3, 'name' => 'Lisinopril', 'description' => 'ACE inhibitor for blood pressure', 'manufacturer' => 'Merck'],
        ['id' => 4, 'name' => 'Metformin', 'description' => 'Diabetes medication', 'manufacturer' => 'Bristol-Myers Squibb'],
        ['id' => 5, 'name' => 'Ibuprofen', 'description' => 'NSAID pain reliever', 'manufacturer' => 'Advil']
    ],
    'billing.json' => [],
    'staff.json' => []
];

foreach ($data_files as $file => $default_data) {
    $file_path = DATA_DIR . $file;
    if (!file_exists($file_path)) {
        file_put_contents($file_path, json_encode($default_data, JSON_PRETTY_PRINT));
    }
}

// Helper functions for data operations
function readData($filename) {
    $file_path = DATA_DIR . $filename;
    if (file_exists($file_path)) {
        return json_decode(file_get_contents($file_path), true);
    }
    return [];
}

function writeData($filename, $data) {
    $file_path = DATA_DIR . $filename;
    return file_put_contents($file_path, json_encode($data, JSON_PRETTY_PRINT));
}

function getNextId($data) {
    if (empty($data)) return 1;
    return max(array_column($data, 'id')) + 1;
}
?>