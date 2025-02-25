import { APIGetWay } from "../components/helpers/constants";

export const GetAllQuestion = async (token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/questions`, {
            method: 'GET',
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
        console.error("Lỗi khi lấy post:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const getQuestionById = async (id, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/questions/${id}`, {
            method: 'GET',
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
        console.error("Lỗi khi lấy post:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const incrementViewCount = async (id, userId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/${id}/view?userId=${userId}`, {
            method: 'GET',
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
        console.error("Lỗi khi lấy post:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const CreateQuestion = async (newQuestion, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/questions/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: "include",
            body: newQuestion
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
        console.error("Lỗi khi tạo bài viết:", error.message);
        return `Lỗi: ${error.message}`;
    }
};


//=====================comment=======================

export const GetCommentByQuestionId = async (idQuestion, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/question/${idQuestion}/comment`, {
            method: 'GET',
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
        console.error("Lỗi khi lấy post:", error.message);
        return `Lỗi: ${error.message}`;
    }
};


