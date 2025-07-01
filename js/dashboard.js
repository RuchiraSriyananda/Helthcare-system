// Healthcare Management System - Dashboard JavaScript

// Dashboard data cache
let dashboardData = {
    stats: {},
    appointments: [],
    activities: [],
    lastUpdated: null
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
});

function initializeDashboard() {
    loadDashboardData();
    setupDashboardUpdates();
    initializeCharts();
    setupActivityFilters();
    
    // Refresh data every 5 minutes
    setInterval(refreshDashboardData, 5 * 60 * 1000);
}

// Load all dashboard data
function loadDashboardData() {
    showDashboardLoading(true);
    
    Promise.all([
        loadStatistics(),
        loadRecentAppointments(),
        loadActivityFeed(),
        loadQuickStats()
    ]).then(() => {
        showDashboardLoading(false);
        dashboardData.lastUpdated = new Date();
        updateLastRefreshTime();
    }).catch(error => {
        console.error('Error loading dashboard data:', error);
        showDashboardLoading(false);
        showError('Failed to load dashboard data');
    });
}

// Load statistics
function loadStatistics() {
    return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
            const stats = {
                totalPatients: 1234 + Math.floor(Math.random() * 50),
                todayAppointments: 28 + Math.floor(Math.random() * 10),
                activeDoctors: 15,
                monthlyRevenue: 45280 + Math.floor(Math.random() * 5000),
                weeklyGrowth: {
                    patients: 12,
                    revenue: 8,
                    appointments: 15
                }
            };
            
            dashboardData.stats = stats;
            updateStatisticsDisplay(stats);
            resolve(stats);
        }, 500);
    });
}

function updateStatisticsDisplay(stats) {
    // Update main stat cards
    updateElement('totalPatients', stats.totalPatients.toLocaleString());
    updateElement('todayAppointments', stats.todayAppointments);
    updateElement('activeDoctors', stats.activeDoctors);
    updateElement('monthlyRevenue', formatCurrency(stats.monthlyRevenue));
    
    // Update growth indicators
    updateGrowthIndicator('patients-growth', stats.weeklyGrowth.patients);
    updateGrowthIndicator('revenue-growth', stats.weeklyGrowth.revenue);
    updateGrowthIndicator('appointments-growth', stats.weeklyGrowth.appointments);
}

function updateGrowthIndicator(elementId, percentage) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `+${percentage}% this week`;
        element.className = percentage > 0 ? 'stat-change positive' : 'stat-change';
    }
}

// Load recent appointments
function loadRecentAppointments() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const appointments = generateSampleAppointments();
            dashboardData.appointments = appointments;
            displayRecentAppointments(appointments);
            resolve(appointments);
        }, 300);
    });
}

function generateSampleAppointments() {
    const samplePatients = [
        'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson',
        'Diana Davis', 'Edward Miller', 'Fiona Garcia', 'George Martinez', 'Helen Rodriguez'
    ];
    
    const sampleDoctors = [
        'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis',
        'Dr. Miller', 'Dr. Wilson', 'Dr. Moore', 'Dr. Taylor', 'Dr. Anderson'
    ];
    
    const statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
    const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
                  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];
    
    return Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        patient: samplePatients[Math.floor(Math.random() * samplePatients.length)],
        doctor: sampleDoctors[Math.floor(Math.random() * sampleDoctors.length)],
        time: times[Math.floor(Math.random() * times.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: new Date().toLocaleDateString()
    }));
}

