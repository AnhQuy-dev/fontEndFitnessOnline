import { APIGetWay } from "../components/helpers/constants";

export const getUserPoint = async (userId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/goal/userPoint/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu: ", error);
        return error.message || 'An unexpected error occurred';
    }
};
