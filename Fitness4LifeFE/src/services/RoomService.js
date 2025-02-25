import axios from "axios";

const URL_ROOM = "http://localhost:8081/api/dashboard";

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

const fetchAllRoom = async () => {
    try {
        const URL_BACKEND = `${URL_ROOM}/rooms`;
        const response = await axios.get(URL_BACKEND, createAuthConfig());
        return response;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

const createRoom = async (club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime) => {
    try {
        const URL_BACKEND = `${URL_ROOM}/room/add`;
        const data = {
            club,
            trainer,
            roomName,
            slug,
            capacity,
            facilities,
            status,
            startTime,
            endTime
        };
        return axios.post(URL_BACKEND, data, createAuthConfig());
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

const updateRoom = async (id, club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime) => {
    try {
        const URL_BACKEND = `${URL_ROOM}/room/update/${id}`;
        const data = {
            club,
            trainer,
            roomName,
            slug,
            capacity,
            facilities,
            status,
            startTime,
            endTime
        };
        return axios.put(URL_BACKEND, data, createAuthConfig());
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
};

const deleteRoom = async (id) => {
    try {
        const URL_BACKEND = `${URL_ROOM}/room/delete/${id}`;
        return axios.delete(URL_BACKEND, createAuthConfig());
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
};

// Tạo axios instance với interceptor
const api = axios.create({
    baseURL: URL_ROOM
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
    fetchAllRoom,
    createRoom,
    deleteRoom,
    updateRoom
};