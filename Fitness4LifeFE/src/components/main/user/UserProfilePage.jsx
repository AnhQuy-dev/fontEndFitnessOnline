import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Row, Col, Typography, Divider, Space, notification, Modal } from "antd";
import { PhoneOutlined, EnvironmentOutlined, GlobalOutlined, EditOutlined, HistoryOutlined, FileTextOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../login/ChangePasswordModal";
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { getUserByEmail } from "../../../serviceToken/authService";
import UpdateProfileModal from "./UpdateProfileModal";
const { Title, Text } = Typography;

const styles = {
    profileContainer: {
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
    },
    mainCard: {
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
    },
    avatarSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "scale(1.05)",
        },
    },
    avatar: {
        border: "4px solid #F9690E",
        boxShadow: "0 4px 12px rgba(249, 105, 14, 0.2)",
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },
    actionButton: {
        borderRadius: "6px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    infoSection: {
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        marginTop: "16px",
    },
    infoLabel: {
        color: "#666",
        marginRight: "8px",
    },
    infoValue: {
        color: "#333",
        fontWeight: "500",
    },
    sectionTitle: {
        color: "#F9690E",
        marginBottom: "16px",
        fontSize: "20px",
    },
};

const UserProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const navigate = useNavigate();
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();
    useEffect(() => {
        const fetchUserData = async () => {
            if (!tokenData) {
                setLoading(false);
                return;
            }
            try {
                if (!decotoken.sub) {
                    notification.error({
                        message: "Error",
                        description: "Invalid token data"
                    });
                    return;
                }
                const response = await getUserByEmail(decotoken.sub, tokenData.access_token);
                if (response) {
                    const userDataWithDefaults = {
                        ...response,
                        profile: response.profile || {
                            hobbies: "No hobbies available",
                            address: "No address available",
                            age: "No age available",
                            heightValue: "No height value available",
                            description: "No description available",
                            maritalStatus: "No marital status available",
                            avatar: "https://via.placeholder.com/120",
                        }
                    };

                    setUserData(userDataWithDefaults);
                } else {
                    notification.error({
                        message: "Error",
                        description: "Could not load user data."
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "Could not connect to server."
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleProfileUpdate = async () => {
        if (!tokenData) return;
        try {
            if (!decotoken?.sub) return;
            const response = await getUserByEmail(decotoken?.sub, tokenData.access_token);
            if (response) {
                setUserData(response);
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Could not refresh user data."
            });
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "24px" }}>Loading...</div>;
    }

    if (!userData) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <div className="alert alert-warning" role="alert">
                    No user data available. Please log in.
                </div>
            </div>
        );
    }

    const {
        fullName = "No name available",
        email = "No email available",
        phone = "No phone available",
        role = "No role available",
        gender = "No gender available",
        profile = {}
    } = userData;

    const {
        hobbies = "No hobbies available",
        address = "No address available",
        age = "No age available",
        heightValue = "No height value available",
        description = "No description available",
        maritalStatus = "No marital status available",
        avatar = "https://via.placeholder.com/120"
    } = profile;

    return (
        <section id="services">
            <div style={styles.profileContainer}>
                <Card style={styles.mainCard}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} sm={8} md={6}>
                            <div
                                style={styles.avatarSection}
                                onClick={() => setIsImageModalVisible(true)}
                            >
                                <Avatar
                                    size={150}
                                    src={`${avatar?.startsWith("http") ? avatar : "https://via.placeholder.com/150"}?t=${Date.now()}`}
                                    style={styles.avatar}
                                    icon={<UserOutlined />}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={16} md={18}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Title level={2} style={{ color: '#F9690E', margin: 0 }}>{fullName}</Title>
                                </div>
                                <Space wrap style={styles.buttonGroup}>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        style={{ ...styles.actionButton, backgroundColor: '#F9690E', borderColor: '#F9690E' }}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Change Password
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        style={{ ...styles.actionButton, backgroundColor: '#F9690E', borderColor: '#F9690E' }}
                                        onClick={() => setIsUpdateModalOpen(true)}
                                    >
                                        Update Profile
                                    </Button>

                                    <Button
                                        type="dashed"
                                        icon={<FileTextOutlined />}
                                        style={styles.actionButton}
                                        onClick={() => navigate("/profile/your-posts")}
                                    >
                                        Your Posts
                                    </Button>
                                    <Button
                                        type="default"
                                        icon={<HistoryOutlined />}
                                        style={styles.actionButton}
                                        onClick={() => navigate("/profile/history-booking")}
                                    >
                                        Booking History
                                    </Button>
                                    <Button
                                        type="dashed"
                                        icon={<HistoryOutlined />}
                                        style={styles.actionButton}
                                        onClick={() => navigate("/profile/yourcode")}
                                    >
                                        YourPromotion
                                    </Button>
                                </Space>
                            </Space>
                        </Col>
                    </Row>

                    <Divider style={{ borderColor: '#f0f0f0' }} />

                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <div style={styles.infoSection}>
                                <Title level={4} style={styles.sectionTitle}>Contact Information</Title>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <PhoneOutlined style={{ color: '#F9690E', marginRight: '8px' }} />
                                        <Text style={styles.infoValue}>{phone}</Text>
                                    </div>
                                    <div>
                                        <EnvironmentOutlined style={{ color: '#F9690E', marginRight: '8px' }} />
                                        <Text style={styles.infoValue}>{address}</Text>
                                    </div>
                                    <div>
                                        <GlobalOutlined style={{ color: '#F9690E', marginRight: '8px' }} />
                                        <Text style={styles.infoValue}>{email}</Text>
                                    </div>
                                </Space>
                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <div style={styles.infoSection}>
                                <Title level={4} style={styles.sectionTitle}>Personal Details</Title>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <Text style={styles.infoLabel}>Gender:</Text>
                                        <Text style={styles.infoValue}>{gender}</Text>
                                    </div>
                                    <div>
                                        <Text style={styles.infoLabel}>Age:</Text>
                                        <Text style={styles.infoValue}>{age}</Text>
                                    </div>
                                    <div>
                                        <Text style={styles.infoLabel}>Height:</Text>
                                        <Text style={styles.infoValue}>{heightValue} cm</Text>
                                    </div>
                                    <div>
                                        <Text style={styles.infoLabel}>Marital Status:</Text>
                                        <Text style={styles.infoValue}>{maritalStatus}</Text>
                                    </div>
                                </Space>
                            </div>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '24px' }}>
                        <Col span={24}>
                            <div style={styles.infoSection}>
                                <Title level={4} style={styles.sectionTitle}>About Me</Title>
                                <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>{description}</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Modals */}
                <Modal
                    visible={isImageModalVisible}
                    footer={null}
                    onCancel={() => setIsImageModalVisible(false)}
                    width={600}
                    style={{ top: 20 }}
                    bodyStyle={{ padding: 0 }}
                >
                    <img
                        src={`${avatar?.startsWith("http") ? avatar : "https://via.placeholder.com/600"}?t=${Date.now()}`}
                        alt="Profile"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Modal>

                <ChangePasswordModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    email={email}
                />

                <UpdateProfileModal
                    open={isUpdateModalOpen}
                    onClose={(updatedData) => {
                        setIsUpdateModalOpen(false);
                        if (updatedData) {
                            handleProfileUpdate();
                        }
                    }}
                    userData={{
                        fullName,
                        phone,
                        gender,
                        hobbies,
                        address,
                        age,
                        maritalStatus,
                        heightValue,
                        description,
                        role,
                        avatar,
                    }}
                />
            </div>
        </section>
    );
};

export default UserProfilePage;