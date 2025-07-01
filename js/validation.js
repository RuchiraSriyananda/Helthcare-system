// Healthcare Management System - Form Validation

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (US format)
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

// SSN validation regex
const SSN_REGEX = /^\d{3}-?\d{2}-?\d{4}$/;

// Validation rules
const validationRules = {
    required: (value) => value && value.trim() !== '',
    email: (value) => !value || EMAIL_REGEX.test(value),
    phone: (value) => !value || PHONE_REGEX.test(value),
    ssn: (value) => !value || SSN_REGEX.test(value),
    minLength: (value, min) => !value || value.length >= min,
    maxLength: (value, max) => !value || value.length <= max,
    numeric: (value) => !value || /^\d+$/.test(value),
    alphanumeric: (value) => !value || /^[a-zA-Z0-9]+$/.test(value),
    date: (value) => !value || !isNaN(Date.parse(value)),
    futureDate: (value) => !value || new Date(value) > new Date(),
    pastDate: (value) => !value || new Date(value) < new Date(),
    age: (birthDate) => {
        if (!birthDate) return true;
        const age = calculateAge(birthDate);
        return age >= 0 && age <= 150;
    }
};

// Error messages
const errorMessages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    ssn: 'Please enter a valid SSN (000-00-0000)',
    minLength: 'Must be at least {min} characters long',
    maxLength: 'Must be no more than {max} characters long',
    numeric: 'Please enter numbers only',
    alphanumeric: 'Please enter letters and numbers only',
    date: 'Please enter a valid date',
    futureDate: 'Date must be in the future',
    pastDate: 'Date must be in the past',
    age: 'Please enter a valid birth date'
};

// Form validation configurations
const formConfigs = {
    patientRegistration: {
        firstName: { required: true, minLength: 2, maxLength: 50 },
        lastName: { required: true, minLength: 2, maxLength: 50 },
        dateOfBirth: { required: true, date: true, pastDate: true, age: true },
        gender: { required: true },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
        address: { required: true, minLength: 10, maxLength: 200 },
        city: { required: true, minLength: 2, maxLength: 50 },
        state: { required: true },
        zipCode: { required: true, numeric: true, minLength: 5, maxLength: 10 },
        emergencyName: { required: true, minLength: 2, maxLength: 50 },
        emergencyRelation: { required: true, minLength: 2, maxLength: 30 },
        emergencyPhone: { required: true, phone: true },
        ssn: { ssn: true },
        emergencyEmail: { email: true }
    },
    appointment: {
        patientId: { required: true },
        doctorId: { required: true },
        appointmentDate: { required: true, date: true, futureDate: true },
        appointmentTime: { required: true },
        reason: { required: true, minLength: 5, maxLength: 500 }
    },
    prescription: {
        patientId: { required: true },
        doctorId: { required: true },
        medication: { required: true, minLength: 2, maxLength: 100 },
        dosage: { required: true, minLength: 2, maxLength: 50 },
        frequency: { required: true },
        duration: { required: true, minLength: 2, maxLength: 50 },
        instructions: { maxLength: 500 }
    },
    billing: {
        patientId: { required: true },
        serviceDate: { required: true, date: true, pastDate: true },
        description: { required: true, minLength: 5, maxLength: 200 },
        amount: { required: true, numeric: true },
        paymentMethod: { required: true }
    }
};

// Main validation function
function validateForm(formId, config = null) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const formData = new FormData(form);
    const validationConfig = config || formConfigs[formId] || {};
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate each field
    for (const [fieldName, rules] of Object.entries(validationConfig)) {
        const fieldValue = formData.get(fieldName) || '';
        const fieldErrors = validateField(fieldName, fieldValue, rules);
        
        if (fieldErrors.length > 0) {
            showFieldError(fieldName, fieldErrors[0]);
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate individual field
function validateField(fieldName, value, rules) {
    const errors = [];
    
    for (const [rule, ruleValue] of Object.entries(rules)) {
        if (!validationRules[rule]) continue;
        
        let isValidRule;
        if (typeof ruleValue === 'boolean' && ruleValue) {
            isValidRule = validationRules[rule](value);
        } else if (typeof ruleValue === 'number') {
            isValidRule = validationRules[rule](value, ruleValue);
        } else {
            continue;
        }
        
        if (!isValidRule) {
            let errorMessage = errorMessages[rule] || 'Invalid value';
            
            // Replace placeholders in error messages
            if (rule === 'minLength') {
                errorMessage = errorMessage.replace('{min}', ruleValue);
            } else if (rule === 'maxLength') {
                errorMessage = errorMessage.replace('{max}', ruleValue);
            }
            
            errors.push(errorMessage);
        }
    }
    
    return errors;
}

// Real-time validation
function setupRealTimeValidation(formId, config = null) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const validationConfig = config || formConfigs[formId] || {};
    
    // Add event listeners to form fields
    for (const fieldName of Object.keys(validationConfig)) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) continue;
        
        // Validate on blur
        field.addEventListener('blur', function() {
            const errors = validateField(fieldName, this.value, validationConfig[fieldName]);
            
            if (errors.length > 0) {
                showFieldError(fieldName, errors[0]);
            } else {
                clearFieldError(fieldName);
            }
        });
        
        // Clear error on input
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(fieldName);
            }
        });
    }
}

