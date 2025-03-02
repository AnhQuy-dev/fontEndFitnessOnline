import { Form, Input, notification, Modal, TimePicker, Upload } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { CreateClub, fetchAllClubs } from "../../../serviceToken/ClubService";

function CreateClubModa(props) {
    const { loadClubs, isModalOpen, setIsModelOpen } = props;
    const [form] = Form.useForm();
    const [existingClubs, setExistingClubs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tokenData = getTokenData();//tokenData.access_token

    // Fetch existing clubs when modal opens
    useEffect(() => {
        if (isModalOpen) {
            fetchExistingClubs();
        }
    }, [isModalOpen]);

    const fetchExistingClubs = async () => {
        try {
            const response = await fetchAllClubs(tokenData.access_token);
            if (response && response.data) {
                setExistingClubs(response.data);
            }
        } catch (error) {
            console.error("Error fetching existing clubs:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch existing clubs data."
            });
        }
    };

    const checkNameExists = (name) => {
        return existingClubs.some(club => 
            club.name.toLowerCase() === name.toLowerCase()
        );
    };

    const checkPhoneExists = (phone) => {
        return existingClubs.some(club => 
            club.contactPhone === phone
        );
    };

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            
            // Check if club name already exists
            if (checkNameExists(values.name)) {
                notification.error({
                    message: "Validation Error",
                    description: "A club with this name already exists. Please choose a different name."
                });
                setIsSubmitting(false);
                return;
            }

            // Check if phone number already exists
            if (checkPhoneExists(values.contactPhone)) {
                notification.error({
                    message: "Validation Error",
                    description: "This phone number is already registered with another club. Please use a different number."
                });
                setIsSubmitting(false);
                return;
            }

            const formattedData = {
                ...values,
                openHour: values.openHour ? dayjs(values.openHour).format("HH:mm") : "",
                closeHour: values.closeHour ? dayjs(values.closeHour).format("HH:mm") : "",
            };
            
            const reponse = await CreateClub(formattedData, tokenData.access_token);
            
            if (reponse != null) {
                notification.success({
                    message: "Create Club",
                    description: "Club created successfully."
                });
                resetAndCloseModal();
                await loadClubs();
            } else {
                notification.error({
                    message: "Error Creating Club",
                    description: JSON.stringify(reponse.message)
                });
            }
        } catch (error) {
            console.error("Error creating club:", error);
            notification.error({
                message: "Error Creating Club",
                description: error.message || "An unexpected error occurred"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndCloseModal = () => {
        setIsModelOpen(false);
        form.resetFields();
    };

    // Custom validator for club name
    const validateClubName = async (_, value) => {
        if (!value) {
            return Promise.reject("Club name is required.");
        }
        
        // This is a client-side validation to improve UX
        // We still do a check in handleSubmit for security
        if (checkNameExists(value)) {
            return Promise.reject("A club with this name already exists. Please choose a different name.");
        }
        
        return Promise.resolve();
    };

    // Custom validator for phone number
    const validatePhoneNumber = async (_, value) => {
        if (!value) {
            return Promise.reject("Contact phone is required.");
        }
        
        if (checkPhoneExists(value)) {
            return Promise.reject("This phone number is already registered with another club. Please use a different number.");
        }
        
        return Promise.resolve();
    };

    return (
        <Modal
            title="Create A New Club"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={resetAndCloseModal}
            okText="Create"
            cancelText="No"
            maskClosable={false}
            confirmLoading={isSubmitting}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item 
                    name="name" 
                    label="Club Name" 
                    rules={[
                        { 
                            validator: validateClubName
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required." }]}>
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="contactPhone" 
                    label="Contact Phone" 
                    rules={[
                        { 
                            validator: validatePhoneNumber
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required." }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="openHour" label="Open Hour" rules={[{ required: true, message: "Open hour is required." }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>

                <Form.Item name="closeHour" label="Close Hour" rules={[{ required: true, message: "Close hour is required." }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateClubModa;