import React, { useState } from 'react';
import { Card, Button, notification, Row, Col, Typography, Divider, Space, message, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { SyncOutlined, ArrowLeftOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import stickman from '../../../assets/images/Stickman.gif';
import '../../../assets/css/Main/payMent.css';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';
import { ProceedToPayment } from '../../../serviceToken/PaymentService';
import { findCode } from '../../../serviceToken/PromotionService';

const { Title, Text } = Typography;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { package: selectedPackage } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState();

  const tokenData = getTokenData();
  const decodeToken = getDecodedToken();

  const userFullname = decodeToken.fullName;
  const userId = decodeToken.id;
  const userEmail = decodeToken.sub;
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
      if (!selectedPackage?.id || !userId) {
        console.error("Validation Error:", {
          selectedPackage: selectedPackage,
          user: decodeToken,
          message: "Package or user information is missing"
        });
        throw new Error("Package or user information is missing");
      }

      const payload = {
        packageId: selectedPackage.id,
        userId: userId,
        description: selectedPackage.description || "Package Subscription",
        cancelUrl: "http://localhost:5173/cancel",
        successUrl: "http://localhost:3000/order",
        currency: "USD",
        intent: "Sale",
        transactions: [
          {
            amount: {
              total: discountedPrice, // Format số tiền
              currency: "USD",
            },
            description: "Payment for Gym Membership",
          }
        ],
      };

      console.log("payload: ", payload);



      if (!tokenData) {
        notification.error({
          message: 'Authentication Error',
          description: 'Please log in again to continue.',
        });
        return;
      }

      const hide = message.loading('Processing payment...', 0);

      try {
        console.log("Payload", payload);

        const response = await ProceedToPayment(payload, tokenData.access_token);
        console.log("response", response);

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

  const applyDiscount = async () => {
    if (!couponCode) {
      message.error("Please enter a coupon code.");
      return;
    }

    try {
      const discount = await findCode(couponCode, userId, tokenData.access_token);
      console.log("Discount response: ", discount);

      if (!discount || !discount.data) {
        message.error("Invalid discount code.");
        setDiscountedPrice(null);
        return;
      }

      // Lấy giá trị discount chính xác
      const discountValue = parseFloat(discount.data.discountValue);
      if (isNaN(discountValue) || discountValue <= 0) {
        message.error("Invalid discount value from API.");
        setDiscountedPrice(null);
        return;
      }

      // Kiểm tra điều kiện giảm giá
      if (
        discount.data.minValue <= selectedPackage.price &&
        (discount.data.packageName === selectedPackage.packageName || discount.data.packageName === null)
      ) {
        let newPrice = selectedPackage.price - discountValue;

        if (newPrice < 0) newPrice = 0; // Đảm bảo giá không âm

        setDiscountedPrice(newPrice.toFixed(0)); // Cập nhật state
        console.log("New discounted price:", newPrice.toFixed(0));

        message.success(`Applied ${discountValue}% discount!`);
      } else {
        message.error("This discount code cannot be applied to the selected package.");
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      message.error("Failed to apply discount. Please try again.");
    }
  };


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
                <Title level={4}>FITNESS4LIFE</Title>
                <Text>123 Fitness Street, District 1, HCMC</Text>
                <Text>Tel: (028) 1234-5678</Text>
              </div>

              <Divider className="bill-divider-dashed" dashed />

              {/* Customer Info */}
              <div className="customer-info">
                <Title level={5}>CUSTOMER INFORMATION</Title>
                <div className="customer-details">
                  <Text><strong>Name:</strong> {userFullname || 'Guest User'}</Text>
                  <Text><strong>Email:</strong> {userEmail || 'N/A'}</Text>
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
                    <Text>{formattedPrice} USD</Text>
                  </div>
                </div>

                <div className="package-features">
                  <Text type="secondary">{selectedPackage.description}</Text>
                  <div className="feature-highlights">
                    {selectedPackage.packageName === 'CLASSIC' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Workout at the selected GT CLUB</div>
                        <div className="feature-item"><CheckCircleOutlined /> Participate in Yoga and Group X at one selected CLUB</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'CLASSIC-PLUS' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Workout at the selected GT CLUB</div>
                        <div className="feature-item"><CheckCircleOutlined /> Participate in all Yoga and Group X classes at all CLUBs</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'CITIFITSPORT' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Unlimited access to all GX classes in the system</div>
                        <div className="feature-item"><CheckCircleOutlined /> Premium sports towel service</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'ROYAL' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> Unlimited access to all GX classes in the system</div>
                        <div className="feature-item"><CheckCircleOutlined /> One-day advance reservation for a premium gym experience</div>
                      </>
                    )}
                    {selectedPackage.packageName === 'SIGNATURE' && (
                      <>
                        <div className="feature-item"><CheckCircleOutlined /> VIP check-in and exclusive reception</div>
                        <div className="feature-item"><CheckCircleOutlined /> Access to private VIP area</div>
                      </>
                    )}
                    <div className="feature-item"><CheckCircleOutlined /> Unlimited workout time</div>
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
                  <Text>{formattedPrice} USD</Text>
                </div>
                {/* Coupon Input */}
                <div className="total-row coupon-section" style={{ marginTop: 10 }}>
                  <Input
                    placeholder="Enter discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ width: 200, marginRight: 10 }}
                  />
                  <Button type="primary" onClick={applyDiscount}>Apply</Button>
                </div>

                <div className="total-row total-amount" style={{ marginTop: 10 }}>
                  <Text strong>SUBTOTAL:</Text>
                  <Text strong>{discountedPrice || formattedPrice} USD</Text>
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
                onClick={() => navigate('/PackageMain')}
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