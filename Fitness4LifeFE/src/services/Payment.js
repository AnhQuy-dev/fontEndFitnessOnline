import axios from "axios";

const BASE_URL = "http://localhost:8082/api/paypal";

// Helper function để lấy token
const getToken = () => {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) throw new Error('No token found');
    const { access_token } = JSON.parse(tokenData);
    return access_token;
};

// Helper function để tạo config với token
const createAuthConfig = () => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const getMembershipByPamentId = async (paymentId) => {
    const URL_BACKEND = `${BASE_URL}/getMembershipByPamentId/${paymentId}`;
    try {
        const response = await fetch(URL_BACKEND, createAuthConfig());
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to fetch rooms for the package.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching rooms.');
    }
};

export const fetchPaymentStatistics = async () => {
    const URL_BACKEND = `${BASE_URL}/payments`;
    try {
        const response = await fetch(URL_BACKEND, createAuthConfig());
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to fetch Order.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching .');
    }
};

// Tạo axios instance với interceptors
const api = axios.create({
    baseURL: BASE_URL
});

// Add request interceptor để tự động thêm token
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

// Add response interceptor để xử lý lỗi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);