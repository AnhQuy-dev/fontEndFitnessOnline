import { useState } from "react";
import Input from "antd/es/input/Input";
import { Button, notification, Modal, Checkbox } from "antd";
import { createBrand } from "../../../services/BrandService";

function CreateBranch(props) {
    const { loadBranch, isModalOpen, setIsModalOpen } = props;

    const [branchName, setBranchName] = useState("");
    const [slug, setSlug] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [openHours, setOpenHours] = useState("");
    const [closeHours, setCloseHours] = useState("");
    const [services, setServices] = useState([]);

    const [error, setErrors] = useState({});

    const serviceOptions = ["GYM", "YOGA", "GROUPX", "DANCE", "TUMS", "CYCLING"];

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "branchName":
                newErrors.branchName = value.trim() ? "" : "Branch name is required.";
                break;
            case "address":
                newErrors.address = value.trim() ? "" : "Address is required.";
                break;
            case "phoneNumber":
                newErrors.phoneNumber = value.trim() ? "" : "Phone number is required.";
                break;
            case "email":
                newErrors.email = /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email format.";
                break;
            case "openHours":
                newErrors.openHours = value ? "" : "Open hour is required.";
                if (closeHours && value >= closeHours) {
                    newErrors.hours = "Close hour must be after open hour.";
                } else {
                    newErrors.hours = "";
                }
                break;
            case "closeHours":
                newErrors.closeHours = value ? "" : "Close hour is required.";
                if (openHours && openHours >= value) {
                    newErrors.hours = "Close hour must be after open hour.";
                } else {
                    newErrors.hours = "";
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            branchName: branchName.trim() ? "" : "Branch name is required.",
            address: address.trim() ? "" : "Address is required.",
            phoneNumber: phoneNumber.trim() ? "" : "Phone number is required.",
            email: /^\S+@\S+\.\S+$/.test(email) ? "" : "Invalid email format.",
            openHours: openHours ? "" : "Open hour is required.",
            closeHours: closeHours ? "" : "Close hour is required.",
            hours: (openHours && closeHours && openHours >= closeHours)
                ? "Close hour must be after open hour."
                : ""
        };

        setErrors(newErrors);

        return Object.values(newErrors).some((err) => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            branchName: setBranchName,
            slug: setSlug,
            address: setAddress,
            phoneNumber: setPhoneNumber,
            email: setEmail,
            openHours: setOpenHours,
            closeHours: setCloseHours,
            services: setServices,
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

        const res = await createBrand(branchName, slug, address, phoneNumber, email, openHours, closeHours, services);

        if (res.data) {
            notification.success({
                message: "Create Brand",
                description: "Brand created successfully."
            });
            resetAndCloseModal();
            await loadBranch();
        } else {
            notification.error({
                message: "Error Creating Brand",
                description: JSON.stringify(res.message)
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        setBranchName("");
        setSlug("");
        setAddress("");
        setPhoneNumber("");
        setEmail("");
        setOpenHours("");
        setCloseHours("");
        setServices([]);
        setErrors({});
    };

    return (
        <>
            <Modal
                title="Create A New Brand"
                open={isModalOpen}
                onOk={() => { handleSubmitBtn(); }}
                onCancel={() => { resetAndCloseModal(); }}
                okText={"Create"}
                cancelText={"No"}
                maskClosable={false}
            >
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                    <div>
                        <span>Branch Name</span>
                        <Input
                            value={branchName}
                            onChange={(event) => { handleChange("branchName", event.target.value); }}
                        />
                        {error.branchName && <span style={{ color: "red" }}>{error.branchName}</span>}
                    </div>
                    <div>
                        <span>Slug</span>
                        <Input
                            value={slug}
                            onChange={(event) => { handleChange("slug", event.target.value); }}
                        />
                    </div>
                    <div>
                        <span>Address</span>
                        <Input
                            value={address}
                            onChange={(event) => { handleChange("address", event.target.value); }}
                        />
                        {error.address && <span style={{ color: "red" }}>{error.address}</span>}
                    </div>
                    <div>
                        <span>Phone Number</span>
                        <Input
                            value={phoneNumber}
                            onChange={(event) => { handleChange("phoneNumber", event.target.value); }}
                        />
                        {error.phoneNumber && <span style={{ color: "red" }}>{error.phoneNumber}</span>}
                    </div>
                    <div>
                        <span>Email</span>
                        <Input
                            value={email}
                            onChange={(event) => { handleChange("email", event.target.value); }}
                        />
                        {error.email && <span style={{ color: "red" }}>{error.email}</span>}
                    </div>
                    <div>
                        <span>Open Hour</span>
                        <Input
                            type="time"
                            value={openHours}
                            onChange={(event) => { handleChange("openHours", event.target.value); }}
                        />
                        {error.openHours && <span style={{ color: "red" }}>{error.openHours}</span>}
                    </div>
                    <div>
                        <span>Close Hour</span>
                        <Input
                            type="time"
                            value={closeHours}
                            onChange={(event) => { handleChange("closeHours", event.target.value); }}
                        />
                        {error.closeHours && <span style={{ color: "red" }}>{error.closeHours}</span>}
                        {error.hours && <span style={{ color: "red" }}>{error.hours}</span>}
                    </div>
                    <div>
                        <span>Services</span>
                        <Checkbox.Group
                            options={serviceOptions}
                            value={services}
                            onChange={(checkedValues) => { handleChange("services", checkedValues); }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CreateBranch;
