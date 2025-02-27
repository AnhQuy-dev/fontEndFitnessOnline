import { Form, Input, notification, Modal } from "antd";
import { useEffect } from "react";
import { UpdateClub } from "../../../serviceToken/ClubService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const UpdateClubModa = ({ isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadClubs }) => {
    const [form] = Form.useForm();
    const tokenData = getTokenData();//tokenData.access_token
    useEffect(() => {
        if (dataUpdate) {
            // Convert array time format to HH:mm string
            const formatTimeFromArray = (timeArray) => {
                if (!Array.isArray(timeArray)) return null;
                const hours = String(timeArray[0]).padStart(2, '0');
                const minutes = String(timeArray[1]).padStart(2, '0');
                return `${hours}:${minutes}`;
            };

            const formattedData = {
                ...dataUpdate,
                openHour: formatTimeFromArray(dataUpdate.openHour),
                closeHour: formatTimeFromArray(dataUpdate.closeHour)
            };

            form.setFieldsValue(formattedData);
        }
    }, [dataUpdate, form]);

    const handleSubmit = async (values) => {
        try {
            const clubData = {
                name: values.name,
                address: values.address,
                contactPhone: values.contactPhone,
                description: values.description,
                openHour: values.openHour,
                closeHour: values.closeHour
            };

            const reponse = await UpdateClub(dataUpdate.id, clubData, tokenData.access_token);

            if (reponse.data) {
                notification.success({
                    message: "Update Club",
                    description: "Club updated successfully.",
                });
                handleCancel();
                await loadClubs();
            } else {
                notification.error({
                    message: "Error Updating Club",
                    description: reponse.message,
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "An error occurred while updating the club.",
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalUpdateOpen(false);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Edit Club"
            open={isModalUpdateOpen}
            onOk={form.submit}
            onCancel={handleCancel}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="ID"
                    name="id"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Club Name"
                    name="name"
                    rules={[{ required: true, message: "Club name is required" }]}
                >
                    <Input placeholder="Club Name" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Address is required" }]}
                >
                    <Input placeholder="Address" />
                </Form.Item>

                <Form.Item
                    label="Contact Phone"
                    name="contactPhone"
                    rules={[{ required: true, message: "Contact phone is required" }]}
                >
                    <Input placeholder="Contact Phone" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Description is required" }]}
                >
                    <Input.TextArea placeholder="Description" />
                </Form.Item>

                <Form.Item
                    label="Open Hour"
                    name="openHour"
                    rules={[
                        { required: true, message: "Open hour is required" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || !getFieldValue('closeHour') || value < getFieldValue('closeHour')) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Close hour must be after open hour'));
                            },
                        }),
                    ]}
                >
                    <Input type="time" />
                </Form.Item>

                <Form.Item
                    label="Close Hour"
                    name="closeHour"
                    rules={[
                        { required: true, message: "Close hour is required" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || !getFieldValue('openHour') || value > getFieldValue('openHour')) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Close hour must be after open hour'));
                            },
                        }),
                    ]}
                >
                    <Input type="time" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateClubModa;