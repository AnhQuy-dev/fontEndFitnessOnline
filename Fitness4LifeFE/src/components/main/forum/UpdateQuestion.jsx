import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Upload, notification } from "antd";
import { updateQuestion } from "../../../services/forumService";

const { TextArea } = Input;

const UpdateQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { post } = location.state; // Nhận dữ liệu bài viết từ state
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [tag, setTag] = useState(post.tag);
    const [imagesUpload, setImagesUpload] = useState([]);
    const [deleteImageUrl, setDeleteImageUrl] = useState([]); // Lưu các ảnh cũ cần xóa
    const [existingImages, setExistingImages] = useState(post.questionImage);

    // Xử lý xóa ảnh cũ trực tiếp
    const handleDeleteExistingImage = (image) => {
        setDeleteImageUrl((prev) => [...prev, image.id]); // Thêm ID ảnh vào danh sách xóa
        setExistingImages((prev) => prev.filter((img) => img.id !== image.id)); // Loại bỏ ảnh khỏi danh sách hiện tại
    };

    const handleUploadChange = ({ fileList }) => {
        setImagesUpload(fileList.map((file) => file.originFileObj)); // Cập nhật danh sách ảnh mới
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("tag", tag);
        imagesUpload.forEach((file) => formData.append("imageQuestionUrl", file)); // Thêm ảnh mới
        deleteImageUrl.forEach((id) => formData.append("deleteImageUrl", id)); // Gửi ID ảnh cần xóa

        try {
            console.log("Dữ liệu gửi lên:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await updateQuestion(post.id, formData);
            if (response.status === 200) {
                notification.success({ message: "Cập nhật thành công" });
                setExistingImages(response.data.updatedImages); // Cập nhật danh sách ảnh sau chỉnh sửa
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response?.message || "Cập nhật thất bại.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.message || "Không thể kết nối với máy chủ.",
            });
        }
    };

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                <h2>Cập nhật bài viết</h2>
                <Input
                    placeholder="Tiêu đề"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginBottom: "16px" }}
                />
                <TextArea
                    placeholder="Nội dung"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    style={{ marginBottom: "16px" }}
                />
                <Input
                    placeholder="Từ khóa"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    style={{ marginBottom: "16px" }}
                />
                <div>
                    <h3>Ảnh hiện tại</h3>
                    {existingImages?.map((img, index) => (
                        <div key={index} style={{ marginBottom: "8px" }}>
                            <img src={img.imageUrl} alt="current" style={{ maxWidth: "100px", marginRight: "8px" }} />
                            <Button danger onClick={() => handleDeleteExistingImage(img)}>
                                Xóa
                            </Button>
                        </div>
                    ))}
                </div>
                <Upload
                    multiple
                    beforeUpload={() => false}
                    onChange={handleUploadChange}
                    listType="picture"
                    style={{ marginBottom: "16px" }}
                >
                    <Button>Thêm ảnh mới</Button>
                </Upload>
                <Button type="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>
            </div>
        </section>
    );
};

export default UpdateQuestion;
