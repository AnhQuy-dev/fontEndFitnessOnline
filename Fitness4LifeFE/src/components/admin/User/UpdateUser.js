import { Form, Input, notification, Modal, Select, Switch, Row, Col } from "antd";
import { useEffect } from "react";
import { updateUserAPI } from "../../../serviceToken/authService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const UpdateUser = ({ isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadUsers }) => {
    const [form] = Form.useForm();
    const tokenData = getTokenData();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                fullName: dataUpdate.fullName || "",
                role: dataUpdate.role || "",
                gender: dataUpdate.gender || "",
                status: dataUpdate.active ?? false,
                phone: dataUpdate.phone || "",
                hobbies: dataUpdate.profileDTO?.hobbies || "",
                address: dataUpdate.profileDTO?.address || "",
                age: dataUpdate.profileDTO?.age || "",
                maritalStatus: dataUpdate.profileDTO?.maritalStatus || "",
                description: dataUpdate.profileDTO?.description || "",
            });
        } else {
            form.resetFields();
        }
    }, [dataUpdate, form]);

    const handleSubmitBtn = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            Object.keys(values).forEach((key) => formData.append(key, values[key]));

            const fileInput = document.getElementById("fileInput");
            if (fileInput?.files.length > 0) {
                formData.append("file", fileInput.files[0]);
            }

            const response = await updateUserAPI(dataUpdate.id, formData, tokenData.access_token);
            notification.success({
                message: "Update User",
                description: "User updated successfully.",
            });
            resetAndCloseModal();
            await loadUsers();
        } catch (error) {
            notification.error({
                message: "Error Updating User",
                description: error.response?.data?.message || "An unexpected error occurred.",
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        form.resetFields();
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Edit User"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
            width={700} // Tăng chiều rộng modal
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Account Status" name="status" valuePropName="checked">
                            <Switch checkedChildren="Unlock" unCheckedChildren="Lock" />
                        </Form.Item>

                        <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Full name is required." }]}>
                            <Input placeholder="Full Name" />
                        </Form.Item>

                        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Phone number is required." }]}>
                            <Input placeholder="Phone" />
                        </Form.Item>

                        <Form.Item label="Hobbies" name="hobbies">
                            <Input placeholder="Hobbies" />
                        </Form.Item>

                        <Form.Item label="Age" name="age" rules={[{ required: true, message: "Valid age is required." }]}>
                            <Input type="number" placeholder="Age" />
                        </Form.Item>

                        <Form.Item label="Marital Status" name="maritalStatus" rules={[{ required: true, message: "Marital status is required." }]}>
                            <Select placeholder="Marital Status">
                                <Select.Option value="SINGLE">Single</Select.Option>
                                <Select.Option value="MARRIED">Married</Select.Option>
                                <Select.Option value="FA">Forever Alone</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Role" name="role" rules={[{ required: true, message: "Role is required." }]}>
                            <Select placeholder="Role">
                                <Select.Option value="ADMIN">Admin</Select.Option>
                                <Select.Option value="USER">User</Select.Option>
                                <Select.Option value="MANAGER">Manager</Select.Option>
                                <Select.Option value="TRAINER">Trainer</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Gender is required." }]}>
                            <Select placeholder="Gender">
                                <Select.Option value="MALE">Male</Select.Option>
                                <Select.Option value="FEMALE">Female</Select.Option>
                                <Select.Option value="OTHER">Other</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Address" name="address">
                            <Input placeholder="Address" />
                        </Form.Item>

                        <Form.Item label="Description" name="description">
                            <Input placeholder="Description" />
                        </Form.Item>

                        <Form.Item label="Profile Picture" name="file" valuePropName="file">
                            <Input id="fileInput" type="file" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateUser;
