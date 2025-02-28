// import { useEffect, useState } from "react";
// import AllTrainers from "./AllTrainers";
// import CreateTrainer from "./CreateTrainer";
// import { getTokenData } from "../../../serviceToken/tokenUtils";
// import { fetchAllTrainer } from "../../../serviceToken/TrainerService";

// function Trainer() {
//     const [dataTrainer, setDataTrainer] = useState([]);
//     const [filteredData, setFilteredData] = useState([]); // Khởi tạo là mảng rỗng
//     const [isModalOpen, setIsModelOpen] = useState(false);

//     const tokenData = getTokenData();//tokenData.access_token

//     const loadTrainers = async () => {
//         try {
//             const response = await fetchAllTrainer(tokenData.access_token);
//             console.log("Response data:", response);

//             if (response && Array.isArray(response.data)) {
//                 setFilteredData(response.data);
//                 setDataTrainer(response.data);
//                 console.log("Trainers loaded successfully:", response.data);
//             } else {
//                 console.error("Invalid data format received:", response);
//                 setDataTrainer([]);
//                 setFilteredData([]);
//             }
//         } catch (error) {
//             console.error("Error loading trainers:", error);
//             setDataTrainer([]);
//             setFilteredData([]);
//         }
//     }

//     useEffect(() => {
//         loadTrainers();
//     }, []);

//     return (
//         <div style={{ padding: "20px" }}>
//             <CreateTrainer
//                 loadTrainers={loadTrainers}
//                 isModalOpen={isModalOpen}
//                 setIsModelOpen={setIsModelOpen}
//             />

//             <AllTrainers
//                 loadTrainers={loadTrainers}
//                 dataTrainer={dataTrainer}
//                 filteredData={filteredData}
//                 setFilteredData={setFilteredData}
//                 setIsModelOpen={setIsModelOpen}
//             />
//         </div>
//     )
// }

// export default Trainer