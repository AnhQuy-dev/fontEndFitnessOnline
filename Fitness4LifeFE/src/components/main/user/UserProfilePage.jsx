import React, { useState, useEffect } from "react";
import {
    Card,
    Avatar,
    Button,
    Row,
    Col,
    Typography,
    Divider,
    Space,
    notification,
    Modal,
    Statistic,
    Progress,
    Tag
} from "antd";
import {
    PhoneOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    EditOutlined,
    HistoryOutlined,
    FileTextOutlined,
    UserOutlined,
    DownloadOutlined,
    ProjectOutlined,
    SmileOutlined,
    CoffeeOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    TeamOutlined,
    TrophyOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../login/ChangePasswordModal";
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { getUserByEmail } from "../../../serviceToken/authService";
import UpdateProfileModal from "./UpdateProfileModal";
import { getOnePackage } from "../../../serviceToken/PackageSERVICE";
const { Title, Text, Paragraph } = Typography;

const styles = {
    packageContainer: {
        textAlign: "center",
        marginBottom: "25px",
        color:"black"
    },
    packageCard: {
        display: "inline-block",
        padding: "8px 20px",
        background: "linear-gradient(135deg, #F9690E 0%, FA8231 100%)",
        color: " #F9690E",
        borderRadius: "20px",
        boxShadow: "0 4px 12px rgba(249, 105, 14, 0.3)",
        fontWeight: "600",
        fontSize: "16px",
        border: "2px solid #fff",
        animation: "pulse 2s infinite",
    },
    profileContainer: {
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        background: "#f9f9f9",
        minHeight: "100vh",
    },
    heroSection: {
        position: "relative",
        borderRadius: "15px 15px 0 0",
        overflow: "hidden",
        marginBottom: "0",
        backgroundColor: "#f8f8f8",
    },
    heroBanner: {
        height: "280px",
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
        position: "relative",
    },
    heroContent: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        padding: "0 40px",
        zIndex: 2,
    },
    heroName: {
        fontSize: "42px",
        fontWeight: "700",
        margin: "0 0 10px 0",
    },
    heroSubtitle: {
        fontSize: "22px",
        fontWeight: "400",
        color: "#666",
        marginBottom: "20px",
    },
    mainCard: {
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
        background: "#fff",
    },
    statsRow: {
        background: "#fff",
        padding: "30px 20px",
        borderRadius: "0 0 15px 15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        marginTop: "-20px",
    },
    statItem: {
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s",
        padding: "20px 10px",
        borderRadius: "10px",
        height: "100%",
    },
    statIcon: {
        fontSize: "32px",
        color: "#F9690E",
        marginBottom: "10px",
    },
    statValue: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#333",
        margin: "5px 0",
    },
    statLabel: {
        fontSize: "14px",
        color: "#777",
        fontWeight: "500",
    },
    avatarSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        marginTop: "-75px",
        position: "relative",
        zIndex: 3,
    },
    avatarBorder: {
        border: "5px solid #fff",
        borderRadius: "50%",
        padding: "5px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    avatar: {
        border: "4px solid #F9690E",
        boxShadow: "0 4px 12px rgba(249, 105, 14, 0.2)",
    },
    buttonGroup: {
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "20px 0",
    },
    actionButton: {
        borderRadius: "8px",
        height: "45px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "500",
        padding: "0 20px",
        fontSize: "15px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s",
    },
    primaryButton: {
        backgroundColor: "#F9690E",
        borderColor: "#F9690E",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#e85d00",
            borderColor: "#e85d00",
        },
    },
    infoSection: {
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        marginTop: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    },
    infoCard: {
        height: "100%",
        boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
        borderRadius: "12px",
        border: "1px solid #f0f0f0",
    },
    infoLabel: {
        color: "#777",
        marginRight: "8px",
        fontSize: "15px",
    },
    infoValue: {
        color: "#333",
        fontWeight: "500",
        fontSize: "16px",
    },
    sectionTitle: {
        color: "#F9690E",
        marginBottom: "20px",
        fontSize: "22px",
        fontWeight: "600",
        position: "relative",
        paddingBottom: "10px",
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "50px",
            height: "3px",
            background: "#F9690E",
        },
    },
    aboutSection: {
        lineHeight: "1.8",
        fontSize: "16px",
    },
    contactItem: {
        display: "flex",
        alignItems: "center",
        margin: "15px 0",
    },
    contactIcon: {
        color: "#F9690E",
        fontSize: "18px",
        marginRight: "15px",
        background: "rgba(249, 105, 14, 0.1)",
        padding: "10px",
        borderRadius: "8px",
    },
    skillBar: {
        marginBottom: "15px",
    },
    skillName: {
        marginBottom: "5px",
        fontWeight: "500",
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
    const [packageData, setPackageData] = useState(null);
    console.log("Package In Profile",packageData);


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
                console.log("User Data In Profile Page", response);

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
                    if (response.workoutPackageId) {
                        try {
                            const packageResponse = await getOnePackage(response.workoutPackageId, tokenData.access_token);
                            if (packageResponse) {
                                setPackageData(packageResponse.data);
                            }
                        } catch (packageError) {
                            console.error("Error fetching package:", packageError);
                        }
                    }
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
        return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
    }

    if (!userData) {
        return (
            <div style={{ padding: "50px", textAlign: "center" }}>
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
        <section id="profile">
            <div style={styles.profileContainer}>
                {/* Hero Section */}
                <div style={styles.heroSection}>
                    <div style={styles.heroBanner}>
                        <div style={styles.heroContent}>
                            <Title level={1} style={{ color: '#F9690E', margin: 0, fontSize: '36px', fontWeight: 700 }}>
                                Hi, I am {fullName}
                            </Title>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={styles.avatarSection}>
                            <div style={styles.avatarBorder}>
                                <Avatar
                                    size={150}
                                    src={`${avatar?.startsWith("http") ? avatar : "https://via.placeholder.com/150"}?t=${Date.now()}`}
                                    style={styles.avatar}
                                    icon={<UserOutlined />}
                                    onClick={() => setIsImageModalVisible(true)}
                                />
                            </div>
                        </div>
                        {packageData && (
                            <div style={styles.packageContainer}>
                                <div style={styles.packageCard}>
                                    <TrophyOutlined style={{ marginRight: "8px" }} />
                                    {packageData.packageName}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats/Action Buttons Row */}
                <Row gutter={[16, 16]} style={styles.statsRow}>
                    <Col xs={24} sm={8} md={2} lg={4} xl={6}>
                        <Card hoverable style={styles.statItem}>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                style={{
                                    ...styles.actionButton,
                                    width: '100%',
                                    backgroundColor: '#F9690E',
                                    borderColor: '#F9690E',
                                    whiteSpace: 'normal',
                                    height: 'auto',
                                    padding: '10px 15px'
                                }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Change Password
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8} md={2} lg={4} xl={6}>
                        <Card hoverable style={styles.statItem}>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                style={{
                                    ...styles.actionButton,
                                    width: '100%',
                                    backgroundColor: '#F9690E',
                                    borderColor: '#F9690E',
                                    whiteSpace: 'normal',
                                    height: 'auto',
                                    padding: '10px 15px'
                                }}
                                onClick={() => setIsUpdateModalOpen(true)}
                            >
                                Update Profile
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8} md={2} lg={4} xl={6}>
                        <Card hoverable style={styles.statItem}>
                            <Button
                                type="dashed"
                                icon={<FileTextOutlined />}
                                style={{
                                    ...styles.actionButton,
                                    width: '100%',
                                    whiteSpace: 'normal',
                                    height: 'auto',
                                    padding: '10px 15px'
                                }}
                                onClick={() => navigate("/profile/your-posts")}
                            >
                                Your Posts
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8} md={2} lg={4} xl={6}>
                        <Card hoverable style={styles.statItem}>
                            <Button
                                type="default"
                                icon={<HistoryOutlined />}
                                style={{
                                    ...styles.actionButton,
                                    width: '100%',
                                    whiteSpace: 'normal',
                                    height: 'auto',
                                    padding: '10px 15px'
                                }}
                                onClick={() => navigate("/profile/history-booking")}
                            >
                                Booking History
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8} md={2} lg={4} xl={6}>
                        <Card hoverable style={styles.statItem}>
                            <Button
                                type="dashed"
                                icon={<HistoryOutlined />}
                                style={{
                                    ...styles.actionButton,
                                    width: '100%',
                                    whiteSpace: 'normal',
                                    height: 'auto',
                                    padding: '10px 15px'
                                }}
                                onClick={() => navigate("/profile/yourcode")}
                            >
                                Your Promotion
                            </Button>
                        </Card>
                    </Col>
                </Row>

                {/* About Section */}
                <div style={{ marginTop: '30px' }}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24}>
                            <Card style={{ ...styles.infoSection, padding: '30px' }}>
                                <Title level={3} style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '30px' }}>MY INTRO</Title>
                                <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>About Me</Title>

                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', textAlign: 'center', maxWidth: '800px', margin: '0 auto 30px' }}>
                                    {description || "A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth."}
                                </Paragraph>
                                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                                    <Col xs={24} md={12}>
                                        <Card style={styles.infoSection}>
                                            <Title level={4} style={styles.sectionTitle}>Contact Information</Title>
                                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                                <div style={styles.contactItem}>
                                                    <PhoneOutlined style={styles.contactIcon} />
                                                    <div>
                                                        <Text strong style={{ display: 'block', marginBottom: '5px' }}>Phone</Text>
                                                        <Text style={styles.infoValue}>{phone}</Text>
                                                    </div>
                                                </div>

                                                <div style={styles.contactItem}>
                                                    <EnvironmentOutlined style={styles.contactIcon} />
                                                    <div>
                                                        <Text strong style={{ display: 'block', marginBottom: '5px' }}>Address</Text>
                                                        <Text style={styles.infoValue}>{address}</Text>
                                                    </div>
                                                </div>

                                                <div style={styles.contactItem}>
                                                    <GlobalOutlined style={styles.contactIcon} />
                                                    <div>
                                                        <Text strong style={{ display: 'block', marginBottom: '5px' }}>Email</Text>
                                                        <Text style={styles.infoValue}>{email}</Text>
                                                    </div>
                                                </div>
                                            </Space>
                                        </Card>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Card style={styles.infoSection}>
                                            <Title level={4} style={styles.sectionTitle}>Personal Details</Title>
                                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <Card bordered={false} style={{ background: '#f9f9f9', borderRadius: '8px' }}>
                                                            <Statistic
                                                                title="Gender"
                                                                value={gender}
                                                                valueStyle={{ color: '#F9690E' }}
                                                                prefix={<UserOutlined />}
                                                            />
                                                        </Card>
                                                    </Col>

                                                    <Col span={12}>
                                                        <Card bordered={false} style={{ background: '#f9f9f9', borderRadius: '8px' }}>
                                                            <Statistic
                                                                title="Age"
                                                                value={age}
                                                                valueStyle={{ color: '#F9690E' }}
                                                                prefix={<CalendarOutlined />}
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>

                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <Card bordered={false} style={{ background: '#f9f9f9', borderRadius: '8px' }}>
                                                            <Statistic
                                                                title="Height"
                                                                value={heightValue}
                                                                suffix="cm"
                                                                valueStyle={{ color: '#F9690E' }}
                                                            />
                                                        </Card>
                                                    </Col>

                                                    <Col span={12}>
                                                        <Card bordered={false} style={{ background: '#f9f9f9', borderRadius: '8px' }}>
                                                            <Statistic
                                                                title="Marital Status"
                                                                value={maritalStatus}
                                                                valueStyle={{ color: '#F9690E' }}
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Space>
                                        </Card>
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Contact and Personal Info */}


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