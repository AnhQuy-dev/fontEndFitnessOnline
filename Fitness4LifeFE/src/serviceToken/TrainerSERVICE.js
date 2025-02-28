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
  console.error("Lỗi khi lấy trainer:", error.message);
  return `Lỗi: ${error.message}`;
}
};


export const createTrainer = async (formDataTrainer, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: formDataTrainer
    });

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi create dữ liệu: ", error);

    if (error.response) {
      return error.response.data || 'An error occurred';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
};


export const updateTrainer = async (id, TrainerDataPayloadUpdate, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/update/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(TrainerDataPayloadUpdate)
    });
    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi update dữ liệu: ", error);

    if (error.response) {
      return error.response.data || 'An error occurred';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
};

export const deleteTrainer = async (id, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: "include",

    });

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi update dữ liệu: ", error);

    if (error.response) {
      return error.response.data || 'An error occurred';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
};