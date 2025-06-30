<?php
require_once 'config/config.php';

$user_role = $_SESSION['role'] ?? 'patient';
$user_id = $_SESSION['user_id'];

// Get dashboard statistics based on user role
$stats = [];

if ($user_role === 'admin') {
    $patients = readData('patients.json');
    $doctors = readData('doctors.json');
    $appointments = readData('appointments.json');
    $billing = readData('billing.json');
    
    $stats = [
        'patients' => count($patients),
        'doctors' => count($doctors),
        'appointments' => count($appointments),
        'revenue' => array_sum(array_column($billing, 'total_amount'))
    ];
} elseif ($user_role === 'doctor') {
    $appointments = readData('appointments.json');
    $medical_records = readData('medical_records.json');
    
    $doctor_appointments = array_filter($appointments, fn($a) => $a['doctor_id'] == $user_id);
    $doctor_records = array_filter($medical_records, fn($r) => $r['doctor_id'] == $user_id);
    
    $stats = [
        'appointments' => count($doctor_appointments),
        'patients' => count(array_unique(array_column($doctor_records, 'patient_id'))),
        'records' => count($doctor_records)
    ];
} elseif ($user_role === 'patient') {
    $appointments = readData('appointments.json');
    $medical_records = readData('medical_records.json');
    $billing = readData('billing.json');
    
    $patient_appointments = array_filter($appointments, fn($a) => $a['patient_id'] == $user_id);
    $patient_records = array_filter($medical_records, fn($r) => $r['patient_id'] == $user_id);
    $patient_bills = array_filter($billing, fn($b) => $b['patient_id'] == $user_id);
    
    $stats = [
        'appointments' => count($patient_appointments),
        'records' => count($patient_records),
        'bills' => count($patient_bills),
        'pending_bills' => count(array_filter($patient_bills, fn($b) => $b['payment_status'] === 'Pending'))
    ];
}
?>

<div class="p-6 space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold">Welcome, <?php echo htmlspecialchars($_SESSION['first_name']); ?>!</h1>
                <p class="text-blue-100 mt-2">
                    <?php
                    $welcomeMessages = [
                        'admin' => 'Manage your healthcare system efficiently.',
                        'doctor' => 'Take care of your patients with our comprehensive tools.',
                        'staff' => 'Streamline operations and assist patients effectively.',
                        'patient' => 'Access your health information and stay connected with your care team.'
                    ];
                    echo $welcomeMessages[$user_role];
                    ?>
                </p>
            </div>
            <div class="text-6xl opacity-20">
                <i class="fas fa-<?php echo $user_role === 'patient' ? 'user' : ($user_role === 'doctor' ? 'user-md' : ($user_role === 'staff' ? 'id-badge' : 'crown')); ?>"></i>
            </div>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <?php if ($user_role === 'admin'): ?>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total Patients</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['patients']; ?></p>
                    </div>
                    <i class="fas fa-users text-blue-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total Doctors</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['doctors']; ?></p>
                    </div>
                    <i class="fas fa-user-md text-green-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total Appointments</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['appointments']; ?></p>
                    </div>
                    <i class="fas fa-calendar-alt text-yellow-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total Revenue</p>
                        <p class="text-3xl font-bold text-gray-800">$<?php echo number_format($stats['revenue'], 2); ?></p>
                    </div>
                    <i class="fas fa-dollar-sign text-purple-500 text-2xl"></i>
                </div>
            </div>
        <?php elseif ($user_role === 'doctor'): ?>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">My Appointments</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['appointments']; ?></p>
                    </div>
                    <i class="fas fa-calendar-alt text-blue-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">My Patients</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['patients']; ?></p>
                    </div>
                    <i class="fas fa-users text-green-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Medical Records</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['records']; ?></p>
                    </div>
                    <i class="fas fa-file-medical text-yellow-500 text-2xl"></i>
                </div>
            </div>
        <?php elseif ($user_role === 'patient'): ?>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">My Appointments</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['appointments']; ?></p>
                    </div>
                    <i class="fas fa-calendar-alt text-blue-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Medical Records</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['records']; ?></p>
                    </div>
                    <i class="fas fa-file-medical text-green-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total Bills</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['bills']; ?></p>
                    </div>
                    <i class="fas fa-file-invoice-dollar text-yellow-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Pending Bills</p>
                        <p class="text-3xl font-bold text-gray-800"><?php echo $stats['pending_bills']; ?></p>
                    </div>
                    <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <!-- Charts Section for Doctor -->
    <?php if ($user_role === 'doctor'): ?>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Appointment Status Distribution</h3>
            <canvas id="appointmentChart" width="400" height="200"></canvas>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Common Diagnoses</h3>
            <canvas id="diagnosisChart" width="400" height="200"></canvas>
        </div>
    </div>
    <?php endif; ?>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <?php if ($user_role === 'patient'): ?>
            <a href="?page=appointments" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 block">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-calendar-plus text-blue-500 text-2xl"></i>
                    <div>
                        <h3 class="font-semibold text-gray-800">Book Appointment</h3>
                        <p class="text-gray-600 text-sm">Schedule a new appointment</p>
                    </div>
                </div>
            </a>
            
            <a href="?page=chatbot" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 block">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-robot text-green-500 text-2xl"></i>
                    <div>
                        <h3 class="font-semibold text-gray-800">AI Health Assistant</h3>
                        <p class="text-gray-600 text-sm">Get symptom analysis</p>
                    </div>
                </div>
            </a>
            
            <a href="?page=billing" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 block">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-file-invoice-dollar text-yellow-500 text-2xl"></i>
                    <div>
                        <h3 class="font-semibold text-gray-800">View Bills</h3>
                        <p class="text-gray-600 text-sm">Check payment status</p>
                    </div>
                </div>
            </a>
        <?php elseif ($user_role === 'doctor'): ?>
            <a href="?page=appointments" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 block">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-calendar-alt text-blue-500 text-2xl"></i>
                    <div>
                        <h3 class="font-semibold text-gray-800">Manage Appointments</h3>
                        <p class="text-gray-600 text-sm">View and update appointments</p>
                    </div>
                </div>
            </a>
            
            <a href="?page=medical-records" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 block">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-file-medical text-green-500 text-2xl"></i>
                    <div>
                        <h3 class="font-semibold text-gray-800">Medical Records</h3>
                        <p class="text-gray-600 text-sm">Create and manage records</p>
                    </div>
                </div>
            </a>
            
            <a href="?page=prescriptions" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 block">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-prescription text-purple-500 text-2xl"></i>
                    <div>
                        <h3 class="font-semibold text-gray-800">Prescriptions</h3>
                        <p class="text-gray-600 text-sm">Manage prescriptions</p>
                    </div>
                </div>
            </a>
        <?php endif; ?>
    </div>
</div>