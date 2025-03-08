import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, notification, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchAllBranch } from "../../../serviceToken/BrachSERVICE";
import { createTrainer } from "../../../serviceToken/TrainerSERVICE";

const { Option } = Select;

const scheduleOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
];

const CreateTrainer = ({ isModalOpen, setIsModelOpen, loadTrainers }) => {
    const [form] = Form.useForm();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]); // Separate state for file management
    const tokenData = getTokenData();

    useEffect(() => {
        const getAllBranch = async () => {
            try {
                const dataBranch = await fetchAllBranch(tokenData.access_token);
                setBranches(dataBranch.data);
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "Failed to fetch branches."
                });
            }
        };

        getAllBranch();
    }, [tokenData.access_token]);

    // Reset form and file list when modal closes or opens
    useEffect(() => {
        if (!isModalOpen) {
            form.resetFields();
            setFileList([]);
        }
    }, [isModalOpen, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            // Create FormData object
            const formData = new FormData();
            formData.append("fullName", values.fullName);
            formData.append("slug", values.slug);
            formData.append("specialization", values.specialization);
            formData.append("experienceYear", values.experienceYear);
            formData.append("certificate", values.certificate);
            formData.append("phoneNumber", values.phoneNumber);
            formData.append("branch", values.branch);

            if (values.scheduleTrainers && values.scheduleTrainers.length > 0) {
                values.scheduleTrainers.forEach(day => {
                    formData.append("scheduleTrainers", day);
                });
            }

            if (fileList && fileList.length > 0) {
                const fileObj = fileList[0].originFileObj || fileList[0];
                formData.append("file", fileObj);
            }

            const res = await createTrainer(formData, tokenData.access_token);

            if (res.data) {
                notification.success({
                    message: "Create Trainer",
                    description: "Trainer created successfully."
                });
                form.resetFields();
                setFileList([]);
                setIsModelOpen(false);
                await loadTrainers();
            } else {
                notification.error({
                    message: "Error Creating Trainer",
                    description: res.message || "Failed to create trainer."
                });
            }
        } catch (error) {
            console.error("Form submission error:", error);
            notification.error({
                message: "Validation Error",
                description: error.message || "Please check the form fields."
            });
        } finally {
            setLoading(false);
        }
    };

    const onClose = () => {
        form.resetFields();
        setFileList([]);
        setIsModelOpen(false);
    };

    // Handle file changes directly
    const handleFileChange = ({ fileList: newFileList }) => {
        console.log("File change detected:", newFileList);
        setFileList(newFileList);
    };

    // Prevent auto upload and do custom file validation if needed
    const beforeUpload = (file) => {
        console.log("File selected:", file);
        // Optional: Add file validation here if needed

        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            notification.error({
                message: 'Upload Error',
                description: 'You can only upload image files!'
            });
            return Upload.LIST_IGNORE;
        }

        // Validate file size (e.g., limit to 5MB)
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            notification.error({
                message: 'Upload Error',
                description: 'Image must be smaller than 5MB!'
            });
            return Upload.LIST_IGNORE;
        }

        return false; // Return false to prevent auto upload
    };

    return (
        <Modal
            title="Create A New Trainer"
            open={isModalOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width="60%"
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    experienceYear: 0
                }}
            >
                <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: "Full name is required." }]}
                >
                    <Input placeholder="Enter trainer's full name" />
                </Form.Item>

                <Form.Item
                    name="slug"
                    label="Slug"
                    rules={[{ required: true, message: "Slug is required." }]}
                >
                    <Input placeholder="Enter slug" />
                </Form.Item>

                <Form.Item
                    name="specialization"
                    label="Specialization"
                    rules={[{ required: true, message: "Specialization is required." }]}
                >
                    <Input placeholder="Enter specialization" />
                </Form.Item>

                <Form.Item
                    name="experienceYear"
                    label="Experience Year"
                    rules={[
                        { required: true, message: "Experience year is required." },
                    ]}
                >
                    <Input type="number" placeholder="Enter years of experience" />
                </Form.Item>

                <Form.Item
                    name="certificate"
                    label="Certificate"
                    rules={[{ required: true, message: "Certificate is required." }]}
                >
                    <Input placeholder="Enter certificate details" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: "Phone number is required." }]}
                >
                    <Input placeholder="Enter phone number" />
                </Form.Item>

                <Form.Item
                    name="branch"
                    label="Club"
                    rules={[{ required: true, message: "Club is required." }]}
                >
                    <Select placeholder="Select branch">
                        {branches.map((branchItem) => (
                            <Option key={branchItem.id} value={branchItem.id}>
                                {branchItem.branchName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="scheduleTrainers"
                    label="Schedule"
                    rules={[{ required: true, message: "Schedule is required." }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select working days"
                        options={scheduleOptions}
                    />
                </Form.Item>

                <Form.Item
                    label="Profile Image"
                    name="fileUpload" // Changed to a different name to avoid conflicts
                    rules={[{ required: true, message: "Profile image is required." }]}
                >
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        accept="image/*"
                        onRemove={() => setFileList([])}
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Create Trainer
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateTrainer;