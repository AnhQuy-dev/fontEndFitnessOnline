import { Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { createRoom } from "../../../services/RoomService";

const { Option } = Select;

function CreateRoom(props) {
    const { loadRoom, isModalOpen, setIsModalOpen,token } = props;

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
    const [error, setErrors] = useState({});

    useEffect(() => {
        // Fetch Clubs
        const fetchAllClubs = async () => {
            try {
                const response = await fetch("http://localhost:8081/api/dashboard/clubs",{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setClubs(data.data);
            } catch (error) {
                console.error("Error fetching clubs:", error);
            }
        };

        // Fetch Trainers
        const fetchAllTrainer = async () => {
            try {
                const response = await fetch("http://localhost:8081/api/dashboard/trainers",{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setTrainers(data.data);
            } catch (error) {
                console.error("Error fetching trainers:", error);
            }
        };

        fetchAllClubs();
        fetchAllTrainer();
    }, []);

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "roomName":
                newErrors.roomName = value.trim() ? "" : "Room name is required.";
                break;
            case "slug":
                newErrors.slug = value.trim() ? "" : "Slug is required.";
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
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            roomName: roomName.trim() ? "" : "Room name is required.",
            slug: slug.trim() ? "" : "Slug is required.",
            capacity: capacity > 0 ? "" : "Capacity must be greater than 0.",
            facilities: facilities.trim() ? "" : "Facilities are required.",
            club: club ? "" : "Club is required.",
            trainer: trainer ? "" : "Trainer is required."
        };

        setErrors(newErrors);

        return Object.values(newErrors).some((err) => err);
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
        validateField(field, value);
    };

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting."
            });
            return;
        }

        const res = await createRoom(club, trainer, roomName, slug, capacity, facilities, status, startTime, endTime);

        if (res.data) {
            notification.success({
                message: "Create Room",
                description: "Room created successfully."
            });
            resetAndCloseModal();
            await loadRoom();
        } else {
            notification.error({
                message: "Error Creating Room",
                description: JSON.stringify(res.message)
            });
        }
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
                    <span>Slug</span>
                    <Input
                        value={slug}
                        onChange={(event) => { handleChange("slug", event.target.value); }}
                    />
                    {error.slug && <span style={{ color: "red" }}>{error.slug}</span>}
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
                    <span>Club</span>
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