// Patient form specific validation
function validatePatientForm() {
    const isValid = validateForm('patientRegistrationForm', formConfigs.patientRegistration);
    
    // Additional custom validations
    if (isValid) {
        // Check if emergency contact is different from patient
        const patientPhone = document.getElementById('phone').value;
        const emergencyPhone = document.getElementById('emergencyPhone').value;
        
        if (patientPhone === emergencyPhone) {
            showFieldError('emergencyPhone', 'Emergency contact should be different from patient');
            return false;
        }
        
        // Validate age is reasonable
        const birthDate = document.getElementById('dateOfBirth').value;
        const age = calculateAge(birthDate);
        
        if (age < 0 || age > 150) {
            showFieldError('dateOfBirth', 'Please enter a valid birth date');
            return false;
        }
        
        if (age < 18) {
            // Minor patient - ensure guardian information is complete
            if (!validateMinorPatient()) {
                return false;
            }
        }
    }
    
    return isValid;
}

// Validate minor patient additional requirements
function validateMinorPatient() {
    // For minors, emergency contact is typically a guardian
    const emergencyRelation = document.getElementById('emergencyRelation').value.toLowerCase();
    const guardianRelations = ['parent', 'guardian', 'mother', 'father', 'mom', 'dad'];
    
    if (!guardianRelations.some(relation => emergencyRelation.includes(relation))) {
        showFieldError('emergencyRelation', 'For minors, emergency contact should be a parent or guardian');
        return false;
    }
    
    return true;
}

// Appointment form validation
function validateAppointmentForm() {
    const isValid = validateForm('appointmentForm', formConfigs.appointment);
    
    if (isValid) {
        // Check if appointment is during business hours
        const appointmentTime = document.getElementById('appointmentTime').value;
        if (!isValidAppointmentTime(appointmentTime)) {
            showFieldError('appointmentTime', 'Please select a time during business hours (8 AM - 6 PM)');
            return false;
        }
        
        // Check if appointment is not on weekend (unless emergency)
        const appointmentDate = document.getElementById('appointmentDate').value;
        if (!isValidAppointmentDate(appointmentDate)) {
            showFieldError('appointmentDate', 'Please select a weekday for regular appointments');
            return false;
        }
    }
    
    return isValid;
}

// Prescription form validation
function validatePrescriptionForm() {
    const isValid = validateForm('prescriptionForm', formConfigs.prescription);
    
    if (isValid) {
        // Check for drug interactions (simplified)
        const medication = document.getElementById('medication').value;
        if (checkDrugInteractions(medication)) {
            showWarning('Please review potential drug interactions for this medication');
        }
    }
    
    return isValid;
}

// Utility functions
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function isValidAppointmentTime(time) {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const startTime = 8 * 60; // 8 AM
    const endTime = 18 * 60; // 6 PM
    
    return timeInMinutes >= startTime && timeInMinutes <= endTime;
}

function isValidAppointmentDate(date) {
    if (!date) return false;
    
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();
    
    // 0 = Sunday, 6 = Saturday
    return dayOfWeek >= 1 && dayOfWeek <= 5;
}

function checkDrugInteractions(medication) {
    // Simplified drug interaction check
    const commonInteractions = [
        'warfarin', 'aspirin', 'ibuprofen', 'acetaminophen', 
        'metformin', 'lisinopril', 'amlodipine'
    ];
    
    return commonInteractions.some(drug => 
        medication.toLowerCase().includes(drug)
    );
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (field) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.removeAttribute('role');
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.removeAttribute('role');
    });
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
    });
}

// Form submission helpers
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        clearFormErrors();
    }
}

// Export validation functions
window.FormValidation = {
    validateForm,
    validateField,
    validatePatientForm,
    validateAppointmentForm,
    validatePrescriptionForm,
    setupRealTimeValidation,
    getFormData,
    resetForm,
    clearFormErrors,
    showFieldError,
    clearFieldError
};

// Initialize real-time validation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Auto-setup validation for known forms
    const forms = [
        'patientRegistrationForm',
        'appointmentForm',
        'prescriptionForm',
        'billingForm'
    ];
    
    forms.forEach(formId => {
        if (document.getElementById(formId)) {
            setupRealTimeValidation(formId);
        }
    });
});