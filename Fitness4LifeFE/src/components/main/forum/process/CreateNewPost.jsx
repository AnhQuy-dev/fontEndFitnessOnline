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
        authorId: decotoken?.id || "Unknown",
        author: decotoken?.fullName || "Unknown",
        status: "PENDING",
    };

    const allowedFileTypes = [
        "image/png", "image/jpeg", "image/gif", "image/bmp",
        "image/webp", "image/tiff", "video/mp4"
    ];

    const [fileError, setFileError] = useState("");
    const beforeUpload = (file) => {
        if (!allowedFileTypes.includes(file.type)) {
            const errorMsg = "Only supported formats: PNG, JPEG, GIF, BMP, WEBP, TIFF, MP4.";
            setFileError(errorMsg);
            message.error(errorMsg);
            return Upload.LIST_IGNORE;
        }
        setFileError(""); // Xóa lỗi nếu file hợp lệ
        return false; // Ngăn tải lên ngay lập tức
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
            console.log("response: ", response);
            if (response.status === 201) {
                message.success("Post created successfully!");
                navigate(`/forums/post-new`);
            }
            else {
                message.error(response.message || "Post creation failed!");
            }
        } catch (error) {
            console.log("Full error:", error);

            let errorMessage = "Unknown"; // Default message
            let statusCode = error?.response?.status || 0;

            if (error.response) {
                // Nếu response có dạng object
                if (typeof error.response.data === "object" && error.response.data !== null) {
                    errorMessage = error.response.data.message || errorMessage;
                } else if (typeof error.response.data === "string") {
                    // Nếu response trả về dạng chuỗi JSON, cần parse nó
                    try {
                        const parsedError = JSON.parse(error.response.data);
                        errorMessage = parsedError.message || errorMessage;
                    } catch (e) {
                        errorMessage = error.response.data; // Nếu không parse được, dùng nguyên bản
                    }
                }
            }

            // Kiểm tra mã lỗi và nội dung message
            if (statusCode === 500 && errorMessage.includes("Server error: Loại file không được hỗ trợ")) {
                message.error("Only supported formats: image/png, image/jpeg.");
            } else {
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                <h1>Create New Post</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={initialValues}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter a title!" }]}
                    >
                        <Input placeholder="Enter post title" />
                    </Form.Item>

                    <Form.Item
                        label="Tags"
                        name="tag"
                        rules={[{ required: true, message: "Please enter tags!" }]}
                    >
                        <Input placeholder="Enter tags" />
                    </Form.Item>
                    <Form.Item
                        label="Author ID"
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
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: "Please enter content!" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter post content" />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: "Please select a category!" }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select categories"
                            options={categoryOptions}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select a status!" }]}
                        hidden
                    >
                        <Select
                            placeholder="Select status"
                            options={statusOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="imageQuestionUrl"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        validateStatus={fileError ? "error" : ""}
                        help={fileError}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Upload Images</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Create Post
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </section>
    );
};

export default CreateNewPost;
