import { useEffect, useState } from "react";
import AllBranch from "./AllBranch";
import CreateBranch from "./CreateBrand";
import { fetchAllBranch } from "../../../serviceToken/BrandService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

function Branch() {
    const [dataBranch, setDataBrand] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tokenData = getTokenData();//tokenData.access_token

    const loadBranch = async () => {
        try {
            const res = await fetchAllBranch(tokenData.access_token);

            if (res && res.data && Array.isArray(res.data)) {
                setDataBrand(res.data);
                setFilteredData(res.data);
                console.log("Branches loaded successfully:", res.data);
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
            />

            <AllBranch
                loadBranch={loadBranch}
                dataBranch={dataBranch}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    )
}

export default Branch