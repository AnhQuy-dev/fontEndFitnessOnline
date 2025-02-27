import { useEffect, useState } from 'react';
import { Input, Image } from 'antd';
import '../../../assets/css/branch.css'
import moment from 'moment';

function ClubHome() {
    const [dataClub, setDataClub] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const tokenData = localStorage.getItem("tokenData");

    useEffect(() => {
        loadClub();
    }, []);


    console.log("dataClub",dataClub);
    
    const loadClub = async () => {
        try {

            const { access_token } = JSON.parse(tokenData);
            console.log("Access_OutSide",access_token);


            const response = await fetch('http://localhost:8081/api/dashboard/clubs', {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("res",response);
            
            if (!response.ok) {
                throw new Error('Failed to fetch clubs');
            }
            const data = await response.json();


            setDataClub(data.data);
            setFilteredData(data.data);
            console.log(dataClub);

        } catch (error) {
            console.error('Error loading clubs:', error);
        }
    };

    const handleSearch = (value) => {
        const filtered = dataClub.filter((item) =>
            item.clubName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <div style={{ padding: '80px' }}>
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Clubs</h2>
                <div className="user-form">
                    <Input
                        placeholder="Search by name"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        style={{ width: 450, marginBottom: 20, height: 35 }}
                    />
                </div>
            </div>

            <div className="card-container">
                {filteredData.map((club) => (
                    <div key={club.id} className="card">
                        <div className="row-highlight-table">
                            <h1 style={{ textAlign: 'center' }}>
                                <a href={`/clubs/${club.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {club.name}
                                </a>
                            </h1>
                            <p>
                                {club.clubImages && club.clubImages.length > 0 && (
                                    <Image
                                        src={club.clubImages[0].imageUrl}
                                        alt={`${club.name} photo`}
                                        width={'95%'}
                                        height={'180px'}
                                        style={{ borderRadius: '5px' }}
                                    />
                                )}
                            </p>
                            <p><strong>Address:<br /></strong> {club.address}</p>
                            <p><strong>Phone Number:<br /></strong> {club.contactPhone}</p>
                            <p>
                                <strong>Open Hour:</strong> {moment(club.openHour, 'HH:mm').format('HH:mm')}
                            </p>
                            <p>
                                <strong>Close Hour:</strong> {moment(club.closeHour, 'HH:mm').format('HH:mm')}
                            </p>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    );
}


export default ClubHome;
