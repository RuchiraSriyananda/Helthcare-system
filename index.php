<?php
session_start();

// Simple routing
$page = $_GET['page'] ?? 'login';
$allowed_pages = ['login', 'register', 'dashboard', 'patients', 'doctors', 'appointments', 'medical-records', 'prescriptions', 'billing', 'staff', 'admin', 'chatbot'];

if (!in_array($page, $allowed_pages)) {
    $page = 'login';
}

// Check authentication for protected pages
$protected_pages = ['dashboard', 'patients', 'doctors', 'appointments', 'medical-records', 'prescriptions', 'billing', 'staff', 'admin', 'chatbot'];
if (in_array($page, $protected_pages) && !isset($_SESSION['user_id'])) {
    $page = 'login';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HealthCare Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <?php
    if (isset($_SESSION['user_id']) && $page !== 'login' && $page !== 'register') {
        include 'includes/header.php';
        include 'includes/sidebar.php';
    }
    ?>
    
    <main class="<?php echo (isset($_SESSION['user_id']) && $page !== 'login' && $page !== 'register') ? 'ml-64 pt-16' : ''; ?>">
        <?php
        switch ($page) {
            case 'login':
                include 'pages/login.php';
                break;
            case 'register':
                include 'pages/register.php';
                break;
            case 'dashboard':
                include 'pages/dashboard.php';
                break;
            case 'patients':
                include 'pages/patients.php';
                break;
            case 'doctors':
                include 'pages/doctors.php';
                break;
            case 'appointments':
                include 'pages/appointments.php';
                break;
            case 'medical-records':
                include 'pages/medical-records.php';
                break;
            case 'prescriptions':
                include 'pages/prescriptions.php';
                break;
            case 'billing':
                include 'pages/billing.php';
                break;
            case 'staff':
                include 'pages/staff.php';
                break;
            case 'admin':
                include 'pages/admin.php';
                break;
            case 'chatbot':
                include 'pages/chatbot.php';
                break;
            default:
                include 'pages/login.php';
        }
        ?>
    </main>

    <script src="assets/js/app.js"></script>
    <?php if ($page === 'chatbot'): ?>
    <script src="assets/js/chatbot.js"></script>
    <?php endif; ?>
    <?php if ($page === 'dashboard'): ?>
    <script src="assets/js/dashboard.js"></script>
    <?php endif; ?>
</body>
</html>