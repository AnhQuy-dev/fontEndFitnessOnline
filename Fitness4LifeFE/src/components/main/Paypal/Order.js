import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { notification, Spin } from 'antd';
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { getMembershipByPaymentId, PaymentSuccessFully } from "../../../serviceToken/PaymentService";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { UsedPromotionCode } from "../../../serviceToken/PromotionService";

const OrderPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { package: selectedPackage } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [membershipData, setMembershipData] = useState(null);
    const navigate = useNavigate();
    const tokenData = getTokenData();
    const params = new URLSearchParams(location.search);
    const discountedCode = decodeURIComponent(params.get("code") || "no-code");
    const decodeToken = getDecodedToken();

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        const token = searchParams.get("token");
        const PayerID = searchParams.get("PayerID");

        const completePayment = async () => {
            if (discountedCode != null && discountedCode !== "no-code") {
                console.log("✅ Payment SuccessFully, gọi usedCodeOfPromotion...");
                // console.log("discountedCode: ", discountedCode);
                usedCodeOfPromotion(); // Gọi API sử dụng mã giảm giá
            }
            try {
                const successResponse = await PaymentSuccessFully(paymentId, token, PayerID, tokenData.access_token);
                console.log("successResponse", successResponse);

            } catch (successError) {
                console.error("Success API Error:", {
                    status: successError.response?.status,
                    data: successError.response?.data,
                    message: successError.message
                });
                throw successError;
            }

            try {
                const membershipResponse = await getMembershipByPaymentId(paymentId, tokenData.access_token);
                setMembershipData(membershipResponse.body);

                if (membershipResponse.statusCodeValue == 200) {
                    setMessage("Payment Successfully! Thank you for using our service.");
                    notification.success({
                        message: 'Payment Successfully',
                        description: 'Your service package has been activated.',
                    });
                }
            }
            catch (error) {
                console.error("General Error:", {
                    name: error.name,
                    message: error.message,
                    response: error.response?.data
                });

                setMessage("An error occurred while completing the payment.");
                notification.error({
                    message: 'Payment error',
                    description: error.response?.data?.message || 'Payment could not be completed. Please try again.',
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
    }, [searchParams, navigate]);

    const usedCodeOfPromotion = async () => {
        try {
            const response = await UsedPromotionCode(discountedCode, decodeToken.id, tokenData.access_token);

            if (response.status === 200 || response.status === 201) {
                console.log("used code successfully");
            } else if (response.status === 400) {
                notification.error({
                    message: 'Error',
                    description: 'User Not Found Exception',
                });
            }
            else if (response.status === 401) {
                notification.error({
                    message: 'Error',
                    description: 'Code Is Already In Active',
                });
            }
            else if (response.status === 402) {
                notification.error({
                    message: 'Error',
                    description: 'Promotion Code Not Found',
                });
            }
            else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to use code',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f7f9fc'
            }}>
                <Spin size="large" />
                <p style={{
                    marginTop: '20px',
                    fontSize: '16px',
                    color: '#1890ff'
                }}>Processing payment, please wait a moment...</p>
            </div>
        );
    }

    return (
        <section id="services" style={{
            backgroundColor: '#f7f9fc',
            minHeight: '100vh',
            padding: '40px 0',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                {/* Header của bill */}
                <div style={{
                    backgroundColor: membershipData ? '#52c41a' : '#f5222d',
                    padding: '25px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    {membershipData ? (
                        <CheckCircleOutlined style={{ fontSize: '48px', marginBottom: '10px' }} />
                    ) : (
                        <CloseCircleOutlined style={{ fontSize: '48px', marginBottom: '10px' }} />
                    )}
                    <h1 style={{
                        margin: '0',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        {membershipData ? 'PAYMENT SUCCESSFUL' : 'PAYMENT FAILED'}
                    </h1>
                </div>

                {/* Số hóa đơn và ngày */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '15px 30px',
                    borderBottom: '1px dashed #eaeaea',
                    backgroundColor: '#fafafa',
                    fontSize: '14px'
                }}>
                    <div>
                        <strong>Transaction code :</strong> {searchParams.get("paymentId") || 'N/A'}
                    </div>
                    <div>
                        <strong>Date:</strong> {new Date().toLocaleDateString('vi-VN')}
                    </div>
                </div>

                {/* Nội dung chính */}
                <div style={{ padding: '30px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <p style={{
                            fontSize: '16px',
                            color: membershipData ? '#52c41a' : '#f5222d',
                            fontWeight: 'bold'
                        }}>
                            {message}
                        </p>
                    </div>

                    {membershipData && (
                        <>
                            <h2 style={{
                                fontSize: '18px',
                                marginBottom: '20px',
                                borderBottom: '2px solid #f0f0f0',
                                paddingBottom: '10px',
                                color: '#333'
                            }}>
                                SERVICE PACKAGE DETAILS
                            </h2>

                            {/* Bảng thông tin chi tiết */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                marginBottom: '30px'
                            }}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Package Name:</div>
                                    <div style={{ flex: '2', fontWeight: 'bold' }}>{membershipData.packageName}</div>
                                </div>

                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Descriptrion:</div>
                                    <div style={{ flex: '2' }}>{membershipData.description}</div>
                                </div>

                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Duration:</div>
                                    <div style={{ flex: '2' }}>
                                        {formatDate(membershipData.startDate)} - {formatDate(membershipData.endDate)}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Status:</div>
                                    <div style={{
                                        flex: '2',
                                        color: membershipData.payStatusType === 'SUCCESS' ? '#52c41a' : '#faad14',
                                        fontWeight: 'bold'
                                    }}>
                                        {membershipData.payStatusType === 'SUCCESS' ? 'ĐÃ THANH TOÁN' : membershipData.payStatusType}
                                    </div>
                                </div>
                            </div>

                            {/* Phần tổng tiền */}
                            <div style={{
                                backgroundColor: '#f6f6f6',
                                padding: '20px',
                                borderRadius: '8px',
                                marginTop: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</div>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#1890ff'
                                }}>
                                    {(membershipData.totalAmount)} USD
                                </div>
                            </div>
                        </>
                    )}

                    {selectedPackage && !membershipData && (
                        <div style={{
                            backgroundColor: '#fff1f0',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #ffa39e'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                marginBottom: '15px',
                                color: '#cf1322'
                            }}>
                                Thông tin gói chưa được thanh toán:
                            </h2>
                            <p style={{ marginBottom: '10px' }}><strong>Tên gói:</strong> {selectedPackage.packageName}</p>
                            <p><strong>Giá:</strong> {formatCurrency(selectedPackage.price)}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '1px solid #eaeaea',
                    padding: '20px 30px',
                    backgroundColor: '#fafafa',
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '0 0 5px 0' }}>Thank you for using our service!</p>
                    <p style={{ margin: '0' }}>If you have any questions, please contact customer support.</p>
                </div>
            </div>
        </section>
    );
};

export default OrderPage;