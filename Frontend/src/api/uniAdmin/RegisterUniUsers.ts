const API_BASE_URL = "http://localhost:3000/api/uniAdmin/registration";

// Update the interface to include all required fields
interface RegistrationData {
  fullName: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  idNumber: string;
  department: string;
  role: "Student" | "Supervisor";
  // Student specific fields
  level?: "PSM-1" | "PSM-2";
  // Supervisor specific fields
  contactEmail?: string;
  officeAddress?: string;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
  return /^\+?[\d\s-]+$/.test(phone);
};

const validateStudentData = (data: RegistrationData): string[] => {
  const errors: string[] = [];
  if (!data.level) errors.push(`Student ${data.idNumber}: Level is required (PSM-1 or PSM-2)`);
  return errors;
};

const validateSupervisorData = (data: RegistrationData): string[] => {
  const errors: string[] = [];
  if (!data.contactEmail) errors.push(`Supervisor ${data.idNumber}: Contact email is required`);
  if (!data.officeAddress) errors.push(`Supervisor ${data.idNumber}: Office address is required`);
  return errors;
};

export async function registerSingleUser(data: RegistrationData) {
  try {

    const response = await fetch(`${API_BASE_URL}/single`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function registerBulkUsers(data: RegistrationData[]) {
  try {
    
    // Validate all records before sending
    const validationErrors: string[] = [];
    const validRecords: RegistrationData[] = [];

    data.forEach((record, index) => {
      const recordErrors: string[] = [];

      // Common validations
      if (!record.fullName?.trim()) recordErrors.push(`Record ${index + 1}: Full name is required`);
      if (!record.universityEmail || !validateEmail(record.universityEmail)) {
        recordErrors.push(`Record ${index + 1}: Valid university email is required`);
      }
      if (!record.idNumber?.trim()) recordErrors.push(`Record ${index + 1}: ID number is required`);
      if (!record.department?.trim()) recordErrors.push(`Record ${index + 1}: Department is required`);
      if (record.phoneNumber && !validatePhoneNumber(record.phoneNumber)) {
        recordErrors.push(`Record ${index + 1}: Invalid phone number format`);
      }

      // Role-specific validations
      if (record.role === "Student") {
        recordErrors.push(...validateStudentData(record));
      } else if (record.role === "Supervisor") {
        recordErrors.push(...validateSupervisorData(record));
      } else {
        recordErrors.push(`Record ${index + 1}: Invalid role specified`);
      }

      if (recordErrors.length === 0) {
        validRecords.push(record);
      } else {
        validationErrors.push(...recordErrors);
      }
    });

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed:\n${validationErrors.join('\n')}`);
    }

    const response = await fetch(`${API_BASE_URL}/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(validRecords),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Bulk registration failed");
    }

    const result = await response.json();
    
    // Process results to show which records succeeded/failed
    const processedResults = {
      success: result.results.filter((r: any) => r.success),
      failed: result.results.filter((r: any) => !r.success),
      message: result.message
    };

    return processedResults;

  } catch (error) {
    console.error("Bulk registration error:", error);
    throw error;
  }
}