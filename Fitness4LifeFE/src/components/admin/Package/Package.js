

import { useEffect, useState } from "react";
import AllPackage from "./AllPackage";
import CreatePackage from "./CreatePackage";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchAllPackage } from "../../../serviceToken/PackageService";

function Package() {
    const [dataPackage, setDataPackage] = useState([]);
    const [filteredData, setFilteredData] = useState(dataPackage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tokenData = getTokenData();//tokenData.access_token

    useEffect(() => {
        loadPackage();
    }, []);

    const loadPackage = async () => {
        const response = await fetchAllPackage(tokenData.access_token);
        console.log('fetchAllPackage response:', response); // Ad
        setFilteredData(response.data);
        setDataPackage(response.data);
    }

    return (
        <div style={{ padding: "20px" }}>

            <CreatePackage
                loadPackage={loadPackage}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />

            <AllPackage
                loadPackage={loadPackage}
                dataPackage={dataPackage}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModalOpen={setIsModalOpen}
            />
        </div>

    )
}

export default Package