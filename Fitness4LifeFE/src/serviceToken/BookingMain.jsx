
// Lỗi khi không lấy được status , vì dữu liệu trả về response.status không thể . tới được 
// nên sử lại thành thằng bên dưới khi submit dữ liệu trar về cả cục dât và status lun 

import { APIGetWay } from "../components/helpers/constants";


export const submitBookingRoom = async (bookingData, token) => {
  try {
    const response = await fetch(`${APIGetWay}/booking/bookingRoom/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(bookingData)
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

export const getRoomOfPackageId = async (packageId, token) => {
  try {

    const response = await fetch(`${APIGetWay}/dashboard/packages/${packageId}/rooms`, {
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
    console.error("Lỗi khi gửi mã khuyến mãi:", error.message);
    return `Lỗi: ${error.message}`;
  }
};

export const getUserProfile = async (id,token) => {
  try {
    const response = await fetch(`${APIGetWay}/users/manager/users/profile/${id}`, {
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
    console.error("Lỗi khi gửi mã khuyến mãi:", error.message);
    return `Lỗi: ${error.message}`;
  }
};

export const fetchAllBookingHistoryByUserId = async (userId, token) => {
  try {
      const response = await fetch(`${APIGetWay}/booking/bookingRooms/history/${userId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          credentials: "include",
      });

      if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // 🔍 In ra để kiểm tra dữ liệu API

      // Kiểm tra nếu API trả về object thay vì array
      if (!Array.isArray(data)) {
          console.warn("Expected an array but received an object. Trying to extract data...");

          // Nếu API trả về object chứa key "data" là array thì lấy ra
          if (data && Array.isArray(data.data)) {
              return data.data;
          }

          throw new Error(`Invalid data format: Expected an array but received ${typeof data}`);
      }

      return data;
  } catch (error) {
      console.error("Error fetching booking data:", error);
      throw error;
  }
};



export const getQrCode = async (bookingId, token) => {
  try {
      const response = await fetch(`${APIGetWay}/booking/qrCode/${bookingId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          credentials: "include",
      });

      if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json(); // ⬅️ Chuyển đổi JSON
      return data.data; // ⬅️ Trả về phần chứa thông tin QR Code
  } catch (error) {
      console.error('Error fetching QR code:', error);
      throw error;
  }
};