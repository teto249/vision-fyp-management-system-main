const API_BASE_URL = "http://localhost:3000/api/student";

interface Supervisor {
  userId: string;
  fullName: string;
  email: string;
  universityId: string;
  department?: string;
  officeAddress?: string;
}

interface SupervisorsResponse {
  success: boolean;
  supervisors: Supervisor[];
  message?: string;
  count?: number;
}

interface FetchSupervisorsOptions {
  universityId: string;
  token: string;
}

export const fetchSupervisorsForUniversity = async ({
  universityId,
  token,
}: FetchSupervisorsOptions): Promise<SupervisorsResponse> => {
  
  try {
    const response = await fetch(`${API_BASE_URL}/${universityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch supervisors");
    }

    const data: SupervisorsResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch supervisors"
    );
  }
};

export const useSupervisors = async () => {
  const token = localStorage.getItem("authToken");
  const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");

  if (!token) {
    throw new Error("Authentication required");
  }

  // Try to get university ID from multiple possible sources
  const universityId = studentInfo?.universityId || 
                     studentInfo?.university?.id || 
                     studentInfo?.university?.shortName;



  if (!universityId) {
    throw new Error("University information not found. Please re-login and try again.");
  }

  return fetchSupervisorsForUniversity({
    universityId,
    token,
  });
};
