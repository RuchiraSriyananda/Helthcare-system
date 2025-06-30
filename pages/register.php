<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-2xl w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
        <div class="text-center">
            <i class="fas fa-hospital text-6xl text-blue-600 mb-4"></i>
            <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
            <p class="mt-2 text-gray-600">Join our healthcare system</p>
        </div>
        
        <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div>
        <div id="success-message" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"></div>
        
        <form id="register-form" class="mt-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="first_name" name="first_name" required 
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                
                <div>
                    <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="last_name" name="last_name" required 
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="tel" id="phone" name="phone" required 
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Register As</label>
                <select id="role" name="role" required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                </select>
            </div>
            
            <!-- Additional fields for patients -->
            <div id="patient-fields" class="hidden space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" id="date_of_birth" name="date_of_birth" 
                               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                        <select id="gender" name="gender" 
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                    <textarea id="address" name="address" rows="3" 
                              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
            </div>
            
            <!-- Additional fields for doctors -->
            <div id="doctor-fields" class="hidden space-y-4">
                <div>
                    <label for="specialty" class="block text-sm font-medium text-gray-700">Specialty</label>
                    <input type="text" id="specialty" name="specialty" 
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                
                <div>
                    <label for="department_id" class="block text-sm font-medium text-gray-700">Department</label>
                    <select id="department_id" name="department_id" 
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Department</option>
                        <option value="1">Cardiology</option>
                        <option value="2">Neurology</option>
                        <option value="3">Orthopedics</option>
                        <option value="4">Pediatrics</option>
                        <option value="5">General Medicine</option>
                    </select>
                </div>
            </div>
            
            <!-- Additional fields for staff -->
            <div id="staff-fields" class="hidden space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="staff_role" class="block text-sm font-medium text-gray-700">Staff Role</label>
                        <input type="text" id="staff_role" name="staff_role" 
                               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               placeholder="e.g., Nurse, Receptionist, Technician">
                    </div>
                    
                    <div>
                        <label for="staff_department_id" class="block text-sm font-medium text-gray-700">Department</label>
                        <select id="staff_department_id" name="staff_department_id" 
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Department</option>
                            <option value="1">Cardiology</option>
                            <option value="2">Neurology</option>
                            <option value="3">Orthopedics</option>
                            <option value="4">Pediatrics</option>
                            <option value="5">General Medicine</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <button type="submit" 
                    class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                <i class="fas fa-user-plus mr-2"></i>
                Create Account
            </button>
        </form>
        
        <div class="text-center">
            <p class="text-sm text-gray-600">
                Already have an account?
                <a href="?page=login" class="font-medium text-blue-600 hover:text-blue-500">Sign in here</a>
            </p>
        </div>
    </div>
</div>

<script>
document.getElementById('role').addEventListener('change', function() {
    const role = this.value;
    const patientFields = document.getElementById('patient-fields');
    const doctorFields = document.getElementById('doctor-fields');
    const staffFields = document.getElementById('staff-fields');
    
    // Hide all role-specific fields
    patientFields.classList.add('hidden');
    doctorFields.classList.add('hidden');
    staffFields.classList.add('hidden');
    
    // Show relevant fields based on role
    if (role === 'patient') {
        patientFields.classList.remove('hidden');
    } else if (role === 'doctor') {
        doctorFields.classList.remove('hidden');
    } else if (role === 'staff') {
        staffFields.classList.remove('hidden');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            successDiv.textContent = result.message;
            successDiv.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            setTimeout(() => {
                window.location.href = '?page=login';
            }, 2000);
        } else {
            errorDiv.textContent = result.message;
            errorDiv.classList.remove('hidden');
            successDiv.classList.add('hidden');
        }
    } catch (error) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.remove('hidden');
        successDiv.classList.add('hidden');
    }
});
</script>