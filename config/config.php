<?php
// Environment Configuration
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database configuration
define('DATA_DIR', __DIR__ . '/../data/');
define('OPENAI_API_URL', 'https://api.openai.com/v1/chat/completions');
define('OPENAI_API_KEY', $_ENV['OPENAI_API_KEY']);

// Ensure data directory exists with proper permissions
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0750, true);
}

// Initialize data files with proper schema
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
        chmod($file_path, 0640);
    }
}

// Data Access Layer
class DataRepository {
    public static function readData(string $filename): array {
        $file_path = DATA_DIR . $filename;
        if (!file_exists($file_path)) {
            throw new RuntimeException("Data file not found: {$filename}");
        }
        return json_decode(file_get_contents($file_path), true) ?: [];
    }

    public static function writeData(string $filename, array $data): void {
        $file_path = DATA_DIR . $filename;
        if (file_put_contents($file_path, json_encode($data, JSON_PRETTY_PRINT)) === false) {
            throw new RuntimeException("Failed to write data to: {$filename}");
        }
    }

    public static function getNextId(array $data): int {
        return empty($data) ? 1 : (max(array_column($data, 'id')) + 1);
    }
}
?>