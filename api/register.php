<?php
session_start();
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$first_name = $_POST['first_name'] ?? '';
$last_name = $_POST['last_name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$phone = $_POST['phone'] ?? '';
$role = $_POST['role'] ?? '';

// Validate required fields
if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($phone) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Check if email already exists
$users = readData('users.json');
foreach ($users as $user) {
    if ($user['email'] === $email) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }
}

// Create user record
$user_id = getNextId($users);
$new_user = [
    'id' => $user_id,
    'first_name' => $first_name,
    'last_name' => $last_name,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'phone' => $phone,
    'role' => $role,
    'created_at' => date('Y-m-d H:i:s')
];

$users[] = $new_user;
writeData('users.json', $users);

// Create role-specific records
if ($role === 'patient') {
    $patients = readData('patients.json');
    $patient_record = [
        'id' => getNextId($patients),
        'user_id' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'date_of_birth' => $_POST['date_of_birth'] ?? '',
        'gender' => $_POST['gender'] ?? '',
        'phone' => $phone,
        'email' => $email,
        'address' => $_POST['address'] ?? '',
        'created_at' => date('Y-m-d H:i:s')
    ];
    $patients[] = $patient_record;
    writeData('patients.json', $patients);
} elseif ($role === 'doctor') {
    $doctors = readData('doctors.json');
    $doctor_record = [
        'id' => getNextId($doctors),
        'user_id' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'specialty' => $_POST['specialty'] ?? '',
        'department_id' => intval($_POST['department_id'] ?? 1),
        'phone' => $phone,
        'email' => $email,
        'created_at' => date('Y-m-d H:i:s')
    ];
    $doctors[] = $doctor_record;
    writeData('doctors.json', $doctors);
} elseif ($role === 'staff') {
    $staff = readData('staff.json');
    $staff_record = [
        'id' => getNextId($staff),
        'user_id' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'role' => $_POST['staff_role'] ?? 'Staff Member',
        'department_id' => intval($_POST['staff_department_id'] ?? 1),
        'phone' => $phone,
        'created_at' => date('Y-m-d H:i:s')
    ];
    $staff[] = $staff_record;
    writeData('staff.json', $staff);
}

echo json_encode(['success' => true, 'message' => 'Registration successful! Please login.']);
?>