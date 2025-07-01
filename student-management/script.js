/**
 * Student Grade Management System
 * A comprehensive program demonstrating core programming concepts
 * 
 * Features:
 * - Variable declarations and data types
 * - Control structures (if/else, loops)
 * - Functions with parameters and return values
 * - Error handling and input validation
 * - Arrays and objects manipulation
 * - Local storage for data persistence
 */

// ============================================================================
// GLOBAL VARIABLES AND DATA STRUCTURES
// ============================================================================

/**
 * Main data structure to store all students
 * Demonstrates: Array data type, object storage
 */
let studentsDatabase = [];

/**
 * Configuration constants
 * Demonstrates: Constant variables, different data types
 */
const GRADE_SCALE = {
    EXCELLENT: 90,
    GOOD: 80,
    AVERAGE: 70,
    POOR: 0
};

const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];

/**
 * System statistics tracking
 * Demonstrates: Object data type, numeric variables
 */
let systemStats = {
    totalStudents: 0,
    totalGradesEntered: 0,
    lastUpdated: null
};

// ============================================================================
// CORE STUDENT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Student class constructor
 * Demonstrates: Object-oriented concepts, parameter validation
 * 
 * @param {string} name - Student's full name
 * @param {string} id - Unique student identifier
 * @param {string} subject - Academic subject
 * @param {Array<number>} grades - Array of numerical grades
 */
function Student(name, id, subject, grades) {
    // Input validation with error handling
    if (!name || typeof name !== 'string') {
        throw new Error('Student name must be a valid string');
    }
    
    if (!id || typeof id !== 'string') {
        throw new Error('Student ID must be a valid string');
    }
    
    if (!SUBJECTS.includes(subject)) {
        throw new Error(`Subject must be one of: ${SUBJECTS.join(', ')}`);
    }
    
    if (!Array.isArray(grades) || grades.length === 0) {
        throw new Error('Grades must be a non-empty array');
    }
    
    // Validate each grade is a number between 0-100
    for (let i = 0; i < grades.length; i++) {
        const grade = grades[i];
        if (typeof grade !== 'number' || grade < 0 || grade > 100) {
            throw new Error(`Grade ${grade} at position ${i} must be a number between 0-100`);
        }
    }
    
    // Object properties
    this.name = name.trim();
    this.id = id.trim().toUpperCase();
    this.subject = subject;
    this.grades = [...grades]; // Create a copy of the array
    this.dateAdded = new Date();
    
    // Calculate derived properties
    this.average = calculateAverage(this.grades);
    this.letterGrade = getLetterGrade(this.average);
    this.gradeCategory = getGradeCategory(this.average);
}

/**
 * Calculate the average of an array of numbers
 * Demonstrates: Array processing, mathematical operations, loops
 * 
 * @param {Array<number>} grades - Array of numerical grades
 * @returns {number} - Average grade rounded to 2 decimal places
 */
