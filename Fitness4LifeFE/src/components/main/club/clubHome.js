import { useEffect, useState } from 'react';
import { Input, Image } from 'antd';
import { fetchAllClubs } from '../../../serviceToken/ClubService';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import '../../../assets/css/branch.css';
function ClubHome() {
    const [dataClub, setDataClub] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const loadClubs = async () => {
        try {
            const tokenData = getTokenData();
            const data = await fetchAllClubs(tokenData.access_token);

            if (data && Array.isArray(data.data)) {
                setDataClub(data.data);
                setFilteredData(data.data);
            } else {
                console.error("Invalid data format received:", data);
                setDataClub([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
            setDataClub([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        loadClubs();
    }, []);

    const handleSearch = (value) => {
        const filtered = dataClub.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Function to format hours from the API data
    const formatHours = (openHour, closeHour) => {
        if (!openHour || !closeHour) return "Giờ mở cửa không xác định";

        const formatTimeValue = (timeArray) => {
            if (!timeArray || timeArray.length < 2) return "--:--";
            const [hours, minutes] = timeArray;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };

        return `${formatTimeValue(openHour)} - ${formatTimeValue(closeHour)}`;
    };

    const getGoogleMapsUrl = (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };

    const openGoogleMaps = (address) => {
        window.open(getGoogleMapsUrl(address), '_blank');
    };

    return (
        <section id="services">
            <section className="coffee-shops-container">
                <div className="shops-grid">
                    {filteredData.map((club, index) => (
                        <div key={club.id} className="shop-card">
                            <a href={`/clubs/${club.id}`} >
                                <div className="shop-image">
                                    <Image
                                        src={club.clubImages && club.clubImages.length > 0
                                            ? club.clubImages.find(img => img.primary)?.imageUrl || club.clubImages[0].imageUrl
                                            : ""}
                                        alt={club.name}
                                        preview={false}
                                    />
                                    {club.clubImages && club.clubImages.length > 1 && (
                                        <div className="image-navigation">
                                            <button className="nav-btn prev">&lt;</button>
                                            <button className="nav-btn next">&gt;</button>
                                        </div>
                                    )}
                                </div>
                                <div className="shop-details">
                                    <h3 className="shop-name">{club.name}</h3>
                                    <div className="map-button">
                                        <button onClick={() => openGoogleMaps(club.address)}>View On GoogleMap</button>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="shop-address">
                                        <p>{club.address}</p>
                                    </div>
                                    <div className="shop-hours">
                                        <p>{formatHours(club.openHour, club.closeHour)}</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                    ))}
                </div>
            </section>
        </section>
    );
}

export default ClubHome;