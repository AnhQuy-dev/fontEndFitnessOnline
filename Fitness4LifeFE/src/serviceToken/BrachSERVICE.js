import { APIGetWay } from "../components/helpers/constants";

export const fetchAllBranch = async (token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/branchs`, {
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
    console.error("Lỗi khi lấy branch:", error.message);
    return `Lỗi: ${error.message}`;
  }
};


export const createBranch = async (branchDataPayload, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/branch/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(branchDataPayload)
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

export const updateBranch = async (id, branchDataPayloadUpdate, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/branch/update/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(branchDataPayloadUpdate)
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


export const deleteBranch = async (id, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/branch/delete/${id}`, {
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
