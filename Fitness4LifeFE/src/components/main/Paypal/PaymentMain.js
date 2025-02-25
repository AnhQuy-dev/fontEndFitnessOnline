import React, { useContext, useState } from 'react';
import { Card, Button, notification, Row, Col, Typography, Divider, Space, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../helpers/DataContext';
import axios from 'axios';
import { SyncOutlined, ArrowLeftOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import stickman from '../../../assets/images/Stickman.gif';
import { jwtDecode } from 'jwt-decode';
import '../../../assets/css/Main/payMent.css';

const { Title, Text } = Typography;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { package: selectedPackage } = location.state || {};
  const { user } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedPackage) {
    return (
      <div className="empty-package-container">
        <Text className="empty-package-text">No package selected. Please go back and choose a package.</Text>
        <Button
          type="primary"
          onClick={() => navigate('/packages')}
          icon={<ArrowLeftOutlined />}
          className="back-button"
        >
          Go to Packages
        </Button>
      </div>
    );
  }

  const handleSubmitPayment = async () => {
    setIsLoading(true);
    try {
      // Validate required data
      if (!selectedPackage?.id || !user?.id) {
        console.error("Validation Error:", {
          selectedPackage: selectedPackage,
          user: user,
          message: "Package or user information is missing"
        });
        throw new Error("Package or user information is missing");
      }

      const payload = {
        packageId: selectedPackage.id,
        userId: user.id,
        description: selectedPackage.description || "Package Subscription",
        cancelUrl: "http://localhost:5173/cancel",
        successUrl: "http://localhost:3000/order",
        currency: "USD",
        intent: "Sale",
      };

      // Get and validate token
      const tokenData = localStorage.getItem("tokenData");
      if (!tokenData) {
        notification.error({
          message: 'Authentication Error',
          description: 'Please log in again to continue.',
        });
        return;
      }

      let parsedTokenData;
      try {
        parsedTokenData = JSON.parse(tokenData);
      } catch (error) {
        notification.error({
          message: 'Session Error',
          description: 'Your session is invalid. Please log in again.',
        });
        return;
      }

      const { access_token } = parsedTokenData;

      if (!access_token) {
        notification.error({
          message: 'Authentication Error',
          description: 'Invalid session. Please log in again.',
        });
        return;
      }

      // Use message.loading instead of notification.loading
      const hide = message.loading('Processing payment...', 0);

      try {
        const response = await axios.post(
          'http://localhost:8082/api/paypal/pay',
          payload,
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            },
            timeout: 10000,
          }
        );

        // Hide loading message
        hide();

        const approvalUrl = response.data?.approvalUrl;
        if (!approvalUrl) {
          throw new Error("No approval URL received from PayPal service");
        }

        notification.success({
          message: 'Payment Initiated',
          description: 'Redirecting to PayPal Sandbox...',
          duration: 2,
        });

        setTimeout(() => {
          window.location.href = approvalUrl;
        }, 1000);

      } catch (error) {
        // Hide loading message in case of error
        hide();

        if (error.response) {
          notification.error({
            message: 'Payment Error',
            description: error.response.data?.message || 'Server error occurred during payment processing.',
          });
        } else if (error.request) {
          notification.error({
            message: 'Connection Error',
            description: 'Unable to connect to payment service. Please check your internet connection.',
          });
        } else {
          notification.error({
            message: 'Payment Error',
            description: error.message || 'An unexpected error occurred during payment.',
          });
        }
      }

    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format the price
  const formattedPrice = selectedPackage.price?.toLocaleString('vi-VN') || '0';

  return (
    <section id="services">
      <div className="payment-container">
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={14} xl={12}>
            <Card className="bill-card">
              {/* Header Section */}
              <div className="bill-header">
                <Title level={2}>PAYMENT RECEIPT</Title>
                <div className="receipt-number">
                  <Text>Receipt #: {Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</Text>
                  <Text>Date: {new Date().toLocaleDateString()}</Text>
                </div>
              </div>

              <Divider className="bill-divider" />

              {/* Gym Info */}
              <div className="gym-info">
                <Title level={4}>GT CLUB FITNESS</Title>
                <Text>123 Fitness Street, District 1, HCMC</Text>
                <Text>Tel: (028) 1234-5678</Text>
              </div>

              <Divider className="bill-divider-dashed" dashed />

              {/* Customer Info */}
              <div className="customer-info">
                <Title level={5}>CUSTOMER INFORMATION</Title>
                <div className="customer-details">
                  <Text><strong>Name:</strong> {user?.fullName || 'Guest User'}</Text>
                  <Text><strong>Member ID:</strong> {user?.id || 'N/A'}</Text>
                  <Text><strong>Email:</strong> {user?.email || 'N/A'}</Text>
                </div>
              </div>

              <Divider className="bill-divider-dashed" dashed />

              {/* Package Details */}
              <div className="package-details">
                <Title level={5}>PACKAGE DETAILS</Title>

                <div className="item-row">
                  <div className="item-name">
                    <Text strong>{selectedPackage.packageName} Membership</Text>
                  </div>
                  <div className="item-price">
                    <Text>{formattedPrice} VND/month</Text>
                  </div>
                </div>

                <div className="package-features">
                  <Text type="secondary">{selectedPackage.description}</Text>
                  <div className="feature-highlights">
                    {selectedPackage.packageName === 'CLASSIC' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Tập luyện tại GT CLUB đã chọn</div>
                        <div className="feature-item"><CheckCircleOutlined /> Tham gia Yoga và Group X tại 01 CLUB đã chọn</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'CLASSIC-PLUS' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Tập luyện tại GT CLUB đã chọn</div>
                        <div className="feature-item"><CheckCircleOutlined /> Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'CITIFITSPORT' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Tự do thay luyện tập tất cả các lớp GX trong hệ thống</div>
                        <div className="feature-item"><CheckCircleOutlined /> Dịch vụ khăn tắm thể thao cao cấp</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'ROYAL' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Tự do thay luyện tập tất cả các lớp GX trong hệ thống</div>
                        <div className="feature-item"><CheckCircleOutlined /> Được đặt trước 1 ngày trải nghiệm phòng tập công</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'SIGNATURE' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> VIP check-in và tiếp đón riêng</div>
                        <div className="feature-item"><CheckCircleOutlined /> Sử dụng khu vực VIP riêng</div>
                      </>
                    )}
                    <div className="feature-item"><CheckCircleOutlined /> Không giới hạn thời gian luyện tập</div>
                  </div>
                </div>
              </div>

              <Divider className="bill-divider" />

              {/* Total */}
              <div className="total-section">
                <div className="total-row">
                  <Text strong>Package Type:</Text>
                  <Text>{selectedPackage.packageName}</Text>
                </div>
                <div className="total-row">
                  <Text strong>Price:</Text>
                  <Text>{formattedPrice} VND/month</Text>
                </div>
                <div className="total-row total-amount">
                  <Text strong>SUBTOTAL:</Text>
                  <Text strong>{formattedPrice} VND</Text>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <Text type="secondary">Payment Methods Accepted:</Text>
                <div className="payment-icons">
                  <CreditCardOutlined className="payment-icon" />
                  <span className="payment-text">Credit/Debit Cards</span>
                </div>
              </div>

              <Divider className="bill-divider-dashed" dashed />

              {/* Terms */}
              <div className="terms-section">
                <Text type="secondary">
                  * This is a pre-payment receipt. Final invoice will be provided after payment completion.
                  <br />* Membership activation begins on the date of successful payment processing.
                </Text>
              </div>

              {/* Payment Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmitPayment}
                className="pay-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Space>
                    <SyncOutlined spin />
                    <img src={stickman} width={38} height={30} alt="Loading" />
                    <span>Processing...</span>
                  </Space>
                ) : (
                  <Space>
                    <span>Proceed to Payment</span>
                  </Space>
                )}
              </Button>

              <Button
                type="default"
                size="middle"
                onClick={() => navigate('/packages')}
                className="back-to-packages-button"
              >
                <ArrowLeftOutlined /> Back to Packages
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default PaymentPage;