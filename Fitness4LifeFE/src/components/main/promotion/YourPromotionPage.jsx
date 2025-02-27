import React, { useContext, useEffect, useState } from "react";
import { Card, Tag, Spin, Alert, Button, Col, Row, Typography, Tabs, notification } from "antd";
import PromotionDetailsModal from "../../admin/Promotion/PromotionDetailsModal";
import { getAllPromotionsInJson, getPromotionUser, usedPointChangCode } from "../../../serviceToken/PromotionService";
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { getUserPoint } from "../../../serviceToken/FitnessgoalService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const YourPromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [promotionsJson, setPromotionsJson] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingJson, setLoadingJson] = useState(false);
    const [error, setError] = useState("");
    const [selectedPromotion, setSelectedPromotion] = useState(null); // Chọn mã giảm giá hiện tại
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
    const [userPoints, setUserPoints] = useState(null); // Lưu trữ điểm người dùng
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
        <section id="services">
            <div style={{ padding: "20px" }}>
                <Title level={1}>Your Promotions</Title>
                <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                    {/* Hiển thị thông tin điểm người dùng và nút Voucher */}
                    <Col span={12}>
                        {userPoints && (
                            <div>
                                <Text strong>Total Points: </Text>
                                <Text>{userPoints.totalPoints}</Text>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Tabs cho nội dung */}
                <Tabs defaultActiveKey="1" style={{ marginBottom: "20px" }}>
                    {/* Tab YourVoucher */}
                    <TabPane tab="YourVoucher" key="1">
                        {/* Hiển thị thông tin về khuyến mãi */}
                        {loading ? (
                            <Spin tip="Loading...">
                                <Alert message="Fetching your promotions" type="info" />
                            </Spin>
                        ) : promotions.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <img
                                    src="https://cdn.tgdd.vn/News/1062931/bi-quyet-chup-anh-01-01-01-1280x720.jpg"
                                    alt="No Vouchers"
                                    style={{ maxWidth: "100%", borderRadius: "10px" }}
                                />
                                <p>Bạn chưa có mã giảm giá nào.</p>
                            </div>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {promotions.map((promotion) => (
                                    <Col span={6} key={promotion.id}>
                                        <Card
                                            hoverable
                                            cover={<img alt="promotion" src="https://cdn.tgdd.vn/News/1062931/bi-quyet-chup-anh-01-01-01-1280x720.jpg" />}
                                            actions={[
                                                <Button key="viewDetails" type="link" onClick={() => handleRowClick(promotion)}>
                                                    điều kiện
                                                </Button>,
                                            ]}
                                        >
                                            <Card.Meta
                                                title={promotion.title}
                                                description={
                                                    <div>
                                                        <Tag color={promotion.isUsed ? "red" : "green"}>
                                                            {promotion.isUsed ? "Used" : "Available"}
                                                        </Tag>
                                                        <p>Discount: {promotion.discountValue}%</p>
                                                        <p>Valid: {promotion.startDate} - {promotion.endDate}</p>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                    </TabPane>

                    {/* Tab Voucher */}
                    <TabPane tab="Voucher" key="2">
                        {/* Nội dung khi nhấn vào tab Voucher */}
                        {loadingJson ? (
                            <Spin tip="Loading vouchers...">
                                <Alert message="Fetching vouchers" type="info" />
                            </Spin>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {promotionsJson.map((promotion) => (
                                    <Col span={6} key={promotion.id}>
                                        <Card
                                            hoverable
                                            cover={<img alt="promotion" src={"https://cdn.tgdd.vn/News/1062931/bi-quyet-chup-anh-01-01-01-1280x720.jpg"} />}
                                            actions={[
                                                <Button key="viewDetails" type="link" onClick={() => handleRowClick(promotion)}>
                                                    View Details
                                                </Button>,
                                                // Thêm nút Đổi Voucher
                                                <Button
                                                    key="exchangeVoucher"
                                                    type="primary"
                                                    onClick={() => handleExchangeVoucher(promotion)}
                                                >
                                                    Đổi Voucher
                                                </Button>,
                                            ]}
                                            style={{ borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                        >
                                            <Card.Meta
                                                title={promotion.title}
                                                description={(
                                                    <div>
                                                        <Tag color={promotion.isActive ? "green" : "red"}>
                                                            {promotion.isActive ? "Active" : "Inactive"}
                                                        </Tag>
                                                        <p>Discount: {promotion.discountValue}%</p>
                                                        <p>Min Value: ${promotion.minValue}</p>
                                                        <p>Points: {promotion.points}</p>
                                                    </div>
                                                )}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </TabPane>

                </Tabs>
                {/* Modal hiển thị chi tiết khuyến mãi */}
                <PromotionDetailsModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    promotion={selectedPromotion}
                />
            </div>
        </section>
    );
};

export default YourPromotionPage;
