import { Button, Checkbox, Form, Input, Modal, Select, message, notification } from "antd";
import { useState } from "react";
import { createOnePackage } from "../../../serviceToken/PackageSERVICE";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const { Option } = Select;

function CreatePackage(props) {
    const { loadPackage, isModalOpen, setIsModalOpen } = props;

    const [packageName, setPackageName] = useState("");
    const [description, setDescription] = useState("");
    const [durationMonth, setDurationMonth] = useState("");
    const [price, setPrice] = useState("");
    const [error, setErrors] = useState({});
    const tokenData = getTokenData();//tokenData.access_token

    // Enum options for packageName
    const packageOptions = [
        "CLASSIC",
        "CLASSIC_PLUS",
        "PRESIDENT",
        "ROYAL",
        "SIGNATURE",
    ];

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
                newErrors.durationMonth = Number(value) > 0 ? "" : "Duration must be greater than 0.";
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
            const PackageDataPayload = {
                packageName,
                description,
                durationMonth: Number(durationMonth),
                price: Number(price)

            }

            const res = await createOnePackage(PackageDataPayload, tokenData.access_token);

            if (res?.data?.data) {
                notification.success({
                    message: "Create Package",
                    description: "Package created successfully.",
                });
                resetAndCloseModal(); // Đóng modal sau khi tạo thành công
                await loadPackage(); // Tải lại danh sách gói tập
            } else {
                notification.error({
                    message: "Error Creating Package",
                    description: res?.data?.message || "Unexpected error occurred.",
                });
            }
        } catch (error) {
            // Xử lý lỗi thực tế từ API
            notification.error({
                message: "Error Creating Package",
                description: error.response?.data?.message || error.message || "Unexpected error occurred.",
            });
        }
    };
    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        setPackageName("");
        setDescription("");
        setDurationMonth("");
        setPrice("");
        setErrors({});
    };


    return (
        <Modal
            title="Create A New Package"
            open={isModalOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText={"Create"}
            cancelText={"Cancel"}
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
                        onChange={(event) => handleChange("description", event.target.value)}
                    />
                    {error.description && <span style={{ color: "red" }}>{error.description}</span>}
                </div>
                <div>
                    <span>Duration (Months)</span>
                    <Input
                        type="number"
                        min="1"
                        value={durationMonth}
                        onChange={(event) => handleChange("durationMonth", event.target.value)}
                    />
                    {error.durationMonth && <span style={{ color: "red" }}>{error.durationMonth}</span>}
                </div>
                <div>
                    <span>Price (VND)</span>

                    <Input
                        rules={[
                            {
                                required: true,
                                message: 'pls, Input inside....'
                            }
                        ]}
                        type="number"
                        min="1"
                        value={price}
                        onChange={(event) => handleChange("price", event.target.value)}
                    />
                    {error.price && <span style={{ color: "red" }}>{error.price}</span>}
                </div>
            </div>
        </Modal>


    );
}

export default CreatePackage;
