import { useEffect, useState } from "react"
import AllClubs from "./AllClubs";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchAllClubs } from "../../../serviceToken/ClubService";
import CreateClubModa from "./CreateClubModa";

function Club() {
    const [dataClubs, setDataClubs] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModelOpen] = useState(false);

    const loadClubs = async () => {
        try {
            const tokenData = getTokenData();
            const data = await fetchAllClubs(tokenData.access_token); // Now fetchAllClubs returns parsed data

            if (data && Array.isArray(data.data)) {
                setDataClubs(data.data);
                setFilteredData(data.data);
            } else {
                console.error("Invalid data format received:", data);
                setDataClubs([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
            setDataClubs([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        loadClubs();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <CreateClubModa
                loadClubs={loadClubs}
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
            />

            <AllClubs
                loadClubs={loadClubs}
                dataClubs={dataClubs}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModelOpen={setIsModelOpen}
            />
        </div>
    )
}

export default Club