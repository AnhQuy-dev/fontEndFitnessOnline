import { Input, Modal, notification, Select } from "antd";
import { useState } from "react";
import { registerUser } from "../../../serviceToken/authService";

const { Option } = Select;

function CreateUser(props) {
    const { loadUsers, isModalOpen, setIsModelOpen } = props;

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [gender, setGender] = useState("");
    const [status, setStatus] = useState(false); // Mặc định là false

    const [error, setErrors] = useState({});

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "fullName":
                newErrors.fullName = value.trim() ? "" : "Full name is required.";
                break;
            case "email":
                newErrors.email = value.trim() ? "" : "Email is required.";
                break;
            case "password":
                newErrors.password = value ? "" : "Password is required.";
                break;
            case "confirmPassword":
                newErrors.confirmPassword = value ? "" : "Confirm Password is required.";
                if (password && value !== password) {
                    newErrors.confirmPassword = "Passwords do not match.";
                }
                break;
            case "role":
                newErrors.role = value ? "" : "Role is required.";
                break;
            case "gender":
                newErrors.gender = value ? "" : "Gender is required.";
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            fullName: fullName.trim() ? "" : "Full name is required.",
            email: email.trim() ? "" : "Email is required.",
            password: password ? "" : "Password is required.",
            confirmPassword: confirmPassword ? "" : "Confirm Password is required.",
            role: role ? "" : "Role is required.",
            gender: gender ? "" : "Gender is required.",
        };

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.values(newErrors).some((err) => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            fullName: setFullName,
            email: setEmail,
            password: setPassword,
            confirmPassword: setConfirmPassword,
            role: setRole,
            gender: setGender,
            status: setStatus, // Xử lý status
        };

        setters[field]?.(value);
        validateField(field, value);
    };

    const handleSubmitBtn = async () => {
        if (validateAllFields()) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting."
            });
            return;
        }

        const newUserData = {
            fullName,
            email,
            password,
            confirmPassword,
            role,
            gender,
            status, // Mặc định false nếu không chọn
        };

        const res = await registerUser(newUserData);

        if (res.data) {
            notification.success({
                message: "Create User",
                description: "User created successfully."
            });
            resetAndCloseModal();
            await loadUsers();
        } else {
            notification.error({
                message: "Error Creating User",
                description: JSON.stringify(res.message)
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModelOpen(false);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setGender("");
        setStatus(false); // Reset về false khi đóng modal
        setErrors({});
    };

    return (
        <Modal
            title="Create A New User"
            open={isModalOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Create"
            cancelText="Cancel"
            maskClosable={false}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Full Name</span>
                    <Input value={fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                    {error.fullName && <span style={{ color: "red" }}>{error.fullName}</span>}
                </div>
                <div>
                    <span>Email</span>
                    <Input value={email} onChange={(e) => handleChange("email", e.target.value)} />
                    {error.email && <span style={{ color: "red" }}>{error.email}</span>}
                </div>
                <div>
                    <span>Password</span>
                    <Input.Password value={password} onChange={(e) => handleChange("password", e.target.value)} />
                    {error.password && <span style={{ color: "red" }}>{error.password}</span>}
                </div>
                <div>
                    <span>Confirm Password</span>
                    <Input.Password value={confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />
                    {error.confirmPassword && <span style={{ color: "red" }}>{error.confirmPassword}</span>}
                </div>
                <div>
                    <span>Role</span>
                    <Select value={role} onChange={(value) => handleChange("role", value)} style={{ width: "100%" }}>
                        <Option value="USER">USER</Option>
                        <Option value="MANAGER">MANAGER</Option>
                        <Option value="ADMIN">ADMIN</Option>
                        <Option value="TRAINER">TRAINER</Option>
                    </Select>
                    {error.role && <span style={{ color: "red" }}>{error.role}</span>}
                </div>
                <div>
                    <span>Gender</span>
                    <Select value={gender} onChange={(value) => handleChange("gender", value)} style={{ width: "100%" }}>
                        <Option value="MALE">MALE</Option>
                        <Option value="FEMALE">FEMALE</Option>
                        <Option value="OTHER">OTHER</Option>
                    </Select>
                    {error.gender && <span style={{ color: "red" }}>{error.gender}</span>}
                </div>
                <div>
                    <span>Status</span>
                    <Select value={status} onChange={(value) => handleChange("status", value)} style={{ width: "100%" }}>
                        <Option value={true}>ACTIVE</Option>
                        <Option value={false}>INACTIVE</Option>
                    </Select>
                </div>
            </div>
        </Modal>
    );
}

export default CreateUser;
