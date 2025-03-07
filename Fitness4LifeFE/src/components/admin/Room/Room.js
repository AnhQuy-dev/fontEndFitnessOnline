import { useEffect, useState } from "react";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchAllRooms } from "../../../serviceToken/RoomSERVICE";
import AllRoom from "./AllRoom";
import CreateRoom from "./CreateRoom";

function Room() {
    const [dataRoom, setDataRoom] = useState([]);
    const [filteredData, setFilteredData] = useState(dataRoom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tokenData = getTokenData();//tokenData.access_tokens




    useEffect(() => {
        loadRoom();
    }, []);

    const loadRoom = async () => {
        const response = await fetchAllRooms(tokenData.access_token);
        setFilteredData(response.data);
        setDataRoom(response.data);
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