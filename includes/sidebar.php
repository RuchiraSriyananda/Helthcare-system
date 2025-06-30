<?php
$user_role = $_SESSION['role'] ?? 'patient';
?>
<nav class="bg-blue-800 text-white w-64 min-h-screen fixed left-0 top-0 z-50">
    <div class="p-6">
        <div class="flex items-center space-x-3 mb-8">
            <i class="fas fa-hospital text-3xl text-blue-300"></i>
            <div>
                <h2 class="text-xl font-bold">HealthCare</h2>
                <p class="text-blue-300 text-sm">Management System</p>
            </div>
        </div>
        
        <ul class="space-y-2">
            <li>
                <a href="?page=dashboard" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'dashboard' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            
            <?php if (in_array($user_role, ['admin', 'staff', 'doctor'])): ?>
            <li>
                <a href="?page=patients" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'patients' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-users"></i>
                    <span>Patients</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (in_array($user_role, ['admin', 'staff'])): ?>
            <li>
                <a href="?page=doctors" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'doctors' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-user-md"></i>
                    <span>Doctors</span>
                </a>
            </li>
            <?php endif; ?>
            
            <li>
                <a href="?page=appointments" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'appointments' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Appointments</span>
                </a>
            </li>
            
            <?php if (in_array($user_role, ['admin', 'doctor'])): ?>
            <li>
                <a href="?page=medical-records" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'medical-records' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-file-medical"></i>
                    <span>Medical Records</span>
                </a>
            </li>
            <li>
                <a href="?page=prescriptions" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'prescriptions' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-prescription"></i>
                    <span>Prescriptions</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if (in_array($user_role, ['admin', 'staff'])): ?>
            <li>
                <a href="?page=billing" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'billing' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-dollar-sign"></i>
                    <span>Billing</span>
                </a>
            </li>
            <li>
                <a href="?page=staff" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'staff' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-id-badge"></i>
                    <span>Staff</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if ($user_role === 'patient'): ?>
            <li>
                <a href="?page=chatbot" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'chatbot' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-robot"></i>
                    <span>AI Health Assistant</span>
                </a>
            </li>
            <?php endif; ?>
            
            <?php if ($user_role === 'admin'): ?>
            <li>
                <a href="?page=admin" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 <?php echo $page === 'admin' ? 'bg-blue-700' : ''; ?>">
                    <i class="fas fa-cog"></i>
                    <span>Administration</span>
                </a>
            </li>
            <?php endif; ?>
        </ul>
    </div>
</nav>