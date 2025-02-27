import { Drawer, Descriptions, Typography, Image, Button, Checkbox, notification } from "antd";
import { useState } from "react";
import "../../../assets/css/Admin/imageClub.css";
import { AddMoreImageClub, ChosePrimaryImage, DeleteImageClub, UpdateImageClub } from "../../../serviceToken/ClubService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const { Title, Text } = Typography;

const ViewClubDetail = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;
  const tokenData = getTokenData();//tokenData.access_token


  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [choseImage, setchoseImage] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);

  // Helper function to reset all states except one
  const resetOtherStates = (activeState) => {
    setIsAddingImage(activeState === 'adding');
    setIsUpdating(activeState === 'updating');
    setchoseImage(activeState === 'choosing');
    setDeleteImage(activeState === 'deleting');
    setSelectedImage(null); // Reset selected image when switching modes
  };


  const handleToggleAddImage = () => {
    if (isAddingImage) {
      resetOtherStates(null); // Reset all to false
    } else {
      resetOtherStates('adding');
    }
  };

  const handleToggleUpdateImage = () => {
    if (isUpdating) {
      resetOtherStates(null); // Reset all to false
    } else {
      resetOtherStates('updating');
    }
  };

  // Update existing handlers
  const handleDeleteImageToggle = () => {
    if (deleteImage) {
      resetOtherStates(null);
    } else {
      resetOtherStates('deleting');
    }
  };

  const handleChooseImageToggle = () => {
    if (choseImage) {
      resetOtherStates(null);
    } else {
      resetOtherStates('choosing');
    }
  };


  const handleSelectImage = (imageId) => {
    setSelectedImage((prev) => (prev === imageId ? null : imageId));
  };



  const handleUploadImage = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        id: URL.createObjectURL(file), // Dùng URL tạm thời để preview
        file,
        clubId: dataDetail.id, // Gán ID của club vào ảnh
      }));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleRemoveImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmitAddImages = async () => {
    const formData = new FormData();
    formData.append("clubId", dataDetail.id); // Gán đúng ID club đã chọn

    uploadedImages.forEach((image) => {
      formData.append("file", image.file);
    });

    const reponse = await AddMoreImageClub(formData, tokenData.access_token)
    if (reponse != null) {
      notification.success({
        message: "add imageClub",
        description: "imageClub add successfully."
      });
    } else {
      notification.error({
        message: "Error Creating Club",
        description: JSON.stringify(reponse.message)
      });
    }

    setUploadedImages([]);
    setIsAddingImage(false);
  };

  const handleSubmitUpdateImages = async () => {
    if (!selectedImage) {
      notification.warning({
        message: "No Image Selected",
        description: "Please select an image to update.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("clubId", dataDetail.id); // Gán đúng ID club đã chọn
    uploadedImages.forEach((image) => { formData.append("file", image.file); });
    // console.log("🚀 Club ID:", dataDetail.id);
    // console.log("📸 Uploaded Images:", uploadedImages.map(img => img.file.name));
    // console.log("selectedImage in handleSubmitUpdateImages: ", selectedImage);

    const reponse = await UpdateImageClub(selectedImage, formData, tokenData.access_token)
    if (reponse != null) {
      notification.success({
        message: "update imageClub",
        description: "imageClub update successfully."
      });
    } else {
      notification.error({
        message: "Error updating Club",
        description: JSON.stringify(reponse.message)
      });
    }

    setUploadedImages([]);
    setIsAddingImage(false);
    setIsUpdating(false);
  };


  const handleChoosePrimaryImage = async () => {
    if (!selectedImage) {
      notification.warning({
        message: "No Image Selected",
        description: "Please select an image to set as primary.",
      });
      return;
    }
    try {
      // Gọi API cập nhật ảnh primary
      const response = await ChosePrimaryImage(selectedImage, tokenData.access_token);

      console.log("🚀 ChosePrimaryImage:", response);

      if (response.status == 200) {
        notification.success({
          message: "Primary Image Updated",
          description: "The selected image is now the primary image.",
        });
      } else {
        throw new Error("Failed to update primary image.");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong while setting primary image.",
      });
    }

  };


  const handleDeleteImage = async () => {
    if (!selectedImage) {
      notification.warning({
        message: "No Image Selected",
        description: "Please select an image to set as primary.",
      });
      return;
    }
    console.log("selectedImage in handleDeleteImage: ", selectedImage);

    try {
      // Gọi API cập nhật ảnh primary
      const response = await DeleteImageClub(selectedImage, tokenData.access_token);

      // console.log("🚀 DeleteImageClub:", response);

      if (response.status == 200) {
        notification.success({
          message: "delete imageClub successfully",
          description: "delete imageClub successfully.",
        });
      } else {
        throw new Error("Failed to delete imageClub.");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong while delete imageClub.",
      });
    }

  };

  return (
    <Drawer
      title={<Title level={4}>Club Detail</Title>}
      onClose={() => {
        setDataDetail(null);
        setIsDataDetailOpen(false);
        setIsUpdating(false); // Reset trạng thái cập nhật ảnh
        setIsAddingImage(false); // Reset trạng thái thêm ảnh
        setDeleteImage(false);
        setchoseImage(false);
        setSelectedImage(null);
      }}
      open={isDataDetailOpen}
      width={1200}
      footer={
        <Text type="secondary">
          Thank you for using our service. For more details, please contact support.
        </Text>
      }
    >
      {dataDetail ? (
        <>
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: "bold", width: "30%" }}
            contentStyle={{ background: "#fafafa" }}
          >
            <Descriptions.Item label="ID">{dataDetail.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{dataDetail.name}</Descriptions.Item>
            <Descriptions.Item label="Address">{dataDetail.address}</Descriptions.Item>
            <Descriptions.Item label="Contact Phone">{dataDetail.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="Description">{dataDetail.description}</Descriptions.Item>
            <Descriptions.Item label="Open Time">{dataDetail.openHour}</Descriptions.Item>
            <Descriptions.Item label="Close Time">{dataDetail.closeHour}</Descriptions.Item>
            <Descriptions.Item label="Rooms">
              {dataDetail.rooms && dataDetail.rooms.length > 0 ? (
                dataDetail.rooms.map((room, index) => (
                  <div key={index}>
                    <Text>{room.roomName}</Text>
                  </div>
                ))
              ) : (
                <Text type="secondary">No rooms available</Text>
              )}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: "20px", textAlign: "center" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <Title level={5} style={{ margin: 0 }}>Club Images</Title>
              <div>
                {!deleteImage ? (
                  <Button
                    type="dashed"
                    onClick={handleDeleteImageToggle}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete Image
                  </Button>
                ) : (
                  <>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setDeleteImage(false);
                        setSelectedImage(null);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleDeleteImage}
                      disabled={!selectedImage}
                      style={{ marginLeft: "10px" }}
                    >
                      delete
                    </Button>
                  </>
                )}

                {!choseImage ? (
                  <Button
                    type="dashed"
                    onClick={handleChooseImageToggle}
                    style={{ marginLeft: "10px" }}
                  >
                    Choose Primary Image
                  </Button>
                ) : (
                  <>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setchoseImage(false);
                        setSelectedImage(null);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleChoosePrimaryImage}
                      disabled={!selectedImage}
                      style={{ marginLeft: "10px" }}
                    >
                      Choose
                    </Button>
                  </>
                )}

                <Button type="primary" onClick={handleToggleAddImage}>
                  {isAddingImage ? "Cancel" : "Add Image"}
                </Button>

                <Button
                  type="default"
                  style={{ marginLeft: "10px" }}
                  onClick={handleToggleUpdateImage}
                >
                  {isUpdating ? "Cancel Update" : "Update Image"}
                </Button>
              </div>
            </div>
            {dataDetail.clubImages && dataDetail.clubImages.length > 0 ? (
              <div className="club-images-container">
                {dataDetail.clubImages.map((image, index) => (
                  <div key={index} className="club-image-wrapper" onClick={() => handleSelectImage(image.id)}>
                    {(isUpdating || choseImage || deleteImage) && (
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedImage === image.id}
                          onChange={() => handleSelectImage(image.id)}
                        />
                        <span></span>
                      </label>
                    )}
                    <Image
                      src={image.imageUrl}
                      alt={`Club Image ${index + 1}`}
                      className="club-image"
                      placeholder
                      preview={!isUpdating && !choseImage && !deleteImage}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No images available</Text>
            )}
            {(isAddingImage || isUpdating) && (
              <div className="upload-container">
                <Title level={5}>Upload New Images</Title>
                <input type="file" multiple onChange={handleUploadImage} />
                <div className="preview-images">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="preview-item">
                      <img src={image.id} alt="preview" className="preview-img" />
                      <button onClick={() => handleRemoveImage(image.id)}>❌</button>
                    </div>
                  ))}
                </div>
                {isUpdating ? (
                  <Button type="primary" onClick={handleSubmitUpdateImages}>Update Now</Button>
                ) : (
                  <Button type="primary" onClick={handleSubmitAddImages}>Add</Button>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "red" }}>
          <h3>Don't have anything here!</h3>
        </div>
      )}
    </Drawer>
  );
};

export default ViewClubDetail;
