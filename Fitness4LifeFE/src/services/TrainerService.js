import axios from "axios";

const URL_TRAINER = "http://localhost:8081/api/dashboard";

// Helper function to get token
const getToken = () => {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) throw new Error('No token found');
    const { access_token } = JSON.parse(tokenData);
    return access_token;
};

// Helper function to create config with token
const createAuthConfig = (extraHeaders = {}) => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            ...extraHeaders
        }
    };
};

const fetchAllTrainer = async () => {
    try {
        const URL_BACKEND = `${URL_TRAINER}/trainers`;
        const response = await axios.get(URL_BACKEND, createAuthConfig());
        return response;
    } catch (error) {
        console.error('Error fetching trainers:', error);
        throw error;
    }
}

const deleteTrainer = async (id) => {
    try {
        const URL_BACKEND = `${URL_TRAINER}/trainer/delete/${id}`;
        return axios.delete(URL_BACKEND, createAuthConfig());
    } catch (error) {
        console.error('Error deleting trainer:', error);
        throw error;
    }
}

const createTrainer = async (fullName, slug, file, specialization, experienceYear, certificate, phoneNumber, scheduleTrainers, branch) => {
    try {
        const URL_BACKEND = `${URL_TRAINER}/trainer/add`;
        const formData = new FormData();
        
        formData.append('fullName', fullName);
        formData.append('slug', slug);
        if (file) {
            formData.append("file", file);
        }
        formData.append('specialization', specialization);
        formData.append('experienceYear', experienceYear);
        formData.append('certificate', certificate);
        formData.append('phoneNumber', phoneNumber);
        formData.append('branch', branch);
        formData.append('scheduleTrainers', scheduleTrainers.join(','));

        return axios.post(URL_BACKEND, formData, createAuthConfig({
            'Content-Type': 'multipart/form-data',
        }));
    } catch (error) {
        console.error('Error creating trainer:', error);
        throw error;
    }
}

const updateTrainer = async (id, fullName, slug, file, specialization, experienceYear, certificate, phoneNumber, scheduleTrainers, branch) => {
    try {
        const URL_BACKEND = `${URL_TRAINER}/trainer/update/${id}`;
        const formData = new FormData();
        
        formData.append("id", id);
        formData.append("fullName", fullName);
        formData.append("slug", slug);
        formData.append("file", file ? file : null);
        formData.append("specialization", specialization);
        formData.append("experienceYear", experienceYear);
        formData.append("certificate", certificate);
        formData.append("phoneNumber", phoneNumber);
        formData.append('scheduleTrainers', scheduleTrainers.join(','));
        formData.append("branch", branch);

        return axios.put(URL_BACKEND, formData, createAuthConfig({
            'Content-Type': 'multipart/form-data',
        }));
    } catch (error) {
        console.error('Error updating trainer:', error);
        throw error;
    }
};

// Create axios instance with interceptor
const api = axios.create({
    baseURL: URL_TRAINER
});

// Add request interceptor
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

// Add response interceptor
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
    fetchAllTrainer,
    deleteTrainer,
    createTrainer,
    updateTrainer,
};