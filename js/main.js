// Healthcare Management System - Main JavaScript

// Global variables
let currentUser = null;
let sidebarOpen = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // Initialize based on current page
    const pathname = window.location.pathname;
    
    if (pathname.includes('index.html') || pathname === '/') {
        initializeLogin();
    } else if (currentUser) {
        initializeDashboard();
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
    }
    
    // Initialize common components
    initializeModals();
    initializeMobileMenu();
    updateDateTime();
    
    // Update date/time every minute
    setInterval(updateDateTime, 60000);
}

// Authentication Functions
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate credentials
    if (validateLogin(credentials)) {
        // Simulate API call
        authenticateUser(credentials)
            .then(user => {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showSuccess('Login successful! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            })
            .catch(error => {
                showError('Invalid credentials. Please try again.');
            });
    }
}

function validateLogin(credentials) {
    let isValid = true;
    
    if (!credentials.username.trim()) {
        showFieldError('username', 'Username is required');
        isValid = false;
    }
    
    if (!credentials.password.trim()) {
        showFieldError('password', 'Password is required');
        isValid = false;
    }
    
    if (!credentials.role) {
        showFieldError('role', 'Please select a role');
        isValid = false;
    }
    
    return isValid;
}

function authenticateUser(credentials) {
    return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
            // Demo credentials - in real app, this would be an API call
            const demoUsers = {
                'admin': { password: 'admin123', role: 'admin', name: 'Dr. Admin' },
                'doctor': { password: 'doctor123', role: 'doctor', name: 'Dr. Smith' },
                'nurse': { password: 'nurse123', role: 'nurse', name: 'Nurse Johnson' },
                'receptionist': { password: 'reception123', role: 'receptionist', name: 'Jane Doe' }
            };
            
            const user = demoUsers[credentials.username];
            if (user && user.password === credentials.password && user.role === credentials.role) {
                resolve({
                    id: Math.random().toString(36).substr(2, 9),
                    username: credentials.username,
                    name: user.name,
                    role: user.role,
                    loginTime: new Date().toISOString()
                });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Dashboard Functions
function initializeDashboard() {
    updateUserInfo();
    loadDashboardData();
    initializeNavigation();
}

function updateUserInfo() {
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    
    if (userNameEl && currentUser) {
        userNameEl.textContent = currentUser.name;
    }
    
    if (userRoleEl && currentUser) {
        userRoleEl.textContent = capitalizeFirst(currentUser.role);
    }
}

function loadDashboardData() {
    // Load statistics
    loadStatistics();
    // Load recent appointments
    loadRecentAppointments();
    // Load activity feed
    loadActivityFeed();
}

function loadStatistics() {
    // Simulate loading dashboard statistics
    const stats = {
        totalPatients: 1234,
        todayAppointments: 28,
        activeDoctors: 15,
        monthlyRevenue: 45280
    };
    
    // Update DOM elements if they exist
    updateElement('totalPatients', stats.totalPatients.toLocaleString());
    updateElement('todayAppointments', stats.todayAppointments);
    updateElement('activeDoctors', stats.activeDoctors);
    updateElement('monthlyRevenue', `$${stats.monthlyRevenue.toLocaleString()}`);
}

function loadRecentAppointments() {
    const appointmentsContainer = document.getElementById('recentAppointments');
    if (!appointmentsContainer) return;
    
    // Sample appointment data
    const appointments = [
        { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '09:00 AM', status: 'confirmed' },
        { id: 2, patient: 'Jane Wilson', doctor: 'Dr. Johnson', time: '10:30 AM', status: 'pending' },
        { id: 3, patient: 'Bob Brown', doctor: 'Dr. Davis', time: '02:00 PM', status: 'confirmed' },
        { id: 4, patient: 'Alice Green', doctor: 'Dr. Wilson', time: '03:30 PM', status: 'completed' }
    ];
    
    appointmentsContainer.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-info">
                <h4>${apt.patient}</h4>
                <p>with ${apt.doctor} at ${apt.time}</p>
            </div>
            <span class="status status-${apt.status}">${capitalizeFirst(apt.status)}</span>
        </div>
    `).join('');
}

function loadActivityFeed() {
    const activityContainer = document.getElementById('activityFeed');
    if (!activityContainer) return;
    
    // Sample activity data
    const activities = [
        { type: 'patient', message: 'New patient John Doe registered', time: '5 minutes ago' },
        { type: 'appointment', message: 'Appointment scheduled for Jane Wilson', time: '15 minutes ago' },
        { type: 'billing', message: 'Payment received from Bob Brown', time: '1 hour ago' },
        { type: 'patient', message: 'Patient record updated for Alice Green', time: '2 hours ago' }
    ];
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon activity-${activity.type}"></div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Navigation Functions
function initializeNavigation() {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Functions
function initializeMobileMenu() {
    // Create mobile menu button if it doesn't exist
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        createMobileMenuButton();
    }
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
}

function createMobileMenuButton() {
    const button = document.createElement('button');
    button.className = 'mobile-menu-btn';
    button.innerHTML = '☰';
    button.onclick = toggleMobileMenu;
    document.body.appendChild(button);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = closeMobileMenu;
    document.body.appendChild(overlay);
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        sidebarOpen = !sidebarOpen;
    }
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        sidebarOpen = false;
    }
}

function handleWindowResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
        // Remove mobile elements if screen is large
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const overlay = document.querySelector('.sidebar-overlay');
        if (mobileBtn) mobileBtn.remove();
        if (overlay) overlay.remove();
    } else if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        createMobileMenuButton();
    }
}

// Modal Functions
function initializeModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Forgot Password Functions
function showForgotPassword() {
    showModal('forgotPasswordModal');
}

function closeForgotPassword() {
    closeModal('forgotPasswordModal');
}

// Quick Actions
function showQuickActions() {
    // This would typically show a dropdown or modal with quick actions
    const actions = [
        'Add New Patient',
        'Schedule Appointment',
        'Create Prescription',
        'Process Payment',
        'Update Inventory'
    ];
    
    // For demo, just show an alert
    const action = prompt('Quick Actions:\n' + actions.map((a, i) => `${i + 1}. ${a}`).join('\n') + '\n\nEnter number (1-5):');
    
    if (action >= 1 && action <= 5) {
        showInfo(`Selected: ${actions[action - 1]}`);
    }
}

// Utility Functions
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    updateElement('currentDate', dateStr);
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(el => el.classList.remove('error'));
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (field) field.classList.add('error');
    if (errorElement) errorElement.textContent = message;
}

// Notification Functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showWarning(message) {
    showNotification(message, 'warning');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease-out;
            }
            .notification-success { background-color: var(--success-color); }
            .notification-error { background-color: var(--danger-color); }
            .notification-warning { background-color: var(--warning-color); }
            .notification-info { background-color: var(--info-color); }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Activity Filter Function
function filterActivity(type) {
    // Update active button
    const buttons = document.querySelectorAll('.activity-filters .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter activities (this would typically filter real data)
    console.log(`Filtering activities by: ${type}`);
}

// Export functions for use in other scripts
window.HealthcareMS = {
    showModal,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    logout,
    filterActivity,
    showQuickActions
};