import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from '../../serviceToken/tokenUtils';
import { fetchAllPackage } from '../../serviceToken/PackageSERVICE';
import { Carousel, Card, Spin, Alert, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../../assets/css/Main/PricingSection.css'

const PricingSection = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const carouselRef = useRef();

    console.log("packages", packages);

    useEffect(() => {
        const loadPackages = async () => {
            try {
                const tokenData = getTokenData();
                const response = await fetchAllPackage(tokenData.access_token);

                if (response && response.data) {
                    setPackages(response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error loading packages:', err);
                setError('Failed to load pricing packages');
                setLoading(false);
            }
        };

        loadPackages();
    }, []);

    const handleGetItNow = (e, packageId) => {
        e.preventDefault();
        // You can pass the package ID as a parameter if needed
        navigate('/packageMain', { state: { packageId } });
    };

    // Carousel navigation handlers
    const next = () => {
        carouselRef.current.next();
    };

    const previous = () => {
        carouselRef.current.prev();
    };

    // Carousel settings
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    if (loading) {
        return (
            <section id="pricing" style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                        <h2 className="section-title wow fadeInDown">Pricing</h2>
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" tip="Loading packages..." />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="pricing" style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                        <h2 className="section-title wow fadeInDown">Pricing</h2>
                        <Alert
                            message="Error"
                            description={error}
                            type="error"
                            showIcon
                            style={{ maxWidth: '600px', margin: '0 auto' }}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing" style={{ padding: '60px 0' }}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <h2 className="section-title wow fadeInDown">Pricing</h2>
                    <p className="wow fadeInDown">
                        Choose the perfect plan for your needs. Upgrade or downgrade at any time.
                    </p>
                </div>

                {packages.length === 0 ? (
                    <div className="col-12 text-center">
                        <p>No pricing packages available at the moment.</p>
                    </div>
                ) : (
                    <div className="pricing-carousel-container">
                        <div style={{ position: 'relative' }}>
                            <Button
                                className="carousel-button prev"
                                onClick={previous}
                                icon={<LeftOutlined />}
                                shape="circle"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '-20px',
                                    zIndex: 2,
                                    transform: 'translateY(-50%)'
                                }}
                            />

                            <Carousel ref={carouselRef} {...carouselSettings}>
                                {packages.map((pkg, index) => {
                                    // Determine if this package should be featured
                                    const isFeatured = pkg.isFeatured || false;

                                    return (
                                        <div key={pkg.id || index} style={{ padding: '0 10px' }}>
                                            <Card
                                                hoverable
                                                className={`pricing-card ${isFeatured ? 'featured' : ''}`}
                                                style={{
                                                    height: '100%',
                                                    textAlign: 'center',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    boxShadow: isFeatured ? '0 0 15px rgba(0,0,0,0.1)' : '0 0 5px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <div className="plan-header" style={{ padding: '20px 0' }}>
                                                    <h3 className="plan-name" style={{
                                                        fontSize: '24px',
                                                        marginBottom: '15px',
                                                        color: isFeatured ? '#1890ff' : '#333'
                                                    }}>
                                                        {pkg.packageName || `Package ${index + 1}`}
                                                    </h3>
                                                    <div className="price-duration">
                                                        <div className="price" style={{
                                                            fontSize: '36px',
                                                            fontWeight: 'bold',
                                                            color: isFeatured ? '#1890ff' : '#333'
                                                        }}>
                                                            ${pkg.price || '0'}
                                                        </div>
                                                        <div className="duration" style={{
                                                            color: '#888',
                                                            marginBottom: '20px'
                                                        }}>
                                                            {pkg.durationMonth || 'month'} months
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="plan-features" style={{
                                                    padding: '0 20px 20px',
                                                    minHeight: '100px'
                                                }}>
                                                    <p>{pkg.description || 'SHARED SSL CERTIFICATE'}</p>
                                                </div>

                                                <div className="plan-purchase" style={{ padding: '0 0 30px' }}>
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        onClick={(e) => handleGetItNow(e, pkg.id)}
                                                        style={{
                                                            background: isFeatured ? '#1890ff' : '#1890ff',
                                                            borderColor: isFeatured ? '#1890ff' : '#1890ff'
                                                        }}
                                                    >
                                                        Get It Now!
                                                    </Button>
                                                </div>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </Carousel>

                            <Button
                                className="carousel-button next"
                                onClick={next}
                                icon={<RightOutlined />}
                                shape="circle"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '-20px',
                                    zIndex: 2,
                                    transform: 'translateY(-50%)'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Styling will be done with inline styles and CSS classes */}
        </section>
    );
};

export default PricingSection;