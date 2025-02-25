import { useEffect, useState } from "react";
import { fetchAllTrainer } from "../../../services/TrainerService";
import AllTrainers from "./AllTrainers";
import CreateTrainer from "./CreateTrainer";

function Trainer() {
    const [dataTrainer, setDataTrainer] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Khởi tạo là mảng rỗng
    const [isModalOpen, setIsModelOpen] = useState(false);
    const tokenData = localStorage.getItem("tokenData");
    const { access_token } = JSON.parse(tokenData);

    const loadTrainers = async () => {
        try {
            const data = await fetchAllTrainer(access_token);
            console.log("Response data:", data);

            if (data && Array.isArray(data.data.data)) {
                setFilteredData(data.data.data);
                setDataTrainer(data.data.data);
                console.log("Trainers loaded successfully:", data.data.data);
            } else {
                console.error("Invalid data format received:", data);
                setDataTrainer([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error loading trainers:", error);
            setDataTrainer([]);
            setFilteredData([]);
        }
    }

    useEffect(() => {
        loadTrainers();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <CreateTrainer
                loadTrainers={loadTrainers}
                isModalOpen={isModalOpen}
                setIsModelOpen={setIsModelOpen}
                token={access_token}
            />

            <AllTrainers
                loadTrainers={loadTrainers}
                dataTrainer={dataTrainer}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                setIsModelOpen={setIsModelOpen}
                token={access_token}
            />
        </div>
    )
}

export default Trainer