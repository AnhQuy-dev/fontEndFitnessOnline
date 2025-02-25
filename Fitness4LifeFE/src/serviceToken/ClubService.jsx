import { APIGetWay } from "../components/helpers/constants";


export const fetchAllClubs = async (token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/clubs`, {
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

        const data = await response.json(); // Chuyển response thành JSON
        // console.log("Dữ liệu nhận được: ", data);
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

export const CreateClub = async (newData, token) => {

    console.log("new data của create club", newData);

    try {
        const response = await fetch(`${APIGetWay}/dashboard/club/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(newData)
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

export const UpdateClub = async (clubId, data, token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/club/update/${clubId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(data)
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
        console.error("Lỗi khi update club:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const AddMoreImageClub = async (formData, token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/clubImage/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: "include",
            body: formData
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
        console.error("Lỗi khi add ImageClub:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const UpdateImageClub = async (ImageId, formData, token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/clubImage/update/${ImageId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: "include",
            body: formData
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
        console.error("Lỗi khi update ImageClub:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const ChosePrimaryImage = async (ImageId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/clubImage/primary/${ImageId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
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
        console.error("Lỗi khi chose primary ImageClub:", error.message);
        return `Lỗi: ${error.message}`;
    }
};


export const DeleteImageClub = async (ImageId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/dashboard/clubImage/delete/${ImageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
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
        console.error("Lỗi khi DELETE ImageClub:", error.message);
        return `Lỗi: ${error.message}`;
    }
};