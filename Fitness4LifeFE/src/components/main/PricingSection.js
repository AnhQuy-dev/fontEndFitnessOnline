import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from '../../serviceToken/tokenUtils';
import { fetchAllPackage } from '../../serviceToken/PackageSERVICE';

const PricingSection = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    if (loading) {
        return (
            <section id="pricing">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title wow fadeInDown">Pricing</h2>
                        <p className="wow fadeInDown">Loading packages...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="pricing">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title wow fadeInDown">Pricing</h2>
                        <p className="wow fadeInDown text-danger">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title wow fadeInDown">Pricing</h2>
                    <p className="wow fadeInDown">
                        Choose the perfect plan for your needs. Upgrade or downgrade at any time.
                    </p>
                </div>

                <div className="row">
                    {packages.map((pkg, index) => {
                        // Calculate delay for animation
                        const delay = index * 200;
                        // Determine if this package should be featured
                        const isFeatured = pkg.isFeatured || false;

                        return (
                            <div className="col-md-3 col-sm-6 col-xs-12" key={pkg.id || index}>
                                <div className="wow zoomIn" data-wow-duration="400ms" data-wow-delay={`${delay}ms`}>
                                    <ul className={`pricing ${isFeatured ? 'featured' : ''}`}>
                                        <li className="plan-header">
                                            <div className="price-duration">
                                                <span className="price">${pkg.price || '0'}</span>
                                                <span className="duration">{pkg.durationMonth || 'month'} months</span>
                                            </div>

                                            <div className="plan-name">{pkg.packageName || `Package ${index + 1}`}</div>
                                        </li>
                                        <li>{pkg.description || 'SHARED SSL CERTIFICATE'}</li>
                                        <li className="plan-purchase">
                                            <a 
                                                className="btn btn-primary" 
                                                href="#"
                                                onClick={(e) => handleGetItNow(e, pkg.id)}
                                            >
                                                Get It Now!
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        );
                    })}

                    {/* If no packages are available, show a message */}
                    {packages.length === 0 && (
                        <div className="col-12 text-center">
                            <p>No pricing packages available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;