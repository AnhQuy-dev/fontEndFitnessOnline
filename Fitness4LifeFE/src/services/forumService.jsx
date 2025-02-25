import axios from "axios"
import { smartAPI } from "../components/helpers/constants";




export const voteQuestion = async (id, voteType, userId) => {
    try {
        const response = await axios.post(`${smartAPI}/forums/${id}/vote?userId=${userId}&voteType=${voteType}`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};


export const updateQuestion = async (id, updateData) => {
    try {
        const response = await axios.put(`${smartAPI}/forums/questions/update/${id}`, updateData);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

export const deleteQuestion = async (id) => {
    try {
        const response = await axios.delete(`${smartAPI}/forums/questions/delete/${id}`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

export const changePublished = async (id, changeStatus) => {
    try {
        const response = await axios.put(`${smartAPI}/forums/Questions/changePublished/${id}`, changeStatus);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

//============================comment=======================

export const createComment = async (data) => {
    try {
        const response = await axios.post(`${smartAPI}/forums/comments/create`, data);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};


export const updateComment = async (idComment, updateComment) => {
    try {
        const response = await axios.put(`${smartAPI}/forums/comments/update/${idComment}`, updateComment);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

export const deleteComment = async (idComment) => {
    try {
        const response = await axios.delete(`${smartAPI}/forums/comments/delete/${idComment}`);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};

export const changeStatusComment = async (idComment, changeStatus) => {
    try {
        const response = await axios.put(`${smartAPI}/forums/comments/change-published/${idComment}`, changeStatus);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response.data || 'An error occurred';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
};
