import { APIGetWay } from "../components/helpers/constants";

export const ProceedToPayment = async (payload, token) => {
  try {
    const response = await fetch(`${APIGetWay}/paypal/pay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(payload)
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

export const PaymentSuccessFully = async (paymentId, token, PayerID, tokenUrl) => {
  try {
    const response = await fetch(`${APIGetWay}/paypal/success?paymentId=${paymentId}&token=${token}&PayerID=${PayerID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenUrl}`,
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

    console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
  }
};

export const getMembershipByPaymentId = async (paymentId, token) => {
  try {
    const response = await fetch(`${APIGetWay}/paypal/getMembershipByPaymentId/${paymentId}`, {
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
    console.error("Lỗi khi lấy post:", error.message);
    return `Lỗi: ${error.message}`;
  }
};

// export const getMembershipByPamentId = async (paymentId) => {
//     const URL_BACKEND = `${BASE_URL}/paypal/getMembershipByPamentId/${paymentId}`;
//     try {
//         const response = await fetch(URL_BACKEND, createAuthConfig());
//         if (response.status === 200 && response.data) {
//             return response.data;
//         } else {
//             throw new Error('Failed to fetch rooms for the package.');
//         }
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Error fetching rooms.');
//     }
// };