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


export const createTrainer = async (formDataTrainer, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/trainer/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: formDataTrainer
    });

    const status = response.status;
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
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

    const status = response.status;
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
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

    const status = response.status;
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
  }
};