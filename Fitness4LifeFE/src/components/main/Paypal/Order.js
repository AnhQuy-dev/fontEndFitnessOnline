import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { notification, Spin } from 'antd';

const OrderPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { package: selectedPackage } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [membershipData, setMembershipData] = useState(null);
 const navigate = useNavigate();

 console.log("membershipData",membershipData);
 
    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        const token = searchParams.get("token");
        const PayerID = searchParams.get("PayerID");

        const completePayment = async () => {
            try {
                const tokenData = localStorage.getItem("tokenData");
                if (!tokenData) {
                    throw new Error("Token not found");
                }
        
                const { access_token } = JSON.parse(tokenData);
                console.log("Access Token:", access_token);
        
                // 1. Gọi API hoàn tất thanh toán
                try {
                    console.log("Calling success API with params:", {
                        paymentId,
                        token,
                        PayerID: PayerID
                    });
        
                    const successResponse = await axios.post(
                        `http://localhost:8082/api/paypal/success?paymentId=${paymentId}&token=${token}&PayerID=${PayerID}`,
                        {},  // Empty object as body
                        {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        }
                    );
                    console.log("Success API Response:", successResponse.data);
        
                } catch (successError) {
                    console.error("Success API Error:", {
                        status: successError.response?.status,
                        data: successError.response?.data,
                        message: successError.message
                    });
                    throw successError;
                }
        
                // 2. Gọi API lấy thông tin membership
                try {
                    const membershipResponse = await axios.get(
                        `http://localhost:8082/api/paypal/getMembershipByPaymentId/${paymentId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        }
                    );
                    console.log("Membership API Response:", membershipResponse);
                    console.log("Membership API Response BODY:", membershipResponse.data.body.fullName);

        
                    if (membershipResponse.data.body) {
                        setMembershipData(membershipResponse.data.body);
                    console.log("Membership DATA BODY:", setMembershipData);

                        setMessage("Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
                        notification.success({
                            message: 'Thanh toán thành công',
                            description: 'Gói dịch vụ của bạn đã được kích hoạt',
                        });
                    }
                } catch (membershipError) {
                    console.error("Membership API Error:", {
                        status: membershipError.response?.status,
                        data: membershipError.response?.data,
                        message: membershipError.message
                    });
                    throw membershipError;
                }
        
            } catch (error) {
                console.error("General Error:", {
                    name: error.name,
                    message: error.message,
                    response: error.response?.data
                });
                
                setMessage("Có lỗi xảy ra trong quá trình hoàn tất thanh toán.");
                notification.error({
                    message: 'Lỗi thanh toán',
                    description: error.response?.data?.message || 'Không thể hoàn tất thanh toán. Vui lòng thử lại.',
                });
            } finally {
                setLoading(false);
            }
        };

        if (paymentId && token && PayerID) {
            completePayment();
        } else {
            setMessage("Thông tin thanh toán không hợp lệ.");
            setLoading(false);
        }
    }, [searchParams,navigate]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '20px' }}>Đang hoàn tất thanh toán, vui lòng đợi...</p>
            </div>
        );
    }

    return (
        <section id="services">
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Kết quả thanh toán</h1>
                <p style={{ textAlign: 'center', marginBottom: '20px' }}>{message}</p>

                {membershipData && (
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h2>Thông tin gói đã thanh toán:</h2>
                        <p><strong>Tên gói:</strong> {membershipData.packageName}</p>
                        <p><strong>Giá:</strong> {membershipData.totalAmount} VND</p>
                        <p><strong>Mô tả:</strong> {membershipData.description}</p>
                        <p><strong>Trạng thái:</strong> {membershipData.payStatusType}</p>
                        <p><strong>Ngày bắt đầu:</strong> {new Date(membershipData.startDate).toLocaleDateString('vi-VN')}</p>
                        <p><strong>Ngày kết thúc:</strong> {new Date(membershipData.endDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                )}
    
                {selectedPackage && !membershipData && (
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h2>Thông tin gói:</h2>
                        <p><strong>Tên gói:</strong> {selectedPackage.packageName}</p>
                        <p><strong>Giá:</strong> {selectedPackage.price.toLocaleString('vi-VN')} VND</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrderPage;