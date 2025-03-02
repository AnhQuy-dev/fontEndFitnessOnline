import React, { useState, useEffect, useContext } from 'react';
import { Button, Row, Col, notification, Card, Table, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/Main/PackageMain.css';
import packageHeaderPage from '../../../assets/images/Tow_Person_Play_Gym.webp';

// Import placeholder images for packages
import classicImage from '../../..//assets//images/img3.jpg';
import classicPlusImage from '../../..//assets//images/img3.jpg';
import citifitsportImage from '../../..//assets//images/img3.jpg';
import royalImage from '../../..//assets//images/img3.jpg';
import signatureImage from '../../..//assets//images/img3.jpg';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';
import { getUserByEmail } from '../../../serviceToken/authService';
import { fetchAllPackage } from '../../../serviceToken/PackageSERVICE';
const PackageMain = () => {
    const [dataPackage, setDataPackage] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const tokenData = getTokenData();//tokenData.access_token
    const decodeToken = getDecodedToken();

    const [user, setUser] = useState({});
    const userEmail = decodeToken?.sub;
    console.log("ID USER PACKAGE", user);
    // console.log("ID USER PACKAGE", user.workoutPackageId);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            if (!userEmail || !tokenData?.access_token) return;

            const GetUser = await getUserByEmail(userEmail, tokenData?.access_token);
            setUser(GetUser);
        } catch (error) {
            notification.error({
                message: 'Lỗi tải dữ liệu người dùng',
                description: error.message || 'Có lỗi xảy ra khi tải thông tin người dùng.',
            });
        }
    };

    // Package image mapping
    const packageImages = {
        'CLASSIC': classicImage,
        'CLASSIC-PLUS': classicPlusImage,
        'CITIFITSPORT': citifitsportImage,
        'ROYAL': royalImage,
        'SIGNATURE': signatureImage,
        // Default image for any other package
        'default': classicImage
    };

    useEffect(() => {
        loadPackage();
    }, []);

    const loadPackage = async () => {
        try {
            const result = await fetchAllPackage();
            setDataPackage(result.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaynow = (pkg) => {
        if (user.workoutPackageId === pkg.id) {
            Modal.confirm({
                title: 'Thông báo',
                content: 'Bạn đã đăng ký gói này rồi. Bạn có muốn tiếp tục mua nữa không?',
                okText: 'Tiếp tục',
                cancelText: 'Hủy',
                onOk() {
                    // Nếu người dùng xác nhận muốn tiếp tục mua
                    navigateToPayment(pkg);
                }
            });
        } else {
            // Nếu người dùng chưa đăng ký gói này
            navigateToPayment(pkg);
        }
    };


    const navigateToPayment = (pkg) => {
        navigate('/payment', {
            state: {
                package: pkg,
                months: 3, // Default to 3 months
            }
        });
    };

    // Function to get package image
    const getPackageImage = (packageName) => {
        return packageImages[packageName] || packageImages['default'];
    };

    // Group packages into rows of 3
    const packageRows = [];
    for (let i = 0; i < dataPackage.length; i += 3) {
        packageRows.push(dataPackage.slice(i, i + 3));
    }

    const packageFeatures = [
        { feature: "Workout at the selected GT CLUB", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Join Yoga and Group X at one selected CLUB", packages: ["CLASSIC", "CLASSIC-PLUS"] },
        { feature: "Freely participate in all GX classes across the CITIGYM/VN system", packages: ["CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Unlimited workout time", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Join all Yoga and Group X classes at all clubs within the CITIGYM system", packages: ["CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "One personalized training orientation session and nutrition consultation", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Access to relaxation services after workouts (sauna and steam room)", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Free drinking water", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Premium sports towel service", packages: ["CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Use of smart locker with emergency login", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "One-day advance booking to experience state-of-the-art gym facilities with the latest equipment", packages: ["ROYAL"] },
        { feature: "Pre-booking for two guests without membership to work out together (guests receive a discount on Signature/VIP day passes)", packages: ["SIGNATURE"] },
        { feature: "Priority membership benefits for flexibility and balance", packages: ["SIGNATURE"] },
        { feature: "Ability to register a substitute member during temporary suspension", packages: ["SIGNATURE"] },
        { feature: "One-time membership transfer to a family member (Father, Mother, Spouse, Child, Sibling, Son/Daughter-in-law) free of charge", packages: ["SIGNATURE"] },
        { feature: "Priority booking for Yoga and Group classes up to 48 hours in advance via the app", packages: ["SIGNATURE"] },
        { feature: "Includes 10 personal training sessions, 15 Signature Yoga sessions, 5 GMG/GMY sessions, and 5 special Personal Trainer (PT) sessions during a 15-month Signature membership", packages: ["SIGNATURE"] },
        { feature: "VIP check-in and exclusive reception for Signature members", packages: ["SIGNATURE"] },
        { feature: "Provided with a Signature-branded yoga towel during workouts", packages: ["SIGNATURE"] },
        { feature: "Access to a private VIP area exclusively for Signature members (not applicable to three-time trial guests)", packages: ["SIGNATURE"] }
    ];


    const columns = [
        {
            title: 'Features',
            dataIndex: 'feature',
            key: 'feature',
            className: 'feature-cell',
            fixed: 'left',
        },
        ...packageFeatures[0].packages.map(pkg => ({
            title: pkg,
            dataIndex: pkg,
            key: pkg,
            className: 'package-cell',
            render: (value, record) => (
                record.packages.includes(pkg) ?
                    <span className="check-icon">✓</span> :
                    <span className="dash-icon">-</span>
            )
        }))
    ];
    const dataSource = packageFeatures.map((item, index) => ({
        key: index,
        feature: item.feature,
        packages: item.packages,
        ...item.packages.reduce((acc, pkg) => ({
            ...acc,
            [pkg]: true
        }), {})
    }));

    return (
        <section id="services">
            <div style={{ width: '100%' }}>
                <img
                    src={packageHeaderPage}
                    alt="Package Header"
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
            </div>
            <div className="package-background">
                <div className="package-container">
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#F9690E', fontSize: '49px' }}>PACKAGES</h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading packages...</div>
                    ) : (
                        <>
                            {packageRows.map((row, rowIndex) => (
                                <Row gutter={[24, 24]} key={`row-${rowIndex}`}>
                                    {row.map((pkg) => (
                                        <Col span={8} key={pkg.packageId}>
                                            <Card
                                                hoverable
                                                className="package-card"
                                                cover={
                                                    <div className="package-image-container">
                                                        <img
                                                            alt={pkg.packageName}
                                                            src={getPackageImage(pkg.packageName)}
                                                            className="package-image"
                                                        />
                                                    </div>
                                                }
                                            >
                                                <div className="package-card-content">
                                                    <h3 className="package-name">{pkg.packageName}</h3>
                                                    <p className="package-description">{pkg.description}</p>
                                                    <p className="package-price">
                                                        {pkg.price.toLocaleString('vi-VN')} VND/month
                                                    </p>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => handlePaynow(pkg)}
                                                        className="package-btn"
                                                        style={{
                                                            backgroundColor: String(user.workoutPackageId) === String(pkg.packageId) ? '#FFA500' : undefined,
                                                            borderColor: String(user.workoutPackageId) === String(pkg.packageId) ? '#FFA500' : undefined
                                                        }}
                                                    >
                                                        Pay Now
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ))}

                            <Row>
                                <div className="comparison-section">
                                    <h2 className="comparison-title">Package Comparison</h2>
                                    <Table
                                        columns={columns}
                                        dataSource={dataSource}
                                        pagination={false}
                                        scroll={{ x: 1000 }}
                                        bordered
                                        size="middle"
                                    />
                                </div>
                            </Row>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PackageMain;