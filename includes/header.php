<header class="bg-white shadow-lg fixed top-0 left-64 right-0 z-40">
    <div class="px-6 py-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">
                    <?php
                    $titles = [
                        'dashboard' => 'Dashboard',
                        'patients' => 'Patients',
                        'doctors' => 'Doctors',
                        'appointments' => 'Appointments',
                        'medical-records' => 'Medical Records',
                        'prescriptions' => 'Prescriptions',
                        'billing' => 'Billing',
                        'staff' => 'Staff',
                        'admin' => 'Administration',
                        'chatbot' => 'AI Health Assistant'
                    ];
                    echo $titles[$page] ?? 'HealthCare System';
                    ?>
                </h1>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <button class="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <i class="fas fa-user-circle text-2xl"></i>
                        <span><?php echo htmlspecialchars($_SESSION['first_name'] ?? 'User'); ?></span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <a href="api/logout.php" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </a>
            </div>
        </div>
    </div>
</header>