import axios from "axios";
import { APIGetWay } from "../components/helpers/constants";
import { getTokenData } from "./tokenUtils";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:9001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      mode: 'cors',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đăng nhập thất bại');
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

export const registerUser = async (newData) => {
  try {
    const response = await fetch(`${APIGetWay}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(newData)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi tạo user:", error.message);
    throw error; // Ném lỗi để component gọi hàm này có thể xử lý
  }
};

export const getUserByEmail = async (email, token) => {
  try {
    const response = await fetch(`${APIGetWay}/users/get-by-email?email=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi lấy useruser:", error.message);
    return `Lỗi: ${error.message}`;
  }
};

export const changePassword = async (data, token) => {
  try {
    const response = await fetch(`${APIGetWay}/users/change-pass`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  // Added this header
      },
      credentials: "include",
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi lấy useruser:", error.message);
    return `Lỗi: ${error.message}`;
  }
};


export const verifyOTP = async (otp) => {
  try {
    const response = await fetch(`${APIGetWay}/users/verify-account/${otp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data || 'An error occurred'
    } else {
      return error.message || 'An unexpected error occurred'
    }
  }
};
export const fetchAllUsers = async (token) => {
  try {
    const response = await fetch(`${APIGetWay}/users/manager/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi lấy useruser:", error.message);
    return `Lỗi: ${error.message}`;
  }
};
export const fetchFaceAuthData = async (token) => {
  try {
    const response = await axios.get(`${APIGetWay}/face-auth`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (response.data && response.data.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to retrieve face data');
    }
  } catch (error) {
    console.error("Error fetching face authentication data:", error);
    throw error;
  }
};  
export const updateFaceById = async (faceId, formData, token) => {
  try {
    const response = await axios.put(
      `${APIGetWay}/face-auth/update/${faceId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating face by ID:', error);
    throw error;
  }
};

export const updateUserAPI = async (userId, dataData, token) => {
  try {
    console.log("🚀 Dữ liệu FormData chuẩn bị gửi:");
    for (let pair of dataData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    const response = await fetch(`${APIGetWay}/users/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: dataData,
      credentials: "include"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi tạo user:", error.message);
    throw error; // Ném lỗi để component gọi hàm này có thể xử lý
  }
};

export const GetOTP = async (email) => {
  try {
    const response = await fetch(`${APIGetWay}/users/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error.message);
    return `Lỗi: ${error.message}`;
  }
};


export const ResetPass = async (email, otpCode) => {
  try {
    const response = await fetch(`${APIGetWay}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Added this header
      },
      credentials: "include",
      body: JSON.stringify({ email, otpCode })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Lỗi khi reset:", error.message);
    return `Lỗi: ${error.message}`;
  }
};