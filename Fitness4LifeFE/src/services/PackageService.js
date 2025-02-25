import axios from "axios";
const URL_PACK = "http://localhost:8082/api/booking";
const tokenData = localStorage.getItem("tokenData");

export const submitBookingRoom = async (bookingData) => {
    try {
        console.log(bookingData);

        const { access_token } = JSON.parse(tokenData);

        const response = await axios.post(`${URL_PACK}/bookingRoom/add`, bookingData, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json', // Đảm bảo gửi dữ liệu dạng JSON
            },
        });
        return response;
    } catch (error) {
        console.error('Error booking room:', error);
        throw error.response?.data || { message: 'Unknown error occurred' };
    }
};
const createPackageAPI = (packageName, description, durationMonth, price) => {
    const URL_BACKEND = `${URL_PACK}/package/add`;
    const data = {
        packageName: packageName,
        description: description,
        durationMonth: durationMonth,
        price: price
    };
    return axios.post(URL_BACKEND, data);
};

const updatePackage = (id, packageName, description, durationMonth, price) => {
    const URL_BACKEND = `${URL_PACK}/package/update/${id}`;
    const data = {
        packageName: packageName,
        description: description,
        durationMonth: durationMonth,
        price: price
    };
    return axios.put(URL_BACKEND, data);
};

const deletePackage = (id) => {
    const URL_BACKEND = `${URL_PACK}/package/delete/${id}`;
    return axios.delete(URL_BACKEND);
}

const GetRoomsByPackage = async (packageId) => {
    try {
        if (!tokenData) {
            throw new Error("Vui lòng đăng nhập để xem phòng");
        }

        const { access_token } = JSON.parse(tokenData);
        const response = await fetch(`http://localhost:8081/api/dashboard/packages/${packageId}/rooms`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch rooms.');
        }

        const data = await response.json();

        // If the API returns an array directly
        if (Array.isArray(data)) {
            return data;
        }

        // If the API wraps the data in an object
        if (data.data && Array.isArray(data.data)) {
            return data.data;
        }

        throw new Error('Invalid data format received from server');

    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw new Error(error.message || 'Error fetching rooms.');
    }
};


export {
    createPackageAPI,
    updatePackage,
    deletePackage,
    GetRoomsByPackage,
}