import { Input, notification, Modal, TimePicker, Checkbox } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { updateBranch } from "../../../services/BrandService";

const UpdateBranch = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadBranch } = props;
    const [branchName, setBranchName] = useState("");
    const [slug, setSlug] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [openHours, setOpenHours] = useState(null);
    const [closeHours, setCloseHours] = useState(null);
    const [services, setServices] = useState([]);
    const [error, setErrors] = useState({});

    const serviceOptions = ["GYM", "YOGA", "GROUPX", "DANCE", "TUMS", "CYCLING"];

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "branchName":
                newErrors.branchName = value.trim() ? "" : "Branch name is required.";
                break;
            case "slug":
                newErrors.slug = value.trim() ? "" : "Slug is required.";
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
                newErrors.openHours = value ? "" : "Open hours are required.";
                if (closeHours && value.isAfter(closeHours)) {
                    newErrors.hours = "Close hours must be after open hours.";
                } else {
                    newErrors.hours = "";
                }
                break;
            case "closeHours":
                newErrors.closeHours = value ? "" : "Close hours are required.";
                if (openHours && openHours.isAfter(value)) {
                    newErrors.hours = "Close hours must be after open hours.";
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
            slug: slug.trim() ? "" : "Slug is required.",
            address: address.trim() ? "" : "Address is required.",
            phoneNumber: phoneNumber.trim() ? "" : "Phone number is required.",
            email: /^\S+@\S+\.\S+$/.test(email) ? "" : "Invalid email format.",
            openHours: openHours ? "" : "Open hours are required.",
            closeHours: closeHours ? "" : "Close hours are required.",
            hours: openHours && closeHours && openHours.isAfter(closeHours) ? "Close hours must be after open hours." : "",
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

    useEffect(() => {
        if (dataUpdate) {
            setBranchName(dataUpdate.branchName);
            setSlug(dataUpdate.slug || "");
            setAddress(dataUpdate.address);
            setPhoneNumber(dataUpdate.phoneNumber);
            setEmail(dataUpdate.email);
            setOpenHours(moment(dataUpdate.openHours, "HH:mm"));
            setCloseHours(moment(dataUpdate.closeHours, "HH:mm"));
            setServices(dataUpdate.services || []);
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


        const res = await updateBranch(
            dataUpdate.id,
            branchName,
            slug,
            address,
            phoneNumber,
            email,
            openHours ? openHours.format("HH:mm") : null,
            closeHours ? closeHours.format("HH:mm") : null,
            services
        );

        if (res.data) {
            notification.success({
                message: "Update Branch",
                description: "Branch updated successfully.",
            });
            resetAndCloseModal();
            await loadBranch();
        } else {
            notification.error({
                message: "Error Updating Branch",
                description: JSON.stringify(res.message),
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setBranchName("");
        setSlug("");
        setAddress("");
        setPhoneNumber("");
        setEmail("");
        setOpenHours(null);
        setCloseHours(null);
        setServices([]);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Edit Branch"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>

                <div>
                    <span>Branch Name</span>
                    <Input
                        value={branchName}
                        placeholder="Branch Name"
                        onChange={(e) => handleChange("branchName", e.target.value)}
                    />
                    {error.branchName && <span style={{ color: "red" }}>{error.branchName}</span>}
                </div>
                <div>
                    <span>Slug</span>
                    <Input
                        value={slug}
                        placeholder="Slug"
                        onChange={(e) => handleChange("slug", e.target.value)}
                    />
                    {error.slug && <span style={{ color: "red" }}>{error.slug}</span>}
                </div>
                <div>
                    <span>Address</span>
                    <Input
                        value={address}
                        placeholder="Address"
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                    {error.address && <span style={{ color: "red" }}>{error.address}</span>}
                </div>
                <div>
                    <span>Phone Number</span>
                    <Input
                        value={phoneNumber}
                        placeholder="Phone Number"
                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    />
                    {error.phoneNumber && <span style={{ color: "red" }}>{error.phoneNumber}</span>}
                </div>
                <div>
                    <span>Email</span>
                    <Input
                        value={email}
                        placeholder="Email"
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {error.email && <span style={{ color: "red" }}>{error.email}</span>}
                </div>
                <div>
                    <span>openHours</span>
                    <TimePicker
                        value={openHours}
                        format="HH:mm"
                        onChange={(time) => handleChange("openHours", time)}
                    />
                    {error.openHours && <span style={{ color: "red" }}>{error.openHours}</span>}
                </div>
                <div>
                    <span>closeHours</span>
                    <TimePicker
                        value={closeHours}
                        format="HH:mm"
                        onChange={(time) => handleChange("closeHours", time)}
                    />
                    {error.closeHours && <span style={{ color: "red" }}>{error.closeHours}</span>}
                    {error.hours && <span style={{ color: "red" }}>{error.hours}</span>}
                </div>
                <div>
                    <span>serviceOptions</span>
                    <Checkbox.Group
                        options={serviceOptions}
                        value={services}
                        onChange={(value) => handleChange("services", value)}
                    />
                    {error.services && <span style={{ color: "red" }}>{error.services}</span>}
                </div>
            </div>
        </Modal>
    );
};

export default UpdateBranch;
