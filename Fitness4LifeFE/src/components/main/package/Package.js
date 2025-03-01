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
        { feature: "Tập luyện tại GT CLUB đã chọn", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Tham gia Yoga và Group X tại 01 CLUB đã chọn", packages: ["CLASSIC", "CLASSIC-PLUS"] },
        { feature: "Tự do thay luyện tập tất cả các lớp GX trong hệ thống CITIGYM/VN", packages: ["CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Không giới hạn thời gian luyện tập", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB trong hệ thống CITIGYM", packages: ["CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "1 buổi định hướng luyện tập riêng biệt và tư vấn dinh dưỡng", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Được sử dụng dịch vụ thư giãn sau luyện tập (sauna và steamroom)", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Nước uống miễn phí", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Dịch vụ khăn tắm thể thao cao cấp", packages: ["CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Sử dụng khóa tủ thông minh đăng nhập số dự phòng Emergency Locker", packages: ["CLASSIC", "CLASSIC-PLUS", "CITIFITSPORT", "ROYAL", "SIGNATURE"] },
        { feature: "Được đặt trước 1 ngày trải nghiệm phòng tập công trạng bị cùng đồng phục và máy móc đầu tấn tiế nhất", packages: ["ROYAL"] },
        { feature: "Được đặt trước 2 khách không có thẻ để tập cùng (người đi cùng được giảm chi phí ngày tập Signature/VIP)", packages: ["SIGNATURE"] },
        { feature: "Ưu đãi đông băng - đề dàng cần đối", packages: ["SIGNATURE"] },
        { feature: "Được đăng ký 1 người thay thế hội viên lý xuân tạm dừng", packages: ["SIGNATURE"] },
        { feature: "01 lần chuyển nhượng cho người thân trong gia đinh (Cha, Mẹ, Vợ/Chồng, Con, Anh/Chị/Em ruột, Con dâu/rể) không mất phí", packages: ["SIGNATURE"] },
        { feature: "Được ưu tiên đặt chỗ các lớp Yoga và Group trong 48 tiếng trước buổi tập qua ứng", packages: ["SIGNATURE"] },
        { feature: "Được 10 buổi huấn luyện viên cá nhân Signature 15 buổi Signature Yoga cá nhân cơ bản và 5 buổi GMG/GMY và 5 buổi Personal Trainer (PT) đặc biệt dự Signature 15 tháng", packages: ["SIGNATURE"] },
        { feature: "Là VIP check-in và tiếp đón riêng với Signature", packages: ["SIGNATURE"] },
        { feature: "Phục vụ thêm tạp Yoga có logo Signature khi tham gia tập", packages: ["SIGNATURE"] },
        { feature: "Sử dụng khu vực VIP riêng dành cho các hội viên Signature (Không áp dụng cho khách 3 lần)", packages: ["SIGNATURE"] }
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