function displayRecentAppointments(appointments) {
    const container = document.getElementById('recentAppointments');
    if (!container) return;
    
    if (appointments.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent appointments</p>';
        return;
    }
    
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item" onclick="viewAppointment(${apt.id})">
            <div class="appointment-info">
                <h4>${apt.patient}</h4>
                <p>with ${apt.doctor} at ${apt.time}</p>
                <span class="appointment-date">${apt.date}</span>
            </div>
            <span class="status status-${apt.status}">${capitalizeFirst(apt.status)}</span>
        </div>
    `).join('');
}

// Load activity feed
function loadActivityFeed() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const activities = generateSampleActivities();
            dashboardData.activities = activities;
            displayActivityFeed(activities);
            resolve(activities);
        }, 400);
    });
}

function generateSampleActivities() {
    const activityTypes = [
        { type: 'patient', messages: [
            'New patient {name} registered',
            'Patient {name} updated their profile',
            'Patient {name} uploaded medical documents'
        ]},
        { type: 'appointment', messages: [
            'Appointment scheduled for {name}',
            'Appointment confirmed for {name}',
            'Appointment rescheduled for {name}'
        ]},
        { type: 'billing', messages: [
            'Payment received from {name}',
            'Invoice sent to {name}',
            'Payment reminder sent to {name}'
        ]},
        { type: 'prescription', messages: [
            'Prescription issued for {name}',
            'Prescription refilled for {name}',
            'Prescription updated for {name}'
        ]}
    ];
    
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
    const timeFrames = ['2 minutes ago', '15 minutes ago', '1 hour ago', '2 hours ago', '4 hours ago'];
    
    return Array.from({ length: 10 }, (_, i) => {
        const typeData = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const message = typeData.messages[Math.floor(Math.random() * typeData.messages.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        
        return {
            id: i + 1,
            type: typeData.type,
            message: message.replace('{name}', name),
            time: timeFrames[Math.floor(Math.random() * timeFrames.length)],
            timestamp: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000)
        };
    });
}

function displayActivityFeed(activities, filterType = 'all') {
    const container = document.getElementById('activityFeed');
    if (!container) return;
    
    let filteredActivities = activities;
    if (filterType !== 'all') {
        filteredActivities = activities.filter(activity => activity.type === filterType);
    }
    
    if (filteredActivities.length === 0) {
        container.innerHTML = '<p class="text-muted">No activities found</p>';
        return;
    }
    
    container.innerHTML = filteredActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon activity-${activity.type}">
                ${getActivityIcon(activity.type)}
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        patient: '👤',
        appointment: '📅',
        billing: '💰',
        prescription: '💊'
    };
    return icons[type] || '📋';
}

// Load quick stats
function loadQuickStats() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const quickStats = {
                pendingPrescriptions: 12 + Math.floor(Math.random() * 10),
                lowStockItems: 5 + Math.floor(Math.random() * 5),
                outstandingPayments: 8450 + Math.floor(Math.random() * 2000),
                newPatientsWeek: 23 + Math.floor(Math.random() * 10)
            };
            
            displayQuickStats(quickStats);
            resolve(quickStats);
        }, 200);
    });
}

function displayQuickStats(stats) {
    const quickStatsContainer = document.querySelector('.quick-stats');
    if (!quickStatsContainer) return;
    
    quickStatsContainer.innerHTML = `
        <div class="quick-stat">
            <span class="label">Pending Prescriptions</span>
            <span class="value">${stats.pendingPrescriptions}</span>
        </div>
        <div class="quick-stat">
            <span class="label">Low Stock Items</span>
            <span class="value ${stats.lowStockItems > 5 ? 'warning' : ''}">${stats.lowStockItems}</span>
        </div>
        <div class="quick-stat">
            <span class="label">Outstanding Payments</span>
            <span class="value">${formatCurrency(stats.outstandingPayments)}</span>
        </div>
        <div class="quick-stat">
            <span class="label">New Patients (Week)</span>
            <span class="value">${stats.newPatientsWeek}</span>
        </div>
    `;
}

// Activity filters
function setupActivityFilters() {
    const filterButtons = document.querySelectorAll('.activity-filters .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter activities
            const filterType = this.textContent.toLowerCase();
            displayActivityFeed(dashboardData.activities, filterType);
        });
    });
}

// Dashboard updates
function setupDashboardUpdates() {
    // Add refresh button functionality
    const refreshButton = document.getElementById('refreshDashboard');
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshDashboardData);
    }
}

function refreshDashboardData() {
    showInfo('Refreshing dashboard data...');
    loadDashboardData();
}

function updateLastRefreshTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement && dashboardData.lastUpdated) {
        const timeString = dashboardData.lastUpdated.toLocaleTimeString();
        lastUpdateElement.textContent = `Last updated: ${timeString}`;
    }
}

// Charts initialization (placeholder for future chart implementation)
function initializeCharts() {
    // This would initialize any charts/graphs on the dashboard
    // For now, we'll just log that charts would be initialized
    console.log('Charts initialized (placeholder)');
}

// Dashboard loading state
function showDashboardLoading(show) {
    const loadingElements = document.querySelectorAll('.dashboard-loading');
    const contentElements = document.querySelectorAll('.dashboard-content');
    
    if (show) {
        loadingElements.forEach(el => el.style.display = 'block');
        contentElements.forEach(el => el.style.opacity = '0.5');
    } else {
        loadingElements.forEach(el => el.style.display = 'none');
        contentElements.forEach(el => el.style.opacity = '1');
    }
}

// Appointment actions
function viewAppointment(appointmentId) {
    // This would typically navigate to the appointment details page
    showInfo(`Viewing appointment #${appointmentId}`);
    // window.location.href = `appointments/view.html?id=${appointmentId}`;
}

function scheduleAppointment() {
    window.location.href = 'appointments/book.html';
}

// Export dashboard functions
window.Dashboard = {
    loadDashboardData,
    refreshDashboardData,
    viewAppointment,
    scheduleAppointment
};

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
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

// Activity filter function (global scope for onclick handlers)
window.filterActivity = function(type) {
    const buttons = document.querySelectorAll('.activity-filters .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayActivityFeed(dashboardData.activities, type);
};