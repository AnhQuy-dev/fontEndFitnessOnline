import { Input, notification, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateClubApi } from "../../../services/ClubService";
import { AddMoreImageClub } from "../../../serviceToken/ClubService";

const UpdateClub = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadClubs } = props;
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [description, setDescription] = useState("");
    const [openHour, setOpenHour] = useState("");
    const [closeHour, setCloseHour] = useState("");
    const [file, setFile] = useState(null);

    const [error, setErrors] = useState({});

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "name":
                newErrors.name = value.trim() ? "" : "Club name is required.";
                break;
            case "address":
                newErrors.address = value.trim() ? "" : "Address is required.";
                break;
            case "contactPhone":
                newErrors.contactPhone = value.trim() ? "" : "Contact phone is required.";
                break;
            case "description":
                newErrors.description = value.trim() ? "" : "Description is required.";
                break;
            case "openHour":
                newErrors.openHour = value ? "" : "Open hour is required.";
                if (closeHour && value >= closeHour) {
                    newErrors.hours = "Close hour must be after open hour.";
                } else {
                    newErrors.hours = "";
                }
                break;
            case "closeHour":
                newErrors.closeHour = value ? "" : "Close hour is required.";
                if (openHour && openHour >= value) {
                    newErrors.hours = "Close hour must be after open hour.";
                } else {
                    newErrors.hours = "";
                }
                break;
            case "file":
                if (value && !/\.(jpg|jpeg|png)$/i.test(value.name)) {
                    newErrors.file = "File must be a .jpg, .jpeg, or .png image.";
                } else {
                    newErrors.file = "";
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            name: name.trim() ? "" : "Club name is required.",
            address: address.trim() ? "" : "Address is required.",
            contactPhone: contactPhone.trim() ? "" : "Contact phone is required.",
            description: description.trim() ? "" : "Description is required.",
            openHour: openHour ? "" : "Open hour is required.",
            closeHour: closeHour ? "" : "Close hour is required.",
            hours: openHour && closeHour && openHour >= closeHour ? "Close hour must be after open hour." : "",
        };

        if (file && !/\.(jpg|jpeg|png)$/i.test(file.name)) {
            newErrors.file = "File must be a .jpg, .jpeg, or .png image.";
        }

        setErrors(newErrors);
        return Object.values(newErrors).some((err) => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            name: setName,
            address: setAddress,
            contactPhone: setContactPhone,
            description: setDescription,
            openHour: setOpenHour,
            closeHour: setCloseHour,
            file: setFile,
        };

        setters[field]?.(value);
        validateField(field, value);
    };

    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate.id);
            setName(dataUpdate.name);
            setAddress(dataUpdate.address);
            setContactPhone(dataUpdate.contactPhone);
            setDescription(dataUpdate.description);
            setOpenHour(dataUpdate.openHour);
            setCloseHour(dataUpdate.closeHour);
        }
    }, [dataUpdate]);

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
            });
            return;
        }

        const res = await updateClubApi(id, name, address, contactPhone, description, openHour, closeHour);
        if (res.data.data) {
            notification.success({
                message: "Update Club",
                description: "Club updated successfully.",
            });

            if (file) {
                const imageFormData = new FormData();
                imageFormData.append("clubId", id);
                imageFormData.append("file", file);

                const imageRes = await AddMoreImageClub(imageFormData);
                if (imageRes.data) {
                    notification.success({
                        message: "Image Upload",
                        description: "Club image uploaded successfully.",
                    });
                } else {
                    notification.error({
                        message: "Error Uploading Image",
                        description: "Image upload failed.",
                    });
                }
            }

            resetAndCloseModal();
            await loadClubs();
        } else {
            notification.error({
                message: "Error Updating Club",
                description: JSON.stringify(res.message),
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setId("");
        setName("");
        setAddress("");
        setContactPhone("");
        setDescription("");
        setOpenHour("");
        setCloseHour("");
        setFile(null);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Edit Club"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>ID</span>
                    <Input value={id} disabled />
                </div>
                <div>
                    <span>Club Name</span>
                    <Input
                        value={name}
                        placeholder="Club Name"
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </div>
                <div>
                    <span>Address</span>
                    <Input
                        value={address}
                        placeholder="Address"
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </div>
                <div>

                    <span>Contact Phone</span>
                    <Input
                        value={contactPhone}
                        placeholder="Contact Phone"
                        onChange={(e) => handleChange("contactPhone", e.target.value)}
                    />
                </div>
                <div>


                    <span>Description</span>
                    <Input
                        value={description}
                        placeholder="Description"
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </div>
                <div>
                    <span>Open Hour</span>
                    <Input
                        type="time"
                        value={openHour}
                        onChange={(e) => handleChange("openHour", e.target.value)}
                    />
                </div>
                <div>
                    <span>Close Hour</span>
                    <Input
                        type="time"
                        value={closeHour}
                        onChange={(e) => handleChange("closeHour", e.target.value)}
                    />
                </div>
                <div>
                    <span>Upload Image</span>
                    <Input
                        type="file"
                        onChange={(e) => handleChange("file", e.target.files[0])}
                    />
                </div>
                {error.file && <span style={{ color: "red" }}>{error.file}</span>}
            </div>
        </Modal>
    );
};

export default UpdateClub;