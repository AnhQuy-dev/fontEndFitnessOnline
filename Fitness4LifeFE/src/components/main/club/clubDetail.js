import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Button } from 'antd';
import moment from 'moment';
import { ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, InfoCircleOutlined, EnvironmentFilled } from '@ant-design/icons';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import { fetchClubById } from '../../../serviceToken/ClubService';
import '../../../assets/css/Main/clubMain.css';

function ClubDetails() {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadClubDetails();
    }, [id]);

    const loadClubDetails = async () => {
        try {
            const tokenData = getTokenData();
            const response = await fetchClubById(id, tokenData.access_token);

            // Set the club data from API response
            setClub(response.data);
        } catch (err) {
            console.error('Error fetching club details:', err);
            setError('Failed to load club details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Format opening hours properly
    const formatHours = (hours) => {
        if (!hours || !Array.isArray(hours) || hours.length < 2) {
            return 'N/A';
        }
        // Extract hours and minutes from the array
        const [hours24, minutes] = hours;
        return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    // Function to get Google Maps URL for static link
    const getGoogleMapsUrl = (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };

    // Function to open Google Maps in new tab
    const openGoogleMaps = (address) => {
        window.open(getGoogleMapsUrl(address), '_blank');
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading club details...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <InfoCircleOutlined className="error-icon" />
            <p>{error}</p>
        </div>
    );

    if (!club) return (
        <div className="no-data-container">
            <InfoCircleOutlined className="no-data-icon" />
            <p>No club data available</p>
        </div>
    );

    return (
        <section id="services">
            <div className="club-details-container">
                {/* Main Content - Split Layout */}
                <div className="split-layout">
                    {/* Left Side - Images */}
                    <div className="left-panel">
                        <div className="image-stack">
                            {club.clubImages && club.clubImages.length > 0 ? (
                                club.clubImages.map((image) => (
                                    <div key={image.id} className="stack-image-item">
                                        <img
                                            src={image.imageUrl}
                                            alt={`${club.name}`}
                                            className="stack-image"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="no-images">No images available</div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Club Info */}
                    <div className="right-panel">
                        <div className="info-section">
                            <h2 className="info-title">{club.name}</h2>
                            
                            {/* Description - Đã chuyển xuống đây */}
                            <p className="club-description">{club.description}</p>

                            {/* Location */}
                            <div className="location-info">
                                <EnvironmentOutlined className="location-icon" />
                                <span className="address-text">{club.address}</span>
                            </div>

                            {/* Contact */}
                            <div className="info-row">
                                <div className="info-label">
                                    <PhoneOutlined style={{ marginRight: '8px' }} />
                                    Contact:
                                </div>
                                <div className="info-value">{club.contactPhone}</div>
                            </div>

                            {/* Hours */}
                            <div className="hours-container">
                                <h3 className="hours-title">
                                    <ClockCircleOutlined className="hours-icon" />
                                    Operating Hours
                                </h3>
                                <div className="info-row">
                                    <div className="info-value">{formatHours(club.openHour)} - {formatHours(club.closeHour)}</div>
                                </div>
                                 
                            </div>

                            {/* Google Maps - Static Link Approach */}
                            <div className="map-container">
                                <h3 className="map-title">
                                    <EnvironmentFilled className="map-icon" />
                                    Location on Map
                                </h3>
                                <div className="map-placeholder" style={{ 
                                    height: '300px', 
                                    width: '100%', 
                                    background: '#f0f0f0', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <EnvironmentFilled style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                    <p style={{ marginBottom: '16px' }}>
                                        {club.address}
                                    </p>
                                    <Button 
                                        type="primary" 
                                        icon={<EnvironmentOutlined />} 
                                        size="large"
                                        onClick={() => openGoogleMaps(club.address)}
                                    >
                                        View on Google Maps
                                    </Button>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="metadata-section">
                                <p>Created: {moment(club.createAt).format('MMMM D, YYYY')}</p>
                                <p>Last Updated: {moment(club.updateAt).format('MMMM D, YYYY')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ClubDetails;