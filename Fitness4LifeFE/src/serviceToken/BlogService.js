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
    return response.data.data;
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
export const createBlog = async (formData) => {
  try {
    // Log the request to debug
    console.log('Sending blog creation request with FormData');
    // Log FormData contents (for debugging only)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
    }

    // Make sure to set the right headers for multipart/form-data
    const response = await axios.post(
      'http://localhost:9001/api/deal/blogs/create',
      formData,

    );

    return response.data;
  } catch (error) {
    console.error('Error in createBlog service:', error);
    // Return error information
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Unknown error'
    };
  }
}
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

    const response = await axios.delete(`${API_URL}/deal/blogs/deleteBlog/${blogId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog with ID ${blogId}:`, error);
    throw error;
  }
};
// Hàm thay đổi trạng thái xuất bản của blog
export const changePublishedStatus = async (blogId, isPublished) => {
  try {
    const tokenData = getTokenData();
    const config = {
      headers: {
        Authorization: tokenData ? `Bearer ${tokenData.access_token}` : '',
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.put(
      `${API_URL}/deal/blogs/changePublished/${blogId}`, 
      { isPublished }, 
      config
    );

    return response.data;
  } catch (error) {
    console.error(`Error changing published status for blog with ID ${blogId}:`, error);
    // Return error information
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Unknown error'
    };
  }
};
