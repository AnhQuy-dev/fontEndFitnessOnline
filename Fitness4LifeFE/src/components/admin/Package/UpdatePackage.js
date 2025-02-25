import { Input, Modal, Select, notification } from "antd";
import { useState, useEffect } from "react";
import { updatePackage } from "../../../services/PackageService";

const { Option } = Select;

const UpdatePackage = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadPackage } = props;

    const [packageName, setPackageName] = useState("");
    const [description, setDescription] = useState("");
    const [durationMonth, setDurationMonth] = useState(0);
    const [price, setPrice] = useState(0);
    const [error, setErrors] = useState({});

    // Enum options for packageName
    const packageOptions = [
        "CLASSIC",
        "CLASSIC_PLUS",
        "PRESIDENT",
        "ROYAL",
        "SIGNATURE",
    ];

    useEffect(() => {
        if (dataUpdate) {
            setPackageName(dataUpdate.packageName || "");
            setDescription(dataUpdate.description || "");
            setDurationMonth(dataUpdate.durationMonth || 0);
            setPrice(dataUpdate.price || 0);
        }
    }, [dataUpdate]);

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "packageName":
                newErrors.packageName = value ? "" : "Package name is required.";
                break;
            case "description":
                newErrors.description = value.trim() ? "" : "Description is required.";
                break;
            case "durationMonth":
                newErrors.durationMonth =
                    Number(value) > 0 ? "" : "Duration must be greater than 0.";
                break;
            case "price":
                newErrors.price = Number(value) > 0 ? "" : "Price must be greater than 0.";
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            packageName: packageName ? "" : "Package name is required.",
            description: description.trim() ? "" : "Description is required.",
            durationMonth: Number(durationMonth) > 0 ? "" : "Duration must be greater than 0.",
            price: Number(price) > 0 ? "" : "Price must be greater than 0.",
        };

        setErrors(newErrors);
        return Object.values(newErrors).some((err) => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            packageName: setPackageName,
            description: setDescription,
            durationMonth: setDurationMonth,
            price: setPrice,
        };

        setters[field]?.(value);
        validateField(field, value);
    };

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
            });
            return;
        }

        try {
            const res = await updatePackage(
                dataUpdate.id,
                packageName,
                description,
                Number(durationMonth),
                Number(price)
            );

            if (res.data) {
                notification.success({
                    message: "Update Package",
                    description: "Package updated successfully.",
                });
                resetAndCloseModal();
                await loadPackage();
            } else {
                throw new Error(res.data?.message || "Unknown error occurred.");
            }
        } catch (error) {
            notification.error({
                message: "Error Updating Package",
                description: error.message || "Something went wrong.",
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setPackageName("");
        setDescription("");
        setDurationMonth(0);
        setPrice(0);
        setErrors({});
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update Package"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Package Name</span>
                    <Select
                        value={packageName}
                        onChange={(value) => handleChange("packageName", value)}
                        style={{ width: "100%" }}
                        placeholder="Select a package name"
                    >
                        {packageOptions.map((option) => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                    {error.packageName && <span style={{ color: "red" }}>{error.packageName}</span>}
                </div>
                <div>
                    <span>Description</span>
                    <Input
                        value={description}
                        placeholder="Description"
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                    {error.description && <span style={{ color: "red" }}>{error.description}</span>}
                </div>
                <div>
                    <span>Duration Month</span>
                    <Input
                        type="number"
                        value={durationMonth}
                        placeholder="Duration (months)"
                        onChange={(e) => handleChange("durationMonth", e.target.value)}
                    />
                    {error.durationMonth && <span style={{ color: "red" }}>{error.durationMonth}</span>}
                </div>
                <div>
                    <span>Price</span>
                    <Input
                        type="number"
                        value={price}
                        placeholder="Price"
                        onChange={(e) => handleChange("price", e.target.value)}
                    />
                    {error.price && <span style={{ color: "red" }}>{error.price}</span>}
                </div>





            </div>
        </Modal>
    );
};

export default UpdatePackage;
