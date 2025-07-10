const API_BASE = "http://localhost:3001/api";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  message: string;
  resetToken?: string;
  userType?: string;
}

export interface ApiResponse {
  message: string;
}

export const initiatePasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  try {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to initiate password reset");
    }

    return data;
  } catch (error) {
    console.error("Password reset initiation error:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return data;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const changePassword = async (
  currentPassword: string, 
  newPassword: string, 
  token: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    return data;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};
