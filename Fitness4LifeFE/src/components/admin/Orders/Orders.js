import { useEffect, useState } from "react";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchPaymentStatistics } from "../../../serviceToken/StaticsticsSERVICE";
import AllOrders from "./AllOrders";

function Order() {
    const [dataOrders, setDataOrders] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tokenData = getTokenData(); //tokenData.access_token
    console.log("oderdata", dataOrders);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await fetchPaymentStatistics(tokenData.access_token);
            console.log("response", response.data.data);

            setDataOrders(response.data.data);
            setFilteredData(response.data.data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <AllOrders
                loadOrders={loadOrders}
                dataOrders={dataOrders}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    );
}

export default Order;