import { Form, Input, notification, Modal, TimePicker, Upload } from "antd";
import dayjs from "dayjs";
import { CreateClub } from "../../../serviceToken/ClubService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

function CreateClubModa(props) {
    const { loadClubs, isModalOpen, setIsModelOpen } = props;
    const [form] = Form.useForm();
    const tokenData = getTokenData();//tokenData.access_token

    const handleSubmit = async (values) => {
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
    };

    const resetAndCloseModal = () => {
        setIsModelOpen(false);
        form.resetFields();
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
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Club Name" rules={[{ required: true, message: "Club name is required." }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required." }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="contactPhone" label="Contact Phone" rules={[{ required: true, message: "Contact phone is required." }]}>
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
