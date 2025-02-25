import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            const paymentId = searchParams.get("paymentId");
            const token = searchParams.get("token");
            const payerId = searchParams.get("PayerID");

            if (paymentId && token && payerId) {
                try {
                    // Gọi API xử lý thanh toán thành công
                    const response = await axios.post(
                        `http://localhost:8082/api/paypal/success?paymentId=${paymentId}&token=${token}&PayerID=${payerId}`
                    );

                    if (response.status === 200) {
                        setMessage("Thanh toán thành công! Cảm ơn bạn.");
                    } else {
                        setMessage("Thanh toán thành công nhưng có một số vấn đề.");
                    }
                } catch (error) {
                    console.error("Lỗi xử lý thanh toán:", error);
                    setMessage(
                        error.response?.data?.message || "Thanh toán thất bại."
                    );
                }
            } else {
                setMessage("Thông tin thanh toán không hợp lệ.");
            }
            setLoading(false);
        };

        handlePaymentSuccess();
    }, [searchParams]);

    if (loading) {
        return <p>Đang xử lý thanh toán, vui lòng đợi...</p>;
    }

    return (
        <section id="services">
            <div>
                <h1>Kết quả thanh toán</h1>
                <p>{message}</p>
            </div>
        </section>
    );
};

export default PaymentSuccess;