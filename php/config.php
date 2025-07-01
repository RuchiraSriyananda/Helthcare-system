<?php
// Healthcare Management System - Database Configuration

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'healthcare_ms');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('APP_NAME', 'HealthCare Management System');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'development'); // development, production

// Security configuration
define('SECRET_KEY', 'your-secret-key-here-change-in-production');
define('SESSION_TIMEOUT', 3600); // 1 hour in seconds
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 900); // 15 minutes in seconds

// File upload configuration
define('UPLOAD_PATH', '../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB in bytes
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']);

// Pagination
define('RECORDS_PER_PAGE', 25);

// Date/Time configuration
date_default_timezone_set('America/New_York');

// Database connection class
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die(json_encode(['error' => 'Database connection failed']));
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Prevent cloning
    private function __clone() {}
    
    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

// Utility functions
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    // Remove all non-digit characters
    $phone = preg_replace('/\D/', '', $phone);
    // Check if it's 10 digits
    return strlen($phone) === 10;
}

function generateRandomString($length = 10) {
    return bin2hex(random_bytes($length / 2));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function logActivity($userId, $action, $details = '') {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        
        $stmt->execute([$userId, $action, $details, $ipAddress, $userAgent]);
    } catch (Exception $e) {
        error_log("Failed to log activity: " . $e->getMessage());
    }
}

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sendErrorResponse($message, $statusCode = 400) {
    sendJsonResponse(['error' => $message], $statusCode);
}

function sendSuccessResponse($data = [], $message = 'Success') {
    sendJsonResponse(['success' => true, 'message' => $message, 'data' => $data]);
}

// CORS headers for API requests
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit;
    }
}

// Session management
function startSecureSession() {
    // Configure session settings
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_secure', 0); // Set to 1 for HTTPS
    
    session_start();
    
    // Regenerate session ID periodically
    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();
    } elseif (time() - $_SESSION['created'] > 1800) { // 30 minutes
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
}

function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_role']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        sendErrorResponse('Authentication required', 401);
    }
}

function hasPermission($requiredRole) {
    if (!isLoggedIn()) {
        return false;
    }
    
    $userRole = $_SESSION['user_role'];
    $hierarchy = ['receptionist' => 1, 'nurse' => 2, 'doctor' => 3, 'admin' => 4];
    
    return isset($hierarchy[$userRole]) && 
           isset($hierarchy[$requiredRole]) && 
           $hierarchy[$userRole] >= $hierarchy[$requiredRole];
}

function requirePermission($requiredRole) {
    if (!hasPermission($requiredRole)) {
        sendErrorResponse('Insufficient permissions', 403);
    }
}

// Input validation functions
function validateRequired($value, $fieldName) {
    if (empty(trim($value))) {
        throw new InvalidArgumentException("$fieldName is required");
    }
    return trim($value);
}

function validateLength($value, $fieldName, $minLength = 1, $maxLength = 255) {
    $length = strlen($value);
    if ($length < $minLength || $length > $maxLength) {
        throw new InvalidArgumentException("$fieldName must be between $minLength and $maxLength characters");
    }
    return $value;
}

function validateDate($date, $fieldName) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    if (!$d || $d->format('Y-m-d') !== $date) {
        throw new InvalidArgumentException("$fieldName must be a valid date (YYYY-MM-DD)");
    }
    return $date;
}

function validateEnum($value, $fieldName, $allowedValues) {
    if (!in_array($value, $allowedValues)) {
        throw new InvalidArgumentException("$fieldName must be one of: " . implode(', ', $allowedValues));
    }
    return $value;
}

// Error handling
function handleException($e) {
    error_log($e->getMessage());
    
    if (APP_ENV === 'development') {
        sendErrorResponse($e->getMessage(), 500);
    } else {
        sendErrorResponse('An error occurred. Please try again later.', 500);
    }
}

// Set global exception handler
set_exception_handler('handleException');

// Initialize database tables if they don't exist
function initializeDatabase() {
    try {
        $db = Database::getInstance()->getConnection();
        
        // Check if tables exist
        $stmt = $db->query("SHOW TABLES LIKE 'users'");
        if ($stmt->rowCount() === 0) {
            // Tables don't exist, create them
            createDatabaseTables();
        }
    } catch (Exception $e) {
        error_log("Database initialization failed: " . $e->getMessage());
    }
}

function createDatabaseTables() {
    $db = Database::getInstance()->getConnection();
    
    // Read and execute SQL schema
    $sqlFile = '../database/schema.sql';
    if (file_exists($sqlFile)) {
        $sql = file_get_contents($sqlFile);
        $db->exec($sql);
    }
}

// Auto-initialize database on first load
if (APP_ENV === 'development') {
    initializeDatabase();
}
?>