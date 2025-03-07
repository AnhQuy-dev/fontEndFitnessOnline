import { APIGetWay } from "../components/helpers/constants";


export const fetchPaymentStatistics = async (token) => {
  try {
    const response = await fetch(`${APIGetWay}/paypal/payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });

    const status = response.status;
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
  }
};

export const GetAllBookings = async (token) => {
  try {
    const response = await fetch(`${APIGetWay}/booking/bookingRooms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });

    const status = response.status;
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
  }
};


export const getRoomById = async (roomId, token) => {
  try {
    const response = await fetch(`${APIGetWay}/dashboard/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })
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
    console.error("Lỗi khi tìm kiếm room:", error.message);
    return `Lỗi: ${error.message}`;
  }
};
