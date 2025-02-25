import axios from "axios";
import { getDecodedToken, getTokenData } from "../serviceToken/tokenUtils";
import { URL_BOOKING } from "../components/helpers/constants";

export const fetchAllBookingHistoryByUserId = async (userId, token) => {
    try {
        const response = await fetch(`${URL_BOOKING}/booking/bookingRooms/history/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // 🔍 In ra để kiểm tra dữ liệu API

        // Kiểm tra nếu API trả về object thay vì array
        if (!Array.isArray(data)) {
            console.warn("Expected an array but received an object. Trying to extract data...");

            // Nếu API trả về object chứa key "data" là array thì lấy ra
            if (data && Array.isArray(data.data)) {
                return data.data;
            }

            throw new Error(`Invalid data format: Expected an array but received ${typeof data}`);
        }

        return data;
    } catch (error) {
        console.error("Error fetching booking data:", error);
        throw error;
    }
};



export const getQrCode = async (bookingId, token) => {
    try {
        const response = await fetch(`${URL_BOOKING}/booking/qrCode/${bookingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json(); // ⬅️ Chuyển đổi JSON
        return data.data; // ⬅️ Trả về phần chứa thông tin QR Code
    } catch (error) {
        console.error('Error fetching QR code:', error);
        throw error;
    }
};



