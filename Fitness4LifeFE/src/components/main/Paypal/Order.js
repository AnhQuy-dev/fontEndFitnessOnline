import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { notification, Spin } from 'antd';
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { getMembershipByPaymentId, PaymentSuccessFully } from "../../../serviceToken/PaymentService";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const OrderPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { package: selectedPackage } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [membershipData, setMembershipData] = useState(null);
    const navigate = useNavigate();
    const tokenData = getTokenData();

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        const token = searchParams.get("token");
        const PayerID = searchParams.get("PayerID");

        const completePayment = async () => {
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
                    setMessage("Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
                    notification.success({
                        message: 'Thanh toán thành công',
                        description: 'Gói dịch vụ của bạn đã được kích hoạt',
                    });
                }
            }
            catch (error) {
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
    }, [searchParams, navigate]);

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
                }}>Đang xử lý thanh toán, vui lòng đợi trong giây lát...</p>
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
                        {membershipData ? 'THANH TOÁN THÀNH CÔNG' : 'THANH TOÁN THẤT BẠI'}
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
                        <strong>Mã giao dịch:</strong> {searchParams.get("paymentId") || 'N/A'}
                    </div>
                    <div>
                        <strong>Ngày:</strong> {new Date().toLocaleDateString('vi-VN')}
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
                                CHI TIẾT GÓI DỊCH VỤ
                            </h2>
                            
                            {/* Bảng thông tin chi tiết */}
                            <div style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                marginBottom: '30px' 
                            }}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Tên gói:</div>
                                    <div style={{ flex: '2', fontWeight: 'bold' }}>{membershipData.packageName}</div>
                                </div>
                                
                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Mô tả:</div>
                                    <div style={{ flex: '2' }}>{membershipData.description}</div>
                                </div>
                                
                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Thời hạn:</div>
                                    <div style={{ flex: '2' }}>
                                        {formatDate(membershipData.startDate)} - {formatDate(membershipData.endDate)}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                    <div style={{ flex: '1', fontWeight: 'bold', color: '#666' }}>Trạng thái:</div>
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
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Tổng thanh toán:</div>
                                <div style={{ 
                                    fontSize: '24px', 
                                    fontWeight: 'bold', 
                                    color: '#1890ff' 
                                }}>
                                    {formatCurrency(membershipData.totalAmount)}
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
                    <p style={{ margin: '0 0 5px 0' }}>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                    <p style={{ margin: '0' }}>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ hỗ trợ khách hàng.</p>
                </div>
            </div>
        </section>
    );
};

export default OrderPage;