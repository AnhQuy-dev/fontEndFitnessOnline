import { APIGetWay } from "../components/helpers/constants";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${APIGetWay}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ email, password })  // Sửa lỗi JSON.stringify
    });

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json(); // Sửa lỗi response.data.json()
    return result;

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred while logging in.');
    } else if (error.request) {
      throw new Error('No response from server. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
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