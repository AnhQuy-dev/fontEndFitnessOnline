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

    console.log("submitBookingRoom response:", { status, data });

    return { status, data };
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error.message);
    return { status: 500, data: `Lỗi: ${error.message}` };
  }
};