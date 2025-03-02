import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Col, Row, Typography, Tabs, notification } from "antd";
import {
    GiftOutlined,
    ShoppingOutlined,
    CalendarOutlined,
    DollarOutlined,
    TrophyOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import PromotionDetailsModal from "../../admin/Promotion/PromotionDetailsModal";
import { getAllPromotionsInJson, getPromotionUser, usedPointChangCode } from "../../../serviceToken/PromotionService";
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { getUserPoint } from "../../../serviceToken/FitnessgoalService";
import "../../../assets/css/yourPromotion.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const YourPromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [promotionsJson, setPromotionsJson] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingJson, setLoadingJson] = useState(false);
    const [error, setError] = useState("");
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userPoints, setUserPoints] = useState(null);
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();

    useEffect(() => {
        fetchPromotions();
        fetchUserPoints();
        fetchPromotionsJson();
    }, []);

    const fetchPromotions = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getPromotionUser(decotoken.id, tokenData.access_token);
            const { data } = response;
            setPromotions(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Failed to fetch promotions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPromotionsJson = async () => {
        setLoadingJson(true);
        try {
            const response = await getAllPromotionsInJson(tokenData.access_token);
            if (response.status === 200) {
                setPromotionsJson(Array.isArray(response.data) ? response.data : []);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch JSON promotions.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setLoadingJson(false);
        }
    };

    const fetchUserPoints = async () => {
        try {
            const response = await getUserPoint(decotoken.id, tokenData.access_token);
            setUserPoints(response?.data ?? 0);
        } catch (err) {
            console.error("Error fetching user points:", err);
            setError("Failed to fetch user points. Please try again.");
        }
    };

    const handleRowClick = (promotion) => {
        setSelectedPromotion(promotion);
        setIsModalVisible(true);
    };

    const handleExchangeVoucher = async (promotion) => {
        if (!decotoken || !decotoken.id) {
            notification.error({
                message: "Error",
                description: "User information is missing.",
            });
            return;
        }

        if (userPoints?.totalPoints < promotion.points) {
            notification.error({
                message: "Insufficient Points",
                description: "You do not have enough points to exchange for this voucher.",
            });
            return;
        }
        try {
            const response = await usedPointChangCode(decotoken.id, promotion.points, promotion.id, tokenData.access_token);

            if (response.status === 200) {
                notification.success({
                    message: "Success",
                    description: `Voucher "${promotion.title}" has been successfully exchanged.`,
                });

                // Cập nhật lại điểm và danh sách khuyến mãi
                fetchPromotions();
                fetchUserPoints();
            } else {
                notification.error({
                    message: "Error",
                    description: response.message || "Failed to exchange voucher. Please try again.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message || "An unexpected error occurred while exchanging the voucher.",
            });
        }
    };

    useEffect(() => {
    }, [userPoints]);

    return (
        <section className="promotion-container">
            <div className="promotion-header">
                <Title level={1} className="promotion-title">
                    <GiftOutlined style={{ marginRight: 12 }} />
                    Promotion Center
                </Title>
                <Text style={{ color: 'white', fontSize: '16px' }}>
                    Discover and redeem exclusive vouchers with your points
                </Text>
            </div>

            {userPoints && (
                <div className="points-card">
                    <Text className="points-label">Your Available Points</Text>
                    <div className="points-value">
                        <TrophyOutlined style={{ marginRight: 8 }} />
                        {userPoints.totalPoints} Points
                    </div>
                </div>
            )}

            <Tabs defaultActiveKey="1" className="promotion-tabs">
                <TabPane
                    tab={<span><ShoppingOutlined />Your Vouchers</span>}
                    key="1"
                >
                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                            <Text>Loading your vouchers...</Text>
                        </div>
                    ) : promotions.length === 0 ? (
                        <div className="empty-state">
                            <img
                                src="https://cdn.tgdd.vn/News/1062931/bi-quyet-chup-anh-01-01-01-1280x720.jpg"
                                alt="No Vouchers"
                            />
                            <Title level={4}>No Vouchers Yet</Title>
                            <Text className="empty-state-text">
                                Check out available vouchers in the Voucher tab and start redeeming!
                            </Text>
                        </div>
                    ) : (
                        <Row gutter={[16, 16]} className="voucher-grid">
                            {promotions.map((promotion) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={promotion.id}>
                                    <Card
                                        className="voucher-card"
                                        hoverable
                                        cover={
                                            <img
                                                alt="promotion"
                                                src="https://cdn.tgdd.vn/News/1062931/bi-quyet-chup-anh-01-01-01-1280x720.jpg"
                                            />
                                        }
                                    >
                                        <Card.Meta
                                            title={promotion.title}
                                            description={
                                                <div className="voucher-details">
                                                    <span className={`voucher-tag ${promotion.isUsed ? 'tag-used' : 'tag-available'}`}>
                                                        {promotion.isUsed ? 'Used' : 'Available'}
                                                    </span>

                                                    <div className="voucher-info">
                                                        <DollarOutlined />
                                                        <Text>Discount: {promotion.discountValue}%</Text>
                                                    </div>

                                                    <div className="voucher-info">
                                                        <CalendarOutlined />
                                                        <Text>Valid: {promotion.startDate} - {promotion.endDate}</Text>
                                                    </div>

                                                    <div className="voucher-actions">
                                                        <Button
                                                            type="primary"
                                                            icon={<InfoCircleOutlined />}
                                                            onClick={() => handleRowClick(promotion)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </TabPane>

                <TabPane
                    tab={<span><GiftOutlined />Available Vouchers</span>}
                    key="2"
                >
                    {loadingJson ? (
                        <div className="loading-container">
                            <Spin size="large" />
                            <Text>Loading available vouchers...</Text>
                        </div>
                    ) : (
                        <Row gutter={[16, 16]} className="voucher-grid">
                            {promotionsJson.map((promotion) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={promotion.id}>
                                    <Card
                                        className="voucher-card"
                                        hoverable
                                        cover={
                                            <img
                                                alt="promotion"
                                                src="https://cdn.tgdd.vn/News/1062931/bi-quyet-chup-anh-01-01-01-1280x720.jpg"
                                            />
                                        }
                                    >
                                        <Card.Meta
                                            title={promotion.title}
                                            description={
                                                <div className="voucher-details">
                                                    <span className={`voucher-tag ${promotion.isActive ? 'tag-active' : 'tag-inactive'}`}>
                                                        {promotion.isActive ? 'Active' : 'Inactive'}
                                                    </span>

                                                    <div className="voucher-info">
                                                        <DollarOutlined />
                                                        <Text>Discount: {promotion.discountValue}%</Text>
                                                    </div>

                                                    <div className="voucher-info">
                                                        <ShoppingOutlined />
                                                        <Text>Min Value: ${promotion.minValue}</Text>
                                                    </div>

                                                    <div className="voucher-info">
                                                        <TrophyOutlined />
                                                        <Text>Points Required: {promotion.points}</Text>
                                                    </div>

                                                    <div className="voucher-actions">
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleRowClick(promotion)}
                                                            icon={<InfoCircleOutlined />}
                                                        >
                                                            Details
                                                        </Button>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleExchangeVoucher(promotion)}
                                                            icon={<GiftOutlined />}
                                                        >
                                                            Redeem
                                                        </Button>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </TabPane>
            </Tabs>

            <PromotionDetailsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                promotion={selectedPromotion}
            />
        </section>
    );
};

export default YourPromotionPage;
