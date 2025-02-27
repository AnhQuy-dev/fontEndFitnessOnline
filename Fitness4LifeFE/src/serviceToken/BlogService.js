import axios from 'axios';
import { getTokenData } from './tokenUtils';

const API_URL = 'http://localhost:9001/api';

// Hàm lấy tất cả blogs
export const fetchAllBlogs = async () => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : ''
      }
    };
    
    const response = await axios.get(`${API_URL}/deal/blogs`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Hàm lấy blog theo ID
export const fetchBlogById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/deal/blogs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  };
  

// Hàm tạo blog mới
export const createBlog = async (blogData) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : '',
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios.post(`${API_URL}/blogs`, blogData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Hàm cập nhật blog
export const updateBlog = async (blogId, blogData) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : '',
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios.put(`${API_URL}/blogs/${blogId}`, blogData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with ID ${blogId}:`, error);
    throw error;
  }
};

// Hàm xóa blog
export const deleteBlog = async (blogId) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : ''
      }
    };
    
    const response = await axios.delete(`${API_URL}/blogs/${blogId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog with ID ${blogId}:`, error);
    throw error;
  }
};
