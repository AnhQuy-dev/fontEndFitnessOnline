import { useEffect, useState } from "react";
import { fetchAllBranch } from "../../../services/BrandService";
import AllBranch from "./AllBranch";
import CreateBranch from "./CreateBrand";

function Branch() {
    const [dataBranch, setDataBrand] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Add token handling
    const tokenData = localStorage.getItem("tokenData");
    const { access_token } = JSON.parse(tokenData);

    const loadBranch = async () => {
        try {
            const res = await fetchAllBranch(access_token); // Pass token to service
            
            if (res && res.data && Array.isArray(res.data.data)) {
                setDataBrand(res.data.data);
                setFilteredData(res.data.data);
                console.log("Branches loaded successfully:", res.data.data);
            } else {
                console.error("Invalid data format received:", res);
                setDataBrand([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading branches:", error);
            setDataBrand([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        loadBranch();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <CreateBranch
                loadBranch={loadBranch}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                token={access_token}  // Pass token to CreateBranch
            />

            <AllBranch
                loadBranch={loadBranch}
                dataBranch={dataBranch}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModalOpen={setIsModalOpen}
                token={access_token}  // Pass token to AllBranch
            />
        </div>
    )
}

export default Branch