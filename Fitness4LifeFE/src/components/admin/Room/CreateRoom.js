import { Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { createRoom } from "../../../serviceToken/RoomSERVICE";
import { fetchAllTrainer } from "../../../serviceToken/TrainerSERVICE";
import { fetchAllClubs } from "../../../serviceToken/ClubService";
import { fetchAllRooms } from "../../../serviceToken/RoomSERVICE"; // Import the function to fetch all rooms

const { Option } = Select;

function CreateRoom(props) {
    const { loadRoom, isModalOpen, setIsModalOpen, token } = props;

    const [club, setClub] = useState(0);
    const [trainer, setTrainer] = useState(0);
    const [roomName, setRoomName] = useState("");
    const [slug, setSlug] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [facilities, setFacilities] = useState("");
    const [status, setStatus] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [clubs, setClubs] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [existingRooms, setExistingRooms] = useState([]);
    const [error, setErrors] = useState({});
    const tokenData = getTokenData();

    // useEffect để fetch clubs
    const getClubs = async () => {
        try {
            // Kiểm tra token
            if (!tokenData || !tokenData.access_token) {
                console.error("Access token không có sẵn");
                return;
            }

            const response = await fetchAllClubs(tokenData.access_token);
            console.log("Clubs data loaded:", response.data);

            if (response && response.data) {
                setClubs(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải clubs:", error);
            setClubs([]);
        }
    };

    // useEffect để fetch trainers
    const getTrainers = async () => {
        try {
            // Kiểm tra token
            if (!tokenData || !tokenData.access_token) {
                console.error("Access token không có sẵn");
                return;
            }

            const response = await fetchAllTrainer(tokenData.access_token);
            if (response && response.data) {
                setTrainers(response.data);
                console.log("Trainers data loaded:", response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải trainers:", error);
            setTrainers([]);
        }
    };

    // useEffect để fetch existing rooms
    const getExistingRooms = async () => {
        try {
            // Kiểm tra token
            if (!tokenData || !tokenData.access_token) {
                console.error("Access token không có sẵn");
                return;
            }

            const response = await fetchAllRooms(tokenData.access_token);
            if (response && response.data) {
                setExistingRooms(response.data);
                console.log("Existing rooms loaded:", response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách phòng:", error);
            setExistingRooms([]);
        }
    };

    // Thêm console.log để kiểm tra existingRooms đã load thành công chưa
    useEffect(() => {
        console.log("Danh sách phòng hiện có:", existingRooms);
    }, [existingRooms]);

    useEffect(() => {
        getClubs();
        getTrainers();
        getExistingRooms();
    }, [tokenData.access_token]);

    // Hàm kiểm tra xem có phòng trùng tên và giờ bắt đầu không
    const checkDuplicateRoom = (name, time) => {
        if (!name || !time || existingRooms.length === 0) return false;

        return existingRooms.some(room =>
            room.roomName === name && room.startTime === time
        );
    };

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "roomName":
                newErrors.roomName = value.trim() ? "" : "Room name is required.";
                // Kiểm tra trùng lặp khi người dùng thay đổi tên phòng
                if (value && startTime && checkDuplicateRoom(value, startTime)) {
                    newErrors.roomName = "A room with this name and start time already exists.";
                }
                break;
            case "capacity":
                newErrors.capacity = value > 0 ? "" : "Capacity must be greater than 0.";
                break;
            case "facilities":
                newErrors.facilities = value.trim() ? "" : "Facilities are required.";
                break;
            case "club":
                newErrors.club = value ? "" : "Club is required.";
                break;
            case "trainer":
                newErrors.trainer = value ? "" : "Trainer is required.";
                break;
            case "startTime":
                newErrors.startTime = value.trim() ? "" : "Start time is required.";
                // Kiểm tra trùng lặp khi người dùng thay đổi thời gian bắt đầu
                if (roomName && value && checkDuplicateRoom(roomName, value)) {
                    newErrors.startTime = "A room with this name and start time already exists.";
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            roomName: roomName.trim() ? "" : "Room name is required.",
            capacity: capacity > 0 ? "" : "Capacity must be greater than 0.",
            facilities: facilities.trim() ? "" : "Facilities are required.",
            club: club ? "" : "Club is required.",
            trainer: trainer ? "" : "Trainer is required.",
            startTime: startTime.trim() ? "" : "Start time is required."
        };

        // Kiểm tra xem có phòng nào trùng tên và giờ bắt đầu không
        if (roomName && startTime) {
            const isDuplicate = checkDuplicateRoom(roomName, startTime);
            if (isDuplicate) {
                newErrors.roomName = "A room with this name and start time already exists.";
                newErrors.startTime = "Please use a different name or start time.";
            }
        }

        setErrors(newErrors);

        return Object.values(newErrors).some(err => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            roomName: setRoomName,
            slug: setSlug,
            capacity: setCapacity,
            facilities: setFacilities,
            status: setStatus,
            club: setClub,
            trainer: setTrainer,
            startTime: setStartTime,
            endTime: setEndTime
        };

        setters[field]?.(value);

        // Validate trường hiện tại
        validateField(field, value);

        // Nếu thay đổi roomName hoặc startTime, cần validate cả hai trường
        if (field === "roomName" && startTime) {
            validateField("startTime", startTime);
        } else if (field === "startTime" && roomName) {
            validateField("roomName", roomName);
        }
    };

    const validateRoomBooking = () => {
        if (!existingRooms || existingRooms.length === 0) {
            return true;
        }

        const isRoomBooked = existingRooms.some(room =>
            room.roomName === roomName &&
            (
                (startTime >= room.startTime && startTime < room.endTime) || // StartTime bị chồng lấn
                (endTime > room.startTime && endTime <= room.endTime) ||    // EndTime bị chồng lấn
                (startTime <= room.startTime && endTime >= room.endTime)    // Trường hợp bao trùm toàn bộ
            )
        );

        if (isRoomBooked) {
            alert(`Phòng ${roomName} đã được đặt trong khoảng thời gian này. Vui lòng chọn thời gian khác!`);
            return false;
        }

        return true; // Nếu không có xung đột, cho phép đặt phòng
    };


    const handleSubmitBtn = async () => {
        if (!validateRoomBooking()) {
            return; // Nếu có lỗi đặt phòng, dừng lại
        }

        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting."
            });
            return;
        }

        const RoomDataPayload = {
            club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime
        };

        console.log("RoomDataPayload:", RoomDataPayload);

        // try {
        //     const res = await createRoom(RoomDataPayload, tokenData.access_token); // Gọi API đúng cách

        //     if (res && res.data) {
        //         notification.success({
        //             message: "Create Room",
        //             description: "Room created successfully."
        //         });
        //         resetAndCloseModal();
        //         await loadRoom();
        //     } else {
        //         throw new Error(res.message || "Unknown error");
        //     }
        // } catch (error) {
        //     notification.error({
        //         message: "Error Creating Room",
        //         description: error.message
        //     });
        // }
    };

    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        setClub(0);
        setTrainer(0);
        setRoomName("");
        setSlug("");
        setCapacity(0);
        setFacilities("");
        setStatus(false);
        setStartTime("");
        setEndTime("");
        setErrors({});
    };

    return (
        <Modal
            title="Create A New Room"
            open={isModalOpen}
            onOk={() => { handleSubmitBtn(); }}
            onCancel={() => { resetAndCloseModal(); }}
            okText={"Create"}
            cancelText={"Cancel"}
            maskClosable={false}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Room Name</span>
                    <Input
                        value={roomName}
                        onChange={(event) => { handleChange("roomName", event.target.value); }}
                    />
                    {error.roomName && <span style={{ color: "red" }}>{error.roomName}</span>}
                </div>
                <div>
                    <span>Capacity</span>
                    <Input
                        type="number"
                        value={capacity}
                        onChange={(event) => { handleChange("capacity", event.target.value); }}
                    />
                    {error.capacity && <span style={{ color: "red" }}>{error.capacity}</span>}
                </div>
                <div>
                    <span>Facilities</span>
                    <Input
                        value={facilities}
                        onChange={(event) => { handleChange("facilities", event.target.value); }}
                    />
                    {error.facilities && <span style={{ color: "red" }}>{error.facilities}</span>}
                </div>
                <div>
                    <span>club</span>
                    <Select
                        value={club}
                        onChange={(value) => { handleChange("club", value); }}
                        style={{ width: "100%" }}
                    >
                        {clubs.map((clubItem) => (
                            <Option key={clubItem.id} value={clubItem.id}>
                                {clubItem.name}
                            </Option>
                        ))}
                    </Select>
                    {error.club && <span style={{ color: "red" }}>{error.club}</span>}
                </div>
                <div>
                    <span>Trainer</span>
                    <Select
                        value={trainer}
                        onChange={(value) => { handleChange("trainer", value); }}
                        style={{ width: "100%" }}
                    >
                        {trainers.map((trainerItem) => (
                            <Option key={trainerItem.id} value={trainerItem.id}>
                                {trainerItem.fullName}
                            </Option>
                        ))}
                    </Select>
                    {error.trainer && <span style={{ color: "red" }}>{error.trainer}</span>}
                </div>
                <div>
                    <span>Status</span>
                    <Select
                        value={status ? "Active" : "Inactive"}
                        onChange={(value) => { handleChange("status", value === "Active"); }}
                        style={{ width: "100%" }}
                    >
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                </div>
                <div>
                    <span>Start Time</span>
                    <Input
                        type="time"
                        value={startTime}
                        onChange={(event) => { handleChange("startTime", event.target.value); }}
                    />
                    {error.startTime && <span style={{ color: "red" }}>{error.startTime}</span>}
                </div>
                <div>
                    <span>End Time</span>
                    <Input
                        type="time"
                        value={endTime}
                        onChange={(event) => { handleChange("endTime", event.target.value); }}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default CreateRoom;