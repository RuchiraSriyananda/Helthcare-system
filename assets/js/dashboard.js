// Dashboard functionality with Chart.js integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if elements exist
    initializeAppointmentChart();
    initializeDiagnosisChart();
    initializeRevenueChart();
    
    // Initialize dashboard animations
    animateDashboardStats();
    
    // Initialize real-time updates
    startRealTimeUpdates();
});

function initializeAppointmentChart() {
    const ctx = document.getElementById('appointmentChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Scheduled', 'Completed', 'Cancelled'],
            datasets: [{
                data: [12, 19, 3],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#EF4444'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

function initializeDiagnosisChart() {
    const ctx = document.getElementById('diagnosisChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hypertension', 'Diabetes', 'Common Cold', 'Anxiety', 'Back Pain'],
            datasets: [{
                label: 'Number of Cases',
                data: [8, 6, 12, 4, 7],
                backgroundColor: [
                    '#3B82F6',
                    '#8B5CF6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444'
                ],
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#F3F4F6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 100;
                    }
                    return delay;
                }
            }
        }
    });
}

function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#F3F4F6'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function animateDashboardStats() {
    // Animate counter numbers
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number appropriately
            if (counter.classList.contains('currency')) {
                counter.textContent = '$' + Math.floor(current).toLocaleString();
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
    
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 500);
    });
}

function startRealTimeUpdates() {
    // Simulate real-time updates for demo purposes
    setInterval(() => {
        updateNotifications();
        updateActivityFeed();
    }, 30000); // Update every 30 seconds
}

function updateNotifications() {
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        const currentCount = parseInt(notificationBadge.textContent) || 0;
        if (Math.random() > 0.7) { // 30% chance of new notification
            notificationBadge.textContent = currentCount + 1;
            showNotification('New appointment request received', 'info');
        }
    }
}

function updateActivityFeed() {
    const activityFeed = document.getElementById('activity-feed');
    if (!activityFeed) return;
    
    const activities = [
        'New patient registration completed',
        'Appointment scheduled for tomorrow',
        'Medical record updated',
        'Payment received for invoice #1234',
        'Prescription issued to patient'
    ];
    
    if (Math.random() > 0.8) { // 20% chance of new activity
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const activityDiv = document.createElement('div');
        activityDiv.className = 'p-3 border-l-4 border-blue-500 bg-blue-50 rounded slide-up';
        activityDiv.innerHTML = `
            <p class="text-sm text-gray-800">${activity}</p>
            <p class="text-xs text-gray-500">${new Date().toLocaleTimeString()}</p>
        `;
        
        activityFeed.insertBefore(activityDiv, activityFeed.firstChild);
        
        // Remove old activities (keep only 5)
        while (activityFeed.children.length > 5) {
            activityFeed.removeChild(activityFeed.lastChild);
        }
    }
}

// Quick action functions
function quickBookAppointment() {
    window.location.href = '?page=appointments&action=new';
}

function quickAddPatient() {
    window.location.href = '?page=patients&action=new';
}

function quickViewReports() {
    window.location.href = '?page=reports';
}

// Export dashboard data
function exportDashboardData() {
    const data = {
        timestamp: new Date().toISOString(),
        stats: {
            patients: document.querySelector('[data-stat="patients"]')?.textContent,
            appointments: document.querySelector('[data-stat="appointments"]')?.textContent,
            revenue: document.querySelector('[data-stat="revenue"]')?.textContent
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Dashboard data exported successfully', 'success');
}

// Refresh dashboard data
async function refreshDashboard() {
    showLoading('refresh-button');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update counters with new data
        animateDashboardStats();
        
        showNotification('Dashboard refreshed successfully', 'success');
    } catch (error) {
        showNotification('Failed to refresh dashboard', 'error');
    } finally {
        hideLoading('refresh-button', '<i class="fas fa-sync-alt mr-2"></i>Refresh');
    }
}

// Print dashboard
function printDashboard() {
    window.print();
}

// Toggle dashboard theme
function toggleDashboardTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('dashboard-theme', isDark ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});