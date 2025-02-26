import axios from "axios";

const URL_USER = "http://localhost:8080/api/users";

// Helper function to get token
const getToken = () => {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) throw new Error('No token found');
    const { access_token } = JSON.parse(tokenData);
    return access_token;
};

// Helper function to create auth config
const createAuthConfig = (contentType = 'application/json') => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': contentType
        }
    };
};




const GetOTP = async (email) => {
    const URL_BACKEND = `${URL_USER}/send-otp`;
    const data = { email };
    return axios.post(URL_BACKEND, data, createAuthConfig());
};

const ResetPass = async (email, otpCode) => {
    const URL_BACKEND = `${URL_USER}/reset-password`;
    try {
        const data = {
            email,
            otpCode
        };
        return axios.post(URL_BACKEND, data, createAuthConfig());
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
    }
};

// Create axios instance with interceptors
const api = axios.create({
    baseURL: URL_USER
});

// Add request interceptor for automatic token handling
api.interceptors.request.use(
    (config) => {
        try {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export {

    GetOTP,
    ResetPass
};