import axios from "axios";

const URL_BRAND = "http://localhost:8081/api/dashboard";

// Helper function to get token (reused from club implementation)
const getToken = () => {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) throw new Error('No token found');
    const { access_token } = JSON.parse(tokenData);
    return access_token;
};

// Helper function to create auth config (reused from club implementation)
const createAuthConfig = () => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

const fetchAllBranch = async () => {
    const URL_BACKEND = `${URL_BRAND}/branchs`;
    return axios.get(URL_BACKEND, createAuthConfig());
}

const deleteBranch = async (id) => {
    const URL_BACKEND = `${URL_BRAND}/branch/delete/${id}`;
    return axios.delete(URL_BACKEND, createAuthConfig());
}

const createBrand = async (branchName, slug, address, phoneNumber, email, openHours, closeHours, services) => {
    const URL_BACKEND = `${URL_BRAND}/branch/add`;
    const data = {
        branchName,
        slug,
        address,
        phoneNumber,
        email,
        openHours,
        closeHours,
        services
    };
    return axios.post(URL_BACKEND, data, createAuthConfig());
}

const updateBranch = async (id, branchName, slug, address, phoneNumber, email, openHours, closeHours, services) => {
    const URL_BACKEND = `${URL_BRAND}/branch/update/${id}`;
    const data = {
        branchName,
        slug,
        address,
        phoneNumber,
        email,
        openHours,
        closeHours,
        services
    };
    console.log("ID being sent to API:", id);
    console.log("Data being sent to API:", data);
    return axios.put(URL_BACKEND, data, createAuthConfig());
}

// Create axios instance with interceptors (similar to club implementation)
const api = axios.create({
    baseURL: URL_BRAND
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
    fetchAllBranch,
    deleteBranch,
    createBrand,
    updateBranch
}