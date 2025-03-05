import { APIGetWay } from "../components/helpers/constants";

export const fetchAllTrainer = async (token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainers`, {
      method: 'GET',
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
    console.error("Lỗi khi fetch dữ liệu:", error.message);
    return `Lỗi: ${error.message}`;
  }
};


export const createTrainer = async (formDataTrainer, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: "include",
      body: formDataTrainer
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
    console.error("Lỗi khi tạo trainer:", error.message);
    return `Lỗi: ${error.message}`;
  }
};



export const updateTrainer = async (id, TrainerDataPayloadUpdate, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/update/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: "include",
      body: TrainerDataPayloadUpdate
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
    console.error("Lỗi khi cập nhật trainer:", error.message);
    return `Lỗi: ${error.message}`;
  }
};

export const deleteTrainer = async (id, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify()
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
    console.error("Lỗi khi xóa trainer:", error.message);
    return `Lỗi: ${error.message}`;
  }
};