import { useEffect, useState } from "react";
import AllRoom from "./AllRoom";
import CreateRoom from "./CreateRoom";
import { fetchAllRoom } from "../../../serviceToken/RoomService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

function Room() {
    const [dataRoom, setDataRoom] = useState([]);
    const [filteredData, setFilteredData] = useState(dataRoom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tokenData = getTokenData();//tokenData.access_token

    useEffect(() => {
        loadRoom();
    }, []);

    const loadRoom = async () => {
        const reponse = await fetchAllRoom(tokenData.access_token);
        setFilteredData(reponse.data);
        setDataRoom(reponse.data);
    }

    return (
        <div style={{ padding: "20px" }}>

            <CreateRoom
                loadRoom={loadRoom}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />

            <AllRoom
                loadRoom={loadRoom}
                dataRoom={dataRoom}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModalOpen={setIsModalOpen}
            />
        </div>

    )
}

export default Room