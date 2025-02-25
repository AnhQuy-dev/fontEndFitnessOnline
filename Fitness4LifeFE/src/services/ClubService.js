import axios from "axios";

const URL_CLUB = "http://localhost:8081/api/dashboard";

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


const updateClubApi = async (id, name, address, contactPhone, description, openHour, closeHour) => {
    const URL_BACKEND = `${URL_CLUB}/club/update/${id}`;
    const data = {
        name,
        address,
        contactPhone,
        description,
        openHour,
        closeHour
    };
    return axios.put(URL_BACKEND, data, createAuthConfig());
};

const deleteClubApi = async (id) => {
    const URL_BACKEND = `${URL_CLUB}/club/delete/${id}`;
    return axios.delete(URL_BACKEND, createAuthConfig());
};



const fetchClubById = async (id) => {
    const URL_BACKEND = `${URL_CLUB}/club/${id}`;
    return axios.get(URL_BACKEND, createAuthConfig());
};

// Tạo axios instance với interceptor để handle token
const api = axios.create({
    baseURL: URL_CLUB
});

// Add request interceptor để tự động thêm token vào headers
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

// Add response interceptor để handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export {
    updateClubApi,
    deleteClubApi,
    fetchClubById
};