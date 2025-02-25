

import { useEffect, useState } from "react";
import { fetchAllPackage } from "../../../services/PackageService";
import AllPackage from "./AllPackage";
import CreatePackage from "./CreatePackage";
import { getTokenData } from "../../../serviceToken/tokenUtils";

function Package() {
    const [dataPackage, setDataPackage] = useState([]);
    const [filteredData, setFilteredData] = useState(dataPackage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        loadPackage();
    }, []);

    const loadPackage = async () => {
        const tokenData = getTokenData();
        // console.log("t", tokenData.access_token);
        const res = await fetchAllPackage(tokenData.access_token);
        console.log("txx", res);
        setFilteredData(res.data);
        setDataPackage(res.data);
        console.log(">>>CHeck RES", res);

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