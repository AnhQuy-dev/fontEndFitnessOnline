
import { APIGetWay } from "../components/helpers/constants";

// get all promotion in database còn hoạt động 
export const getAllPromotions = async (token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include" // 🔥 Thêm dòng này nếu cần gửi cookie/token
        });

        // console.log("có được gọi ko ta: ", response);

        // Kiểm tra xem phản hồi có dữ liệu không
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

// send all promotion cho all user
export const sendPromotionOfUser = async (code, token) => {
    console.log("Token gửi đi:", token);
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/send-code-to-all?code=${code}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });

        // Kiểm tra lỗi HTTP (4xx, 5xx)
        if (!response.ok) {
            const errorText = await response.text(); // Đọc lỗi từ server
            throw new Error(`Lỗi ${response.status}: ${errorText}`);
        }

        // Kiểm tra kiểu dữ liệu trả về
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json(); // Trả về JSON nếu có
        } else {
            return await response.text(); // Trả về text nếu không phải JSON
        }
    } catch (error) {
        console.error("Lỗi khi gửi mã khuyến mãi:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

// send mail cho 1 user được chỉ định bằng email
export const sendPromotionOneUser = async (code, email, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/send-code-to-user?code=${code}&email=${email}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        // Kiểm tra lỗi HTTP (4xx, 5xx)
        if (!response.ok) {
            const errorText = await response.text(); // Đọc lỗi từ server
            throw new Error(`Lỗi ${response.status}: ${errorText}`);
        }

        // Kiểm tra kiểu dữ liệu trả về
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json(); // Trả về JSON nếu có
        } else {
            return await response.text(); // Trả về text nếu không phải JSON
        }
    } catch (error) {
        console.error("Lỗi khi gửi mã khuyến mãi:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

// create promotion hoạt động
export const createPromotions = async (newPromotion, token) => {
    console.log("new data promotion", newPromotion);
    console.log("token : ", token);

    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(newPromotion)
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
        console.error("Lỗi khi gửi mã khuyến mãi:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

// chủ động change status promotion
export const changestatus = async (id, isActive, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/changePublished/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ isActive: isActive }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Failed to change status');
    }
};

// chủ động xóa promotion
export const DeletePromotions = async (id, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred'
        } else {
            return error.message || 'An unexpected error occurred'
        }
    }
};

// show các mã được tạo ra để dùng point đổi
export const getAllPromotionsInJson = async (token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/json/all`, {
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

// create promotion in json
export const savePromotionInJson = async (newData, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotions/saveJson`, {
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
        console.error("Lỗi khi gửi mã khuyến mãi:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

// show promotion bên user

export const getPromotionUser = async (userId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotionOfUser/getPromotionUser/${userId}`, {
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


export const usedPointChangCode = async (userId, point, promotionId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/promotionOfUser/usedPointChangCode/${userId}?point=${point}&promotionId=${promotionId}`, {
            method: 'POST',
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
        console.error("Lỗi khi đổi mã khuyến mãi:", error.message);
        return `Lỗi: ${error.message}`;
    }
};


// export const findCode = async (promotionCode, userId) => {
//     try {
//         const response = await axios.get(`${smartAPI}/promotionOfUser/${promotionCode}/${userId}`)
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             return error.response.data || 'An error occurred'
//         } else {
//             return error.message || 'An unexpected error occurred'
//         }
//     }
// };

// export const UsedPromotionCode = async (code, userId) => {
//     try {
//         const response = await axios.post(`${smartAPI}/promotionOfUser/usedCode/${userId}?promotionCode=${code}`);
//         return response;
//     } catch (error) {
//         if (error.response) {
//             return error.response.data || 'An error occurred';
//         } else {
//             return error.message || 'An unexpected error occurred';
//         }
//     }
// };