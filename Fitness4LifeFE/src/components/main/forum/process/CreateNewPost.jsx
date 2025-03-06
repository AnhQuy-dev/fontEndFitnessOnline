import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Upload, Button, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { CreateQuestion } from "../../../../serviceToken/ForumService";
import { getDecodedToken, getTokenData } from "../../../../serviceToken/tokenUtils";

const { Option } = Select;

const categoryOptions = [
    { value: "MALE_FITNESS_PROGRAM", label: "Men's Fitness Program" },
    { value: "FEMALE_FITNESS_PROGRAM", label: "Women's Fitness Program" },
    { value: "GENERAL_FITNESS_PROGRAM", label: "General Bodybuilding Program" },
    { value: "FITNESS_QA", label: "Fitness Q&A" },
    { value: "POSTURE_CORRECTION", label: "Exercise Form & Technique Correction" },
    { value: "NUTRITION_EXPERIENCE", label: "Nutrition Experience" },
    { value: "SUPPLEMENT_REVIEW", label: "Supplement Reviews" },
    { value: "WEIGHT_LOSS_QA", label: "Weight Loss & Fat Loss Q&A" },
    { value: "MUSCLE_GAIN_QA", label: "Muscle Gain & Weight Gain Q&A" },
    { value: "TRANSFORMATION_JOURNAL", label: "Transformation Journal" },
    { value: "FITNESS_CHATS", label: "Fitness Related Chats" },
    { value: "TRAINER_DISCUSSION", label: "Fitness Trainers - Job Exchange" },
    { value: "NATIONAL_GYM_CLUBS", label: "National Gym Clubs" },
    { value: "FIND_WORKOUT_BUDDY", label: "Find Workout Partners - Team Workout" },
    { value: "SUPPLEMENT_MARKET", label: "Supplement Marketplace" },
    { value: "EQUIPMENT_ACCESSORIES", label: "Training Equipment & Accessories" },
    { value: "GYM_TRANSFER", label: "Gym Transfer & Sales" },
    { value: "MMA_DISCUSSION", label: "Mixed Martial Arts (MMA)" },
    { value: "CROSSFIT_DISCUSSION", label: "CrossFit" },
    { value: "POWERLIFTING_DISCUSSION", label: "Powerlifting" },
];


const statusOptions = [
    { value: "PENDING", label: "Pending (Chờ xử lý)" },
    { value: "UNDER_REVIEW", label: "Under Review (Đang duyệt)" },
    { value: "APPROVED", label: "Approved (Đã duyệt)" },
];

const CreateNewPost = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();
    // console.log("decotoken: ", decotoken);//tokenData.access_token

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryLabel = queryParams.get("category");

        if (categoryLabel) {
            // Tìm `value` dựa trên `label`
            const categoryValue = categoryOptions.find(
                (option) => option.label === categoryLabel
            )?.value;

            if (categoryValue) {
                form.setFieldsValue({ category: [categoryValue] }); // Điền `value` vào form
            }
        }
    }, [location, form]);

    const initialValues = {
        authorId: decotoken?.id || "Không xác định",
        author: decotoken?.fullName || "Không xác định",
        status: "PENDING",
    };

    const handleSubmit = async (values) => {
        const { title, content, tag, category, imageQuestionUrl, authorId, author, status } = values;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("tag", tag);
        formData.append("rolePost", "PUBLICED");
        formData.append("status", status);
        formData.append("authorId", authorId);
        formData.append("author", author);

        if (category && category.length > 0) {
            category.forEach((cat) => formData.append("category", cat));
        }

        if (imageQuestionUrl && imageQuestionUrl.length > 0) {
            imageQuestionUrl.forEach((file) => {
                formData.append("imageQuestionUrl", file.originFileObj || file);
            });
        }

        try {
            setLoading(true);
            const response = await CreateQuestion(formData, tokenData.access_token);
            // console.log("response: ", response);
            if (response.status === 201) {
                message.success("Tạo bài viết thành công!");
                navigate(`/forums/post-new`);
            } else {
                message.error(response.message || "Tạo bài viết thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo bài viết!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                <h1>Tạo Bài Viết Mới</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={initialValues}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input placeholder="Nhập tiêu đề bài viết" />
                    </Form.Item>

                    <Form.Item
                        label="Từ khóa"
                        name="tag"
                        rules={[{ required: true, message: "Vui lòng nhập từ khóa!" }]}
                    >
                        <Input placeholder="Nhập từ khóa" />
                    </Form.Item>
                    <Form.Item
                        label="AuthorId"
                        name="authorId"
                        hidden
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Author"
                        name="author"
                        hidden
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập nội dung bài viết" />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="category"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                    >
                        <Select
                            mode="multiple" // Cho phép chọn nhiều mục
                            placeholder="Chọn danh mục"
                            options={categoryOptions} // Danh sách các danh mục
                        />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                        hidden
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={statusOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="imageQuestionUrl"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Tạo bài viết
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
};

export default CreateNewPost;
