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

export const voteQuestion = async (id, voteType, userId, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/${id}/vote?userId=${userId}&voteType=${voteType}`, {
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
        console.error("Lỗi khi vote question:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const updateQuestion = async (id, updateData, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/questions/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: "include",
            body: updateData
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
        console.error("Lỗi khi cập nhật bài viết:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const deleteQuestion = async (id, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/questions/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
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
        console.error("Lỗi khi xóa bài viết:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const changePublished = async (id, changeStatus, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/Questions/changePublished/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(changeStatus)
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
        console.error("Lỗi khi cập nhật trạng thái bài viết:", error.message);
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


export const createComment = async (data, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/comments/create`, {
            method: 'POST',
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
        console.error("Lỗi khi gửi comment:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const updateComment = async (idComment, updateComment, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/comments/update/${idComment}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(updateComment)
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
        console.error("Lỗi khi gửi comment:", error.message);
        return `Lỗi: ${error.message}`;
    }
};

export const deleteComment = async (idComment, token) => {
    try {
        const response = await fetch(`${APIGetWay}/deal/forums/comments/delete/${idComment}`, {
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
        console.error("Lỗi khi delete comment:", error.message);
        return `Lỗi: ${error.message}`;
    }
};



// export const changeStatusComment = async (idComment, changeStatus) => {
//     try {
//         const response = await axios.put(`${smartAPI}/forums/comments/change-published/${idComment}`, changeStatus);
//         return response;
//     } catch (error) {
//         if (error.response) {
//             return error.response.data || 'An error occurred';
//         } else {
//             return error.message || 'An unexpected error occurred';
//         }
//     }
// };


