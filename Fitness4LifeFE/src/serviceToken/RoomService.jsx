import { APIGetWay } from "../components/helpers/constants";

export const fetchAllRoom = async (token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/rooms`, {
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

        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};
export const CreateRoomDashboard = async (club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime, token) => {

    try {
        const response = await fetch(`${APIGetWay}/dashboard/room/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime })
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
        console.error("Lỗi khi tạo club:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const UpdateRoomDashboard = async (id, club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime, token) => {

    try {
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
        const response = await fetch(`${APIGetWay}/dashboard/room/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: "include",
            body: data
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
        console.error("Lỗi khi tạo club:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const deleteRoom = async (id, token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/room/delete/${id}`, {
            method: 'DELETE',
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

        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};