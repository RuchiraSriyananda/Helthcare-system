<?php
session_start();
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';

if (empty($email) || empty($password) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Check demo accounts first
$demo_accounts = [
    'admin@hospital.com' => ['password' => 'admin123', 'role' => 'admin', 'id' => 1, 'first_name' => 'Admin', 'last_name' => 'User'],
    'doctor@hospital.com' => ['password' => 'doctor123', 'role' => 'doctor', 'id' => 2, 'first_name' => 'Dr. John', 'last_name' => 'Smith'],
    'staff@hospital.com' => ['password' => 'staff123', 'role' => 'staff', 'id' => 3, 'first_name' => 'Staff', 'last_name' => 'Member'],
    'patient@hospital.com' => ['password' => 'patient123', 'role' => 'patient', 'id' => 4, 'first_name' => 'John', 'last_name' => 'Doe']
];

if (isset($demo_accounts[$email]) && $demo_accounts[$email]['password'] === $password && $demo_accounts[$email]['role'] === $role) {
    $user = $demo_accounts[$email];
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $email;
    $_SESSION['role'] = $user['role'];
    $_SESSION['first_name'] = $user['first_name'];
    $_SESSION['last_name'] = $user['last_name'];
    
    echo json_encode(['success' => true, 'message' => 'Login successful']);
    exit;
}

// Check registered users
$users = readData('users.json');

foreach ($users as $user) {
    if ($user['email'] === $email && password_verify($password, $user['password']) && $user['role'] === $role) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];
        
        echo json_encode(['success' => true, 'message' => 'Login successful']);
        exit;
    }
}

echo json_encode(['success' => false, 'message' => 'Invalid credentials or role mismatch']);
?>