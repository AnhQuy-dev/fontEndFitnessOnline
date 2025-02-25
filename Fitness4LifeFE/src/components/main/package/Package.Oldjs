import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Button, Row, Col, notification, Card, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchAllPackage } from '../../../services/PackageService';
import { DataContext } from '../../helpers/DataContext';
import '../../../assets/css/Main/PackageMain.css';
import packageImage from '../../../assets/images/RunningMan.png'; // Import hình ảnh
import packageHeaderPage from '../../../assets/images/Tow_Person_Play_Gym.webp'

const PackageMain = () => {
    const [dataPackage, setDataPackage] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedMonths, setSelectedMonths] = useState(3); // Default to 3 months
    const navigate = useNavigate();
    const { user, isLoggedIn } = useContext(DataContext);
    const [loading, setLoading] = useState(true);

    // Available month options
    const monthOptions = [3, 6, 9, 12];

    useEffect(() => {
        loadPackage();
        const timeout = setTimeout(() => setLoading(false), 5000);
        return () => clearTimeout(timeout);
    }, []);

    const loadPackage = async () => {
        try {
            const result = await fetchAllPackage();
            setDataPackage(result.data.data);
            if (result.data.data.length > 0) {
                setSelectedPackage(result.data.data[0]); // Store the entire package object
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePrices = (pkg) => {
        if (!pkg) return {};

        // Base price per month from the package
        const basePrice = pkg.price; // Price for 1 month

        // Calculate total price based on selected months
        const totalPrice = basePrice * selectedMonths;

        // Apply discount based on duration
        let discount = 0;
        if (selectedMonths >= 12) {
            discount = 0.2; // 20% discount for 12 months
        } else if (selectedMonths >= 9) {
            discount = 0.15; // 15% discount for 9 months
        } else if (selectedMonths >= 6) {
            discount = 0.1; // 10% discount for 6 months
        } else if (selectedMonths >= 3) {
            discount = 0.05; // 5% discount for 3 months
        }

        const discountedTotalPrice = Math.round(totalPrice * (1 - discount));
        const pricePerMonth = Math.round(discountedTotalPrice / selectedMonths);
        const pricePerDay = Math.round(pricePerMonth / 30);

        return {
            totalPrice: discountedTotalPrice,
            pricePerMonth,
            pricePerDay,
            discount: discount * 100 // Convert to percentage for display
        };
    };

    const handlePaynow = (pkg) => {
        if (!isLoggedIn) {
            notification.warning({
                message: 'Authentication Required',
                description: 'You need login before pay product',
            });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        navigate('/payment', {
            state: {
                package: pkg,
                months: selectedMonths,
            }
        });
    };

    const currentPrices = selectedPackage ? calculatePrices(selectedPackage) : {};

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
                    src={packageHeaderPage} // Sử dụng hình ảnh đã import
                    alt="Package"
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
            </div>
            <div className="package-background">
                <div className="package-container">

                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#F9690E', fontSize: '49px' }}>PACKAGES</h2>
                    <Row gutter={[16, 16]} justify="center">
                        {/* Cột bên trái: Thông tin các package */}
                        <Col span={14}>
                            <div className="month-selector" style={{ marginBottom: '20px', textAlign: 'left' }}>
                                {monthOptions.map((months) => (
                                    <Button
                                        key={months}
                                        onClick={() => setSelectedMonths(months)}
                                        className="px-4 py-1 text-sm hover:bg-[#F9690E] hover:border-[#F9690E] hover:text-white transition-colors"
                                        style={{
                                            backgroundColor: selectedMonths === months ? '#F9690E' : 'blanchedalmond',
                                            borderColor: selectedMonths === months ? '#F9690E' : 'blanchedalmond',
                                            color: 'black'
                                        }}
                                    >
                                        {months} Months
                                    </Button>
                                ))}
                            </div>

                            {/* Packages Tabs */}
                            <Tabs
                                activeKey={selectedPackage?.packageName}
                                onChange={(key) => {
                                    const selected = dataPackage.find(pkg => pkg.packageName === key);
                                    setSelectedPackage(selected);
                                }}
                                items={dataPackage.map((pkg) => ({
                                    key: pkg.packageName,
                                    label: (
                                        <span style={{ color: selectedPackage?.packageName === pkg.packageName ? '#F9690E' : 'inherit' }}>
                                            {pkg.packageName}
                                        </span>
                                    ),
                                    children: (
                                        <Card
                                            className="custom-card"
                                            title={<div className="card-header"><span>{pkg.packageName}</span></div>}
                                            bordered={false}
                                            hoverable
                                        >
                                            <p className="card-description"><strong>Description:</strong> {pkg.description}</p>
                                            <p className="card-duration"><strong>Duration:</strong> {selectedMonths} months</p>
                                            <p className="card-price">
                                                Base Price: {pkg.price.toLocaleString('vi-VN')} VND/month
                                            </p>
                                            {currentPrices.discount > 0 && (
                                                <p className="card-discount">
                                                    Discount: {currentPrices.discount}% for {selectedMonths} months package
                                                </p>
                                            )}
                                            <div className="card-footer">
                                                <Button
                                                    type="primary"
                                                    onClick={() => handlePaynow(pkg)}
                                                    className="paynow-btn"
                                                >
                                                    Pay Now
                                                </Button>
                                            </div>
                                            {currentPrices.totalPrice && (
                                                <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-gray-600">Training Period: {selectedMonths} MONTHS</div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-gray-600">Total Cost: {currentPrices.totalPrice.toLocaleString()} VND</div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-gray-600">Cost / Month:  {currentPrices.pricePerMonth.toLocaleString()} VND</div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-gray-600">Cost / Day: {currentPrices.pricePerDay.toLocaleString()} VND</div>
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ),
                                }))}
                            />
                        </Col>

                        {/* Cột bên phải: Hình ảnh */}
                        <Col span={10}>
                            <div style={{ marginLeft: '20px' }}>
                                <img
                                    src={packageImage} // Sử dụng hình ảnh đã import
                                    alt="Package"
                                    style={{ width: '130%' }}
                                />
                            </div>
                        </Col>
                    </Row>
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

                </div>

            </div>
        </section>
    );
};
export default PackageMain;