function calculateAverage(grades) {
    // Input validation
    if (!Array.isArray(grades) || grades.length === 0) {
        throw new Error('Cannot calculate average of empty or invalid grades array');
    }
    
    let sum = 0;
    
    // For loop demonstration
    for (let i = 0; i < grades.length; i++) {
        if (typeof grades[i] !== 'number') {
            throw new Error(`Invalid grade at position ${i}: ${grades[i]}`);
        }
        sum += grades[i];
    }
    
    const average = sum / grades.length;
    return Math.round(average * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert numerical grade to letter grade
 * Demonstrates: Conditional statements (if/else), return values
 * 
 * @param {number} average - Numerical average grade
 * @returns {string} - Letter grade (A, B, C, D, F)
 */
function getLetterGrade(average) {
    // Input validation
    if (typeof average !== 'number' || average < 0 || average > 100) {
        throw new Error('Average must be a number between 0 and 100');
    }
    
    // Conditional logic demonstration
    if (average >= 90) {
        return 'A';
    } else if (average >= 80) {
        return 'B';
    } else if (average >= 70) {
        return 'C';
    } else if (average >= 60) {
        return 'D';
    } else {
        return 'F';
    }
}

/**
 * Categorize grade performance
 * Demonstrates: Switch statement, string operations
 * 
 * @param {number} average - Numerical average grade
 * @returns {string} - Performance category
 */
function getGradeCategory(average) {
    // Input validation
    if (typeof average !== 'number') {
        throw new Error('Average must be a number');
    }
    
    // Switch statement demonstration
    const letterGrade = getLetterGrade(average);
    
    switch (letterGrade) {
        case 'A':
            return 'Excellent';
        case 'B':
            return 'Good';
        case 'C':
            return 'Average';
        case 'D':
            return 'Below Average';
        case 'F':
            return 'Poor';
        default:
            return 'Unknown';
    }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Add a new student to the database
 * Demonstrates: Array manipulation, error handling, data validation
 * 
 * @param {string} name - Student name
 * @param {string} id - Student ID
 * @param {string} subject - Subject name
 * @param {Array<number>} grades - Array of grades
 * @returns {boolean} - Success status
 */
function addStudent(name, id, subject, grades) {
    try {
        // Check for duplicate student ID
        const existingStudent = findStudentById(id);
        if (existingStudent) {
            throw new Error(`Student with ID ${id} already exists`);
        }
        
        // Create new student object
        const newStudent = new Student(name, id, subject, grades);
        
        // Add to database
        studentsDatabase.push(newStudent);
        
        // Update system statistics
        systemStats.totalStudents++;
        systemStats.totalGradesEntered += grades.length;
        systemStats.lastUpdated = new Date();
        
        // Save to local storage
        saveToLocalStorage();
        
        displayMessage(`Student ${name} added successfully!`, 'success');
        return true;
        
    } catch (error) {
        displayMessage(`Error adding student: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Find student by ID
 * Demonstrates: Array searching, conditional logic
 * 
 * @param {string} id - Student ID to search for
 * @returns {Object|null} - Student object or null if not found
 */
function findStudentById(id) {
    // Input validation
    if (!id || typeof id !== 'string') {
        return null;
    }
    
    const searchId = id.trim().toUpperCase();
    
    // Linear search through array
    for (let i = 0; i < studentsDatabase.length; i++) {
        if (studentsDatabase[i].id === searchId) {
            return studentsDatabase[i];
        }
    }
    
    return null;
}

/**
 * Search students by name or ID
 * Demonstrates: String operations, array filtering, loops
 * 
 * @param {string} searchTerm - Term to search for
 * @returns {Array} - Array of matching students
 */
function searchStudents(searchTerm) {
    // Input validation
    if (!searchTerm || typeof searchTerm !== 'string') {
        return [];
    }
    
    const term = searchTerm.toLowerCase().trim();
    const results = [];
    
    // Search through all students
    for (let i = 0; i < studentsDatabase.length; i++) {
        const student = studentsDatabase[i];
        const nameMatch = student.name.toLowerCase().includes(term);
        const idMatch = student.id.toLowerCase().includes(term);
        
        if (nameMatch || idMatch) {
            results.push(student);
        }
    }
    
    return results;
}

/**
 * Filter students by subject
 * Demonstrates: Array filtering, conditional logic
 * 
 * @param {string} subject - Subject to filter by
 * @returns {Array} - Filtered array of students
 */
function filterStudentsBySubject(subject) {
    if (!subject) {
        return studentsDatabase;
    }
    
    const filtered = [];
    
    // While loop demonstration
    let i = 0;
    while (i < studentsDatabase.length) {
        if (studentsDatabase[i].subject === subject) {
            filtered.push(studentsDatabase[i]);
        }
        i++;
    }
    
    return filtered;
}

// ============================================================================
// STATISTICAL ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive class statistics
 * Demonstrates: Mathematical operations, object manipulation, loops
 * 
 * @returns {Object} - Statistics object
 */
function calculateClassStatistics() {
    // Handle empty database
    if (studentsDatabase.length === 0) {
        displayMessage('No students in database to analyze', 'error');
        return null;
    }
    
    let totalGrades = 0;
    let gradeCount = 0;
    let highestAverage = 0;
    let lowestAverage = 100;
    let subjectCounts = {};
    let gradeCategoryCounts = {
        'Excellent': 0,
        'Good': 0,
        'Average': 0,
        'Below Average': 0,
        'Poor': 0
    };
    
    // Process each student
    for (let i = 0; i < studentsDatabase.length; i++) {
        const student = studentsDatabase[i];
        
        // Accumulate grade totals
        totalGrades += student.average;
        gradeCount++;
        
        // Track highest and lowest averages
        if (student.average > highestAverage) {
            highestAverage = student.average;
        }
        
        if (student.average < lowestAverage) {
            lowestAverage = student.average;
        }
        
        // Count subjects
        if (subjectCounts[student.subject]) {
            subjectCounts[student.subject]++;
        } else {
            subjectCounts[student.subject] = 1;
        }
        
        // Count grade categories
        gradeCategoryCounts[student.gradeCategory]++;
    }
    
    // Calculate final statistics
    const statistics = {
        totalStudents: studentsDatabase.length,
        classAverage: Math.round((totalGrades / gradeCount) * 100) / 100,
        highestAverage: highestAverage,
        lowestAverage: lowestAverage,
        subjectDistribution: subjectCounts,
        gradeDistribution: gradeCategoryCounts,
        generatedAt: new Date()
    };
    
    displayStatistics(statistics);
    return statistics;
}

/**
 * Find the top performing student
 * Demonstrates: Array processing, comparison operations
 * 
 * @returns {Object|null} - Top performing student or null
 */
function findTopPerformer() {
    if (studentsDatabase.length === 0) {
        displayMessage('No students in database', 'error');
        return null;
    }
    
    let topStudent = studentsDatabase[0];
    
    // Find student with highest average
    for (let i = 1; i < studentsDatabase.length; i++) {
        if (studentsDatabase[i].average > topStudent.average) {
            topStudent = studentsDatabase[i];
        }
    }
    
    displayTopPerformer(topStudent);
    return topStudent;
}

// ============================================================================
// USER INTERFACE FUNCTIONS
// ============================================================================

/**
 * Handle form submission for adding new student
 * Demonstrates: DOM manipulation, event handling, input validation
 */
function handleFormSubmission() {
    const form = document.getElementById('studentForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        try {
            // Get form values
            const name = document.getElementById('studentName').value;
            const id = document.getElementById('studentId').value;
            const subject = document.getElementById('subject').value;
            const gradesInput = document.getElementById('grades').value;
            
            // Parse and validate grades
            const grades = parseGrades(gradesInput);
            
            // Add student to database
            const success = addStudent(name, id, subject, grades);
            
            if (success) {
                // Clear form on success
                form.reset();
            }
            
        } catch (error) {
            displayMessage(`Form submission error: ${error.message}`, 'error');
        }
    });
}

/**
 * Parse comma-separated grades string into number array
 * Demonstrates: String manipulation, array processing, error handling
 * 
 * @param {string} gradesString - Comma-separated grades
 * @returns {Array<number>} - Array of numerical grades
 */
function parseGrades(gradesString) {
    if (!gradesString || typeof gradesString !== 'string') {
        throw new Error('Grades input is required');
    }
    
    // Split by comma and process each grade
    const gradeStrings = gradesString.split(',');
    const grades = [];
    
    for (let i = 0; i < gradeStrings.length; i++) {
        const gradeStr = gradeStrings[i].trim();
        
        // Convert to number
        const grade = parseFloat(gradeStr);
        
        // Validate grade
        if (isNaN(grade)) {
            throw new Error(`"${gradeStr}" is not a valid number`);
        }
        
        if (grade < 0 || grade > 100) {
            throw new Error(`Grade ${grade} must be between 0 and 100`);
        }
        
        grades.push(grade);
    }
    
    if (grades.length === 0) {
        throw new Error('At least one grade is required');
    }
    
    return grades;
}

/**
 * Display all students in the output area
 * Demonstrates: DOM manipulation, HTML generation, loops
 */
function displayAllStudents() {
    const output = document.getElementById('output');
    
    if (studentsDatabase.length === 0) {
        output.innerHTML = '<p class="placeholder">No students in database</p>';
        return;
    }
    
    let html = '<h3>All Students</h3>';
    
    // Generate HTML for each student
    for (let i = 0; i < studentsDatabase.length; i++) {
        const student = studentsDatabase[i];
        html += generateStudentCard(student);
    }
    
    output.innerHTML = html;
}

/**
 * Generate HTML card for a student
 * Demonstrates: String concatenation, conditional formatting
 * 
 * @param {Object} student - Student object
 * @returns {string} - HTML string
 */
function generateStudentCard(student) {
    const gradeClass = getGradeClass(student.average);
    const gradesDisplay = student.grades.join(', ');
    
    return `
        <div class="student-card">
            <div class="student-header">
                <span class="student-name">${student.name}</span>
                <span class="student-id">${student.id}</span>
            </div>
            <div class="student-details">
                <div class="detail-item">
                    <div class="detail-label">Subject</div>
                    <div class="detail-value">${student.subject}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Grades</div>
                    <div class="detail-value">${gradesDisplay}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Average</div>
                    <div class="detail-value ${gradeClass}">${student.average}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Letter Grade</div>
                    <div class="detail-value ${gradeClass}">${student.letterGrade}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Category</div>
                    <div class="detail-value">${student.gradeCategory}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get CSS class based on grade performance
 * Demonstrates: Conditional logic, string operations
 * 
 * @param {number} average - Grade average
 * @returns {string} - CSS class name
 */
function getGradeClass(average) {
    if (average >= GRADE_SCALE.EXCELLENT) {
        return 'grade-excellent';
    } else if (average >= GRADE_SCALE.GOOD) {
        return 'grade-good';
    } else if (average >= GRADE_SCALE.AVERAGE) {
        return 'grade-average';
    } else {
        return 'grade-poor';
    }
}

/**
 * Display statistics in formatted layout
 * Demonstrates: Object processing, HTML generation
 * 
 * @param {Object} stats - Statistics object
 */
function displayStatistics(stats) {
    const output = document.getElementById('output');
    
    let html = '<h3>Class Statistics</h3>';
    html += '<div class="statistics-grid">';
    
    // Basic statistics
    html += `
        <div class="stat-card">
            <div class="stat-value">${stats.totalStudents}</div>
            <div class="stat-label">Total Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.classAverage}%</div>
            <div class="stat-label">Class Average</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.highestAverage}%</div>
            <div class="stat-label">Highest Average</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.lowestAverage}%</div>
            <div class="stat-label">Lowest Average</div>
        </div>
    `;
    
    html += '</div>';
    
    // Subject distribution
    html += '<h4>Subject Distribution</h4>';
    for (const subject in stats.subjectDistribution) {
        const count = stats.subjectDistribution[subject];
        html += `<p><strong>${subject}:</strong> ${count} students</p>`;
    }
    
    // Grade distribution
    html += '<h4>Grade Distribution</h4>';
    for (const category in stats.gradeDistribution) {
        const count = stats.gradeDistribution[category];
        if (count > 0) {
            html += `<p><strong>${category}:</strong> ${count} students</p>`;
        }
    }
    
    output.innerHTML = html;
}

/**
 * Display top performer information
 * Demonstrates: Object access, HTML generation
 * 
 * @param {Object} student - Top performing student
 */
function displayTopPerformer(student) {
    const output = document.getElementById('output');
    
    const html = `
        <h3>🏆 Top Performer</h3>
        ${generateStudentCard(student)}
        <p><strong>Congratulations to ${student.name} for achieving the highest average of ${student.average}% in ${student.subject}!</strong></p>
    `;
    
    output.innerHTML = html;
}

/**
 * Display success or error messages
 * Demonstrates: DOM manipulation, conditional styling
 * 
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function displayMessage(message, type = 'info') {
    const output = document.getElementById('output');
    const className = type === 'success' ? 'success-message' : 'error-message';
    
    const messageHtml = `<div class="${className}">${message}</div>`;
    
    // If output is empty or has placeholder, replace it
    if (output.innerHTML.includes('placeholder') || output.innerHTML.trim() === '') {
        output.innerHTML = messageHtml;
    } else {
        // Prepend message to existing content
        output.innerHTML = messageHtml + output.innerHTML;
    }
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        const messageElement = output.querySelector(`.${className}`);
        if (messageElement) {
            messageElement.remove();
        }
    }, 5000);
}

// ============================================================================
// SEARCH AND FILTER FUNCTIONS
// ============================================================================

/**
 * Handle student search functionality
 * Demonstrates: Input handling, array processing
 */
function searchStudent() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        displayMessage('Please enter a search term', 'error');
        return;
    }
    
    const results = searchStudents(searchTerm);
    
    if (results.length === 0) {
        displayMessage(`No students found matching "${searchTerm}"`, 'error');
        return;
    }
    
    const output = document.getElementById('output');
    let html = `<h3>Search Results for "${searchTerm}" (${results.length} found)</h3>`;
    
    for (let i = 0; i < results.length; i++) {
        html += generateStudentCard(results[i]);
    }
    
    output.innerHTML = html;
}

/**
 * Filter students by subject
 * Demonstrates: Event handling, array filtering
 */
function filterBySubject() {
    const filterSelect = document.getElementById('filterSubject');
    const selectedSubject = filterSelect.value;
    
    const filtered = filterStudentsBySubject(selectedSubject);
    
    const output = document.getElementById('output');
    
    if (filtered.length === 0) {
        output.innerHTML = '<p class="placeholder">No students found for selected subject</p>';
        return;
    }
    
    const subjectText = selectedSubject || 'All Subjects';
    let html = `<h3>Students in ${subjectText} (${filtered.length} found)</h3>`;
    
    for (let i = 0; i < filtered.length; i++) {
        html += generateStudentCard(filtered[i]);
    }
    
    output.innerHTML = html;
}

// ============================================================================
// DATA PERSISTENCE FUNCTIONS
// ============================================================================

/**
 * Save data to local storage
 * Demonstrates: JSON serialization, error handling
 */
function saveToLocalStorage() {
    try {
        const dataToSave = {
            students: studentsDatabase,
            stats: systemStats,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('studentGradeSystem', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Failed to save to local storage:', error);
        displayMessage('Warning: Data could not be saved locally', 'error');
    }
}

/**
 * Load data from local storage
 * Demonstrates: JSON parsing, error handling, data validation
 */
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('studentGradeSystem');
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // Validate and restore data
            if (parsedData.students && Array.isArray(parsedData.students)) {
                studentsDatabase = parsedData.students;
            }
            
            if (parsedData.stats && typeof parsedData.stats === 'object') {
                systemStats = parsedData.stats;
            }
            
            displayMessage(`Loaded ${studentsDatabase.length} students from previous session`, 'success');
        }
    } catch (error) {
        console.error('Failed to load from local storage:', error);
        displayMessage('Warning: Could not load previous data', 'error');
    }
}

// ============================================================================
// UTILITY AND REPORT FUNCTIONS
// ============================================================================

/**
 * Generate comprehensive class report
 * Demonstrates: Complex data processing, report generation
 */
function generateClassReport() {
    if (studentsDatabase.length === 0) {
        displayMessage('No students in database to generate report', 'error');
        return;
    }
    
    const stats = calculateClassStatistics();
    const topPerformer = findTopPerformer();
    
    const output = document.getElementById('output');
    
    let html = `
        <h3>📊 Comprehensive Class Report</h3>
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        
        <h4>Summary Statistics</h4>
        <ul>
            <li>Total Students: ${stats.totalStudents}</li>
            <li>Class Average: ${stats.classAverage}%</li>
            <li>Highest Average: ${stats.highestAverage}%</li>
            <li>Lowest Average: ${stats.lowestAverage}%</li>
        </ul>
        
        <h4>Top Performer</h4>
        <p><strong>${topPerformer.name}</strong> (${topPerformer.id}) - ${topPerformer.average}% in ${topPerformer.subject}</p>
        
        <h4>Subject Breakdown</h4>
    `;
    
    // Subject analysis
    for (const subject in stats.subjectDistribution) {
        const subjectStudents = filterStudentsBySubject(subject);
        const subjectAverage = calculateSubjectAverage(subjectStudents);
        
        html += `<p><strong>${subject}:</strong> ${stats.subjectDistribution[subject]} students, Average: ${subjectAverage}%</p>`;
    }
    
    html += '<h4>Performance Distribution</h4>';
    for (const category in stats.gradeDistribution) {
        const count = stats.gradeDistribution[category];
        const percentage = Math.round((count / stats.totalStudents) * 100);
        html += `<p><strong>${category}:</strong> ${count} students (${percentage}%)</p>`;
    }
    
    output.innerHTML = html;
}

/**
 * Calculate average for a specific subject
 * Demonstrates: Array processing, mathematical operations
 * 
 * @param {Array} students - Array of students in subject
 * @returns {number} - Subject average
 */
function calculateSubjectAverage(students) {
    if (students.length === 0) return 0;
    
    let total = 0;
    for (let i = 0; i < students.length; i++) {
        total += students[i].average;
    }
    
    return Math.round((total / students.length) * 100) / 100;
}

/**
 * Clear all data from the system
 * Demonstrates: Array manipulation, user confirmation
 */
function clearAllData() {
    // Confirm with user before clearing
    const confirmed = confirm('Are you sure you want to clear all student data? This action cannot be undone.');
    
    if (confirmed) {
        // Reset all data structures
        studentsDatabase = [];
        systemStats = {
            totalStudents: 0,
            totalGradesEntered: 0,
            lastUpdated: null
        };
        
        // Clear local storage
        localStorage.removeItem('studentGradeSystem');
        
        // Clear output display
        const output = document.getElementById('output');
        output.innerHTML = '<p class="placeholder">All data cleared. Add students to get started.</p>';
        
        displayMessage('All data has been cleared successfully', 'success');
    }
}

// ============================================================================
// INITIALIZATION AND EVENT SETUP
// ============================================================================

/**
 * Initialize the application
 * Demonstrates: Event handling, application setup
 */
function initializeApplication() {
    // Load saved data
    loadFromLocalStorage();
    
    // Set up form submission handler
    handleFormSubmission();
    
    // Display welcome message
    if (studentsDatabase.length === 0) {
        displayMessage('Welcome to the Student Grade Management System! Add your first student to get started.', 'success');
    } else {
        displayMessage(`Welcome back! You have ${studentsDatabase.length} students in your database.`, 'success');
    }
    
    console.log('Student Grade Management System initialized successfully');
    console.log(`Current database contains ${studentsDatabase.length} students`);
}

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

/**
 * Start the application when DOM is loaded
 * Demonstrates: Event handling, application lifecycle
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Student Grade Management System...');
    
    try {
        initializeApplication();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        displayMessage('Application failed to initialize properly', 'error');
    }
});

// ============================================================================
// DEMONSTRATION DATA (Optional)
// ============================================================================

/**
 * Add sample data for demonstration purposes
 * Demonstrates: Function calls, data population
 */
function addSampleData() {
    const sampleStudents = [
        { name: 'Alice Johnson', id: 'STU001', subject: 'Mathematics', grades: [95, 87, 92, 89] },
        { name: 'Bob Smith', id: 'STU002', subject: 'Science', grades: [78, 82, 85, 80] },
        { name: 'Carol Davis', id: 'STU003', subject: 'English', grades: [88, 91, 87, 93] },
        { name: 'David Wilson', id: 'STU004', subject: 'History', grades: [72, 75, 78, 74] },
        { name: 'Eva Brown', id: 'STU005', subject: 'Computer Science', grades: [96, 94, 98, 95] }
    ];
    
    for (let i = 0; i < sampleStudents.length; i++) {
        const student = sampleStudents[i];
        addStudent(student.name, student.id, student.subject, student.grades);
    }
    
    displayMessage('Sample data added successfully!', 'success');
}

// Uncomment the line below to automatically add sample data on load
// setTimeout(addSampleData, 1000);

/**
 * PROGRAM SUMMARY:
 * 
 * This Student Grade Management System demonstrates all core programming concepts:
 * 
 * 1. VARIABLES & DATA TYPES:
 *    - studentsDatabase (Array)
 *    - systemStats (Object)
 *    - GRADE_SCALE (Object with constants)
 *    - Various string, number, and boolean variables
 * 
 * 2. CONTROL STRUCTURES:
 *    - if/else statements in getLetterGrade(), getGradeCategory()
 *    - for loops in calculateAverage(), displayAllStudents()
 *    - while loop in filterStudentsBySubject()
 *    - switch statement in getGradeCategory()
 * 
 * 3. FUNCTIONS:
 *    - Student() constructor with parameters
 *    - calculateAverage() with array parameter and numeric return
 *    - addStudent() with multiple parameters and boolean return
 *    - searchStudents() with string parameter and array return
 *    - Many other utility functions
 * 
 * 4. ERROR HANDLING:
 *    - try/catch blocks in addStudent(), saveToLocalStorage()
 *    - Input validation in all major functions
 *    - Custom error messages for user feedback
 * 
 * 5. INPUT/OUTPUT:
 *    - Form input handling for student data
 *    - Dynamic HTML generation for output display
 *    - Local storage for data persistence
 *    - Console logging for debugging
 * 
 * 6. LOGICAL OPERATIONS:
 *    - Comparison operators in grade calculations
 *    - Boolean logic in search and filter functions
 *    - Conditional rendering based on data state
 * 
 * The program is practical, well-commented, and follows best practices
 * with meaningful variable names and proper code organization.
 */