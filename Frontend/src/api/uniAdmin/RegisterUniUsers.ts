const API_BASE_URL = "http://localhost:3000/api/uniAdmin/registration";

interface RegistrationData {
  fullName: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  idNumber: string;
  role: "Student" | "Supervisor";
  contactEmail?: string;
  officeAddress?: string;
}

export async function registerSingleUser(data: RegistrationData) {
  try {

        console.log("the data that has been recived is : ", data );

    // const response = await fetch(`${API_BASE_URL}/single`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || "Registration failed");
    // }

    // return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function registerBulkUsers(data: RegistrationData[]) {
  try {
    console.log("the data that has been recived is : ", data );
    
    // const response = await fetch(`${API_BASE_URL}/bulk`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || "Bulk registration failed");
    // }

    // return await response.json();
  } catch (error) {
    console.error("Bulk registration error:", error);
    throw error;
  }
}