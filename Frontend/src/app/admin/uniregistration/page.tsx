"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import UniversityRegistrationFormContent from "../components/uniregistration/UniversityRegistrationFormContent";
import { registerUniversity } from "../../../api/admin/registerUniversity";


interface FormErrors {
  [key: string]: string;
}

interface FormData {
  shortName: string;
  fullName: string;
  address: string;
  email: string;
  phone: string;
  maxStudents: string;
  maxSupervisors: string;
  adminFullName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  description: string;
}

export default function UniversityRegistrationForm() {
  console.log('🏗️ University Registration Form component initialized');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    shortName: "",
    fullName: "",
    address: "",
    email: "",
    phone: "",
    maxStudents: "",
    maxSupervisors: "",
    adminFullName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    description: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  console.log('📊 Component state initialized:', {
    currentStep: 1,
    isSubmitting: false,
    errorsCount: Object.keys(errors).length,
    formDataKeys: Object.keys(formData)
  });

  const steps = [
    { id: 1, title: "University Details", description: "Basic information about the institution" },
    { id: 2, title: "Contact Information", description: "Official communication channels" },
    { id: 3, title: "System Capacity", description: "User limits and resources" },
    { id: 4, title: "Administrator", description: "Primary contact setup" },
    { id: 5, title: "Review & Submit", description: "Confirm all details" },
  ];

  const validateField = (name: string, value: string): string => {
    console.log(`🔍 Validating field: ${name} with value: "${name.includes('password') ? '***hidden***' : value}"`);
    
    switch (name) {
      case "shortName":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Short name is required";
        }
        if (value.length < 2 || value.length > 10) {
          console.log(`❌ ${name}: Invalid length (${value.length})`);
          return "Short name must be 2-10 characters";
        }
        if (!/^[A-Z0-9]+$/.test(value.toUpperCase())) {
          console.log(`❌ ${name}: Invalid characters`);
          return "Short name can only contain letters and numbers (no spaces)";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "fullName":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Full name is required";
        }
        if (value.length < 3 || value.length > 255) {
          console.log(`❌ ${name}: Invalid length (${value.length})`);
          return "Full name must be 3-255 characters";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "address":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Address is required";
        }
        if (value.length < 5 || value.length > 500) {
          console.log(`❌ ${name}: Invalid length (${value.length})`);
          return "Address must be 5-500 characters";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "email":
      case "adminEmail":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Email is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          console.log(`❌ ${name}: Invalid email format`);
          return "Invalid email format";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "phone":
      case "adminPhone":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Phone number is required";
        }
        if (!/^\+?[\d\s-]+$/.test(value) || value.length < 8 || value.length > 20) {
          console.log(`❌ ${name}: Invalid phone format`);
          return "Phone must be 8-20 characters with digits, spaces, hyphens only";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "maxStudents":
      case "maxSupervisors":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "This field is required";
        }
        const num = parseInt(value);
        if (isNaN(num) || num < 1) {
          console.log(`❌ ${name}: Invalid number (${value})`);
          return "Must be a positive number";
        }
        if (name === "maxStudents" && (num < 100 || num > 50000)) {
          console.log(`❌ ${name}: Out of range (${num})`);
          return "Students must be between 100 and 50,000";
        }
        if (name === "maxSupervisors" && (num < 10 || num > 1000)) {
          console.log(`❌ ${name}: Out of range (${num})`);
          return "Supervisors must be between 10 and 1,000";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "adminFullName":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Administrator name is required";
        }
        if (value.length < 2) {
          console.log(`❌ ${name}: Too short (${value.length})`);
          return "Name must be at least 2 characters";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      case "adminPassword":
        if (!value.trim()) {
          console.log(`❌ ${name}: Empty value`);
          return "Password is required";
        }
        if (value.length < 8) {
          console.log(`❌ ${name}: Too short (${value.length})`);
          return "Password must be at least 8 characters";
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          console.log(`❌ ${name}: Doesn't meet complexity requirements`);
          return "Password must contain uppercase, lowercase, and number";
        }
        console.log(`✅ ${name}: Valid`);
        return "";
      
      default:
        console.log(`⚠️ ${name}: No validation rule found`);
        return "";
    }
  };

  const validateStep = (step: number): boolean => {
    console.log(`🔍 Starting validation for step ${step}`);
    const stepErrors: FormErrors = {};
    let isValid = true;

    switch (step) {
      case 1:
        console.log('🔍 Validating university details (step 1)...');
        const uniFields = ["shortName", "fullName", "address"];
        uniFields.forEach(field => {
          const value = formData[field as keyof FormData];
          console.log(`🔍 Validating ${field}: "${value}"`);
          const error = validateField(field, value);
          if (error) {
            console.error(`❌ ${field} validation failed: ${error}`);
            stepErrors[field] = error;
            isValid = false;
          } else {
            console.log(`✅ ${field} validation passed`);
          }
        });
        break;
      
      case 2:
        console.log('🔍 Validating contact information (step 2)...');
        const contactFields = ["email", "phone"];
        contactFields.forEach(field => {
          const value = formData[field as keyof FormData];
          console.log(`🔍 Validating ${field}: "${value}"`);
          const error = validateField(field, value);
          if (error) {
            console.error(`❌ ${field} validation failed: ${error}`);
            stepErrors[field] = error;
            isValid = false;
          } else {
            console.log(`✅ ${field} validation passed`);
          }
        });
        break;
      
      case 3:
        console.log('🔍 Validating system capacity (step 3)...');
        const capacityFields = ["maxStudents", "maxSupervisors"];
        capacityFields.forEach(field => {
          const value = formData[field as keyof FormData];
          console.log(`🔍 Validating ${field}: "${value}"`);
          const error = validateField(field, value);
          if (error) {
            console.error(`❌ ${field} validation failed: ${error}`);
            stepErrors[field] = error;
            isValid = false;
          } else {
            console.log(`✅ ${field} validation passed`);
          }
        });
        break;
      
      case 4:
        console.log('🔍 Validating administrator details (step 4)...');
        const adminFields = ["adminFullName", "adminEmail", "adminPassword"];
        adminFields.forEach(field => {
          const value = formData[field as keyof FormData];
          console.log(`🔍 Validating ${field}: "${field === 'adminPassword' ? '***hidden***' : value}"`);
          const error = validateField(field, value);
          if (error) {
            console.error(`❌ ${field} validation failed: ${error}`);
            stepErrors[field] = error;
            isValid = false;
          } else {
            console.log(`✅ ${field} validation passed`);
          }
        });
        break;
    }

    console.log(`📊 Step ${step} validation result:`, { isValid, errors: stepErrors });
    setErrors(stepErrors);
    return isValid;
  };

  const handleInputChange = (name: string, value: string) => {
    console.log(`📝 Input changed: ${name} = "${name.includes('password') ? '***hidden***' : value}"`);
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      console.log(`🧹 Clearing error for field: ${name}`);
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNextStep = () => {
    console.log(`🔄 Attempting to move from step ${currentStep} to next step...`);
    if (validateStep(currentStep)) {
      console.log(`✅ Step ${currentStep} validation passed, moving to next step`);
      setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStep)));
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      console.log(`📍 Moved to step ${Math.min(currentStep + 1, steps.length)}`);
    } else {
      console.log(`❌ Step ${currentStep} validation failed, staying on current step`);
    }
  };

  const handlePrevStep = () => {
    console.log(`🔄 Moving from step ${currentStep} to previous step...`);
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    console.log(`📍 Moved to step ${prevStep}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('🚀 Starting university registration submission...');
    console.log('📝 Current form data:', formData);
    
    // Validate all steps
    let allValid = true;
    console.log('🔍 Starting validation for all steps...');
    
    for (let i = 1; i <= 4; i++) {
      console.log(`🔍 Validating step ${i}...`);
      if (!validateStep(i)) {
        console.error(`❌ Step ${i} validation failed`);
        allValid = false;
      } else {
        console.log(`✅ Step ${i} validation passed`);
      }
    }

    if (!allValid) {
      console.error('❌ Form validation failed. Errors:', errors);
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    console.log('✅ All validation passed, proceeding with submission...');
    setIsSubmitting(true);

    try {
      console.log('📦 Creating FormData object...');
      const submitFormData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        console.log(`📦 Adding to FormData: ${key} = ${value}`);
        submitFormData.append(key, value);
      });

      console.log('🌐 Calling registerUniversity API...');
      console.log('🔗 API endpoint will be called...');
      
      const data = await registerUniversity(submitFormData);
      
      console.log("✅ Registration response received:", data);
      console.log("📧 Email should be sent automatically via EmailJS");
      
      toast.success("🎉 University registered successfully! Welcome email sent to administrator.");
      console.log('🔄 Redirecting to /admin...');
      router.push("/admin");
    } catch (error) {
      console.error('❌ Registration failed with error:', error);
      console.error('📋 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        formData: formData
      });
      
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      console.log('🏁 Setting isSubmitting to false...');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">University Registration</h1>
          <p className="text-gray-400">Register a new university to the VISION FYP Management System</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep === step.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : completedSteps.has(step.id)
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}>
                  {completedSteps.has(step.id) ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 transition-all duration-300 ${
                    completedSteps.has(step.id) ? 'bg-green-600' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-white">{steps[currentStep - 1].title}</h3>
            <p className="text-gray-400 text-sm">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <form ref={formRef} onSubmit={handleSubmit} className="p-8">
            {/* Step 1: University Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Short Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.shortName}
                      onChange={(e) => handleInputChange("shortName", e.target.value)}
                      placeholder="UTM"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.shortName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.shortName && <p className="mt-1 text-sm text-red-400">{errors.shortName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="University Technology Malaysia"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Full physical address of the university"
                    rows={3}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description about the university (optional)"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contact@university.edu"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+60 12 345 6789"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: System Capacity */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Students <span className="text-red-400">*</span>
                      <span className="ml-2 text-xs text-gray-400">(recommended: 1000-5000)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange("maxStudents", e.target.value)}
                      min="1"
                      max="10000"
                      placeholder="1000"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.maxStudents ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.maxStudents && <p className="mt-1 text-sm text-red-400">{errors.maxStudents}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Supervisors <span className="text-red-400">*</span>
                      <span className="ml-2 text-xs text-gray-400">(recommended: 50-200)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxSupervisors}
                      onChange={(e) => handleInputChange("maxSupervisors", e.target.value)}
                      min="1"
                      max="1000"
                      placeholder="100"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.maxSupervisors ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.maxSupervisors && <p className="mt-1 text-sm text-red-400">{errors.maxSupervisors}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Administrator Details */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.adminFullName}
                    onChange={(e) => handleInputChange("adminFullName", e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.adminFullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                    }`}
                  />
                  {errors.adminFullName && <p className="mt-1 text-sm text-red-400">{errors.adminFullName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                      placeholder="admin@university.edu"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.adminEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.adminEmail && <p className="mt-1 text-sm text-red-400">{errors.adminEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => handleInputChange("adminPhone", e.target.value)}
                      placeholder="+60 12 345 6789"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.adminPhone ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                      }`}
                    />
                    {errors.adminPhone && <p className="mt-1 text-sm text-red-400">{errors.adminPhone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                    <span className="ml-2 text-xs text-gray-400">(min 8 chars, uppercase, lowercase, number)</span>
                  </label>
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.adminPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'
                    }`}
                  />
                  {errors.adminPassword && <p className="mt-1 text-sm text-red-400">{errors.adminPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Review Registration Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium text-green-400 mb-2">University Information</h4>
                      <p className="text-gray-300"><span className="text-gray-400">Name:</span> {formData.fullName}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Short Name:</span> {formData.shortName}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Email:</span> {formData.email}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Phone:</span> {formData.phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-green-400 mb-2">System Capacity</h4>
                      <p className="text-gray-300"><span className="text-gray-400">Max Students:</span> {formData.maxStudents}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Max Supervisors:</span> {formData.maxSupervisors}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-green-400 mb-2">Administrator</h4>
                      <p className="text-gray-300"><span className="text-gray-400">Name:</span> {formData.adminFullName}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Email:</span> {formData.adminEmail}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Phone:</span> {formData.adminPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                  />
                  <label htmlFor="termsAccepted" className="text-sm text-gray-300">
                    I confirm that all information provided is accurate and I agree to the{" "}
                    <a href="#" className="text-green-400 hover:underline">terms and conditions</a>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-all duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-500'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    'Register University'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Display Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-medium mb-2">Please fix the following errors:</h4>
            <ul className="text-red-300 text-sm space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>• {message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
