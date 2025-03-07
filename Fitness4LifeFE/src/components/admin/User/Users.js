import { useEffect, useState } from "react";
import CreateUser from "./CreateUser";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchAllUsers } from "../../../serviceToken/authService";
import AllUsers from "./AllUsers";

function Users() {
    const [dataUsers, setDataUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const tokenData = getTokenData();
    const loadUsers = async () => {
        try {
            const response = await fetchAllUsers(tokenData.access_token);
            if (Array.isArray(response)) {  // Kiểm tra có phải mảng không
                setDataUsers(response);
                setFilteredData(response);
                console.log("dataUsers",dataUsers);
                
            } else {
                console.error("Invalid data format received:", response);
                setDataUsers([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading users:", error);
            setDataUsers([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);


    return (
        <div style={{ padding: "20px" }}>
            <CreateUser
                loadUsers={loadUsers}
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
            />

            <AllUsers
                loadUsers={loadUsers}
                dataUsers={dataUsers}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModelOpen={setIsModelOpen}
            />
        </div>
    )
}

export default Users