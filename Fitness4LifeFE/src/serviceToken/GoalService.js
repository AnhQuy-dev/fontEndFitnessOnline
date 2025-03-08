import axios from 'axios';
import { getTokenData } from './tokenUtils';

const API_URL = 'http://localhost:9001/api';

// Hàm lấy tất cả goals
export const fetchAllGoals = async () => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : ''
      }
    };

    const response = await axios.get(`${API_URL}/goal/all`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

// Hàm lấy goal theo ID
export const fetchGoalById = async (id) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : ''
      }
    };

    const response = await axios.get(`${API_URL}/goal/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching goal by ID:', error);
    throw error;
  }
};

// Hàm xóa goal
// Hàm xóa goal
export const deleteGoal = async (goalId) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : ''
      }
    };

    const response = await axios.delete(`${API_URL}/goal/delete/${goalId}`, config);

    // Return a standardized response for success
    return {
      status: 200,
      message: "Goal deleted successfully"
    };
  } catch (error) {
    console.error(`Error deleting goal with ID ${goalId}:`, error);
    // Return a standardized error response
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Error deleting goal"
    };
  }
};

// Hàm thay đổi trạng thái của goal
export const updateGoalStatus = async (goalId, goalStatus) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : '',
        'Content-Type': 'application/json'
      }
    };

    // Create the DTO object exactly as expected by the backend
    const statusDTO = {
      goalStatus: goalStatus
    };

    const response = await axios.put(
      `${API_URL}/goal/changeStatus/${goalId}`,
      statusDTO,
      config
    );

    // Return the updated goal from the response or a standardized success
    return {
      status: 200,
      data: response.data,
      message: "Goal status updated successfully"
    };
  } catch (error) {
    console.error(`Error changing status for goal with ID ${goalId}:`, error);
    // Return a standardized error response
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Error updating goal status"
    };
  }
};