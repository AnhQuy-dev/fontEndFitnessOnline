import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'antd';
import moment from 'moment';
import { fetchClubById } from '../../../services/ClubService';
import '../../../assets/css/branch.css'
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
            const response = await fetchClubById(id);
            console.log('Fetched Club Data:', response); // Debugging
            setClub(response.data.data);
        } catch (err) {
            console.error('Error fetching club details:', err);
            setError('Failed to load club details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    if (!club) return <div>No club data available</div>;

    return (
        <div style={{ padding: '100px', fontFamily: 'Arial, sans-serif' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}
            >
                {/* Cột hình ảnh */}
                <div style={{ flex: '1', maxWidth: '600px' }}>
                    {club.clubImages && club.clubImages.length > 0 && (
                        <Image
                            src={club.clubImages[0].imageUrl}
                            alt={`${club.name} photo`}
                            width={'100%'}
                            height={'auto'}
                            style={{
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    )}
                </div>

                {/* Cột thông tin */}
                <div
                    style={{
                        flex: '2',
                        maxWidth: '600px',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        fontSize: '36px',
                    }}
                >
                    <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
                        {club.name}
                    </h1>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Address:</strong><br /> {club.address}
                    </p>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Phone Number:</strong><br /> {club.contactPhone}
                    </p>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Description:</strong><br /> {club.description}
                    </p>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Open Hour:</strong> {moment(club.openHour, 'HH:mm').format('HH:mm')}
                    </p>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Close Hour:</strong> {moment(club.closeHour, 'HH:mm').format('HH:mm')}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ClubDetails;