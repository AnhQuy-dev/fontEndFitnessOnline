import { Input, notification, Modal, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchAllBranch } from "../../../serviceToken/BrachSERVICE";
import { updateTrainer } from "../../../serviceToken/TrainerSERVICE";

const { Option } = Select;

const scheduleOptions = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
];

const UpdateTrainer = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadTrainers, dataTrainer } = props;
    const [fullName, setFullName] = useState("");
    const [slug, setSlug] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [experienceYear, setExperienceYear] = useState("");
    const [certificate, setCertificate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [scheduleTrainers, setScheduleTrainers] = useState([]);
    const [branch, setBranch] = useState("");
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [branches, setBranches] = useState([]);  // State to store branch data
    const [error, setErrors] = useState({});
    const tokenData = getTokenData();


    
    useEffect(() => {
        const getAllBranch = async () => {
            try {
                const dataBranch = await fetchAllBranch(tokenData.access_token);
                setBranches(dataBranch.data);
                console.log("Fetched branches:", dataBranch.data);
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "Failed to fetch branches."
                });
            }
        };

        getAllBranch();
    }, [tokenData.access_token]);

    const validateField = (field, value) => {
        const newErrors = { ...error };
        switch (field) {
            case "fullName":
                newErrors.fullName = value.trim() ? "" : "Full name is required.";
                break;
            case "phoneNumber":
                newErrors.phoneNumber = value.trim() ? "" : "Phone number is required.";
                break;
            case "experienceYear":
                newErrors.experienceYear = value && Number(value) >= 0 ? "" : "Experience year must be a positive number.";
                break;
            case "slug":
                newErrors.slug = value.trim() ? "" : "Slug is required.";
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            fullName: fullName.trim() ? "" : "Full name is required.",
            phoneNumber: phoneNumber.trim() ? "" : "Phone number is required.",
            experienceYear: experienceYear && Number(experienceYear) >= 0 ? "" : "Experience year must be a positive number.",
            specialization: specialization ? "" : "Specialization is required.",
            branch: branch ? "" : "Branch is required.",
            slug: slug.trim() ? "" : "Slug is required.",
        };

        setErrors(newErrors);
        return Object.values(newErrors).some((err) => err);
    };

    const handleChange = (field, value) => {
        const setters = {
            fullName: setFullName,
            slug: setSlug,
            specialization: setSpecialization,
            experienceYear: setExperienceYear,
            certificate: setCertificate,
            phoneNumber: setPhoneNumber,
            scheduleTrainers: setScheduleTrainers,
            branch: setBranch,
        };

        setters[field]?.(value);
        validateField(field, value);
    };

    // Handle file changes directly
    const handleFileChange = ({ fileList: newFileList }) => {
        console.log("File change detected:", newFileList);
        setFileList(newFileList);
    };

    // Prevent auto upload and do custom file validation if needed
    const beforeUpload = (file) => {
        console.log("File selected:", file);
        
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

    useEffect(() => {
        if (dataUpdate) {
            console.log("Data update received:", dataUpdate);
            setFullName(dataUpdate.fullName || "");
            setSlug(dataUpdate.slug || "");
            setSpecialization(dataUpdate.specialization || "");
            setExperienceYear(dataUpdate.experienceYear || "");
            setCertificate(dataUpdate.certificate || "");
            setPhoneNumber(dataUpdate.phoneNumber || "");
            setScheduleTrainers(dataUpdate.scheduleTrainers || []);
            
            // Handle branch correctly
            if (dataUpdate.branch) {
                if (typeof dataUpdate.branch === 'object' && dataUpdate.branch.id) {
                    setBranch(dataUpdate.branch.id);
                } else {
                    setBranch(dataUpdate.branch);
                }
            } else {
                setBranch("");
            }
            
            // Handle photo
            if (dataUpdate.photo) {
                setFileList([{
                    uid: '-1',
                    name: 'current-image.jpg',
                    status: 'done',
                    url: dataUpdate.photo,
                }]);
            } else {
                setFileList([]);
            }
        }
    }, [dataUpdate]);

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
            });
            return;
        }
    
        try {
            setLoading(true);
            
            // Create FormData object
            const formData = new FormData();
            
            // Ensure all text fields are trimmed and not undefined
            formData.append("fullName", fullName.trim());
            formData.append("specialization", specialization.trim());
            formData.append("experienceYear", experienceYear.toString());
            formData.append("certificate", certificate.trim());
            formData.append("phoneNumber", phoneNumber.trim());
            formData.append("branch", branch.toString());
            
            if (scheduleTrainers && scheduleTrainers.length > 0) {
                scheduleTrainers.forEach(day => {
                    formData.append("scheduleTrainers", day);
                });

            }
            
            if (fileList && fileList.length > 0) {
                const fileObj = fileList[0].originFileObj || fileList[0];
                formData.append("file", fileObj);
            }
            
            
            console.log("Form data being sent:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            const res = await updateTrainer(
                dataUpdate.id, 
                formData, 
                tokenData.access_token 
            );
    
            if (res.status === 200) {
                notification.success({
                    message: "Update Trainer",
                    description: "Trainer updated successfully.",
                });
                resetAndCloseModal();
                await loadTrainers();
            } else {
                notification.error({
                    message: "Error Updating Trainer",
                    description: res.data?.message || JSON.stringify(res.data || "Unknown error"),
                });
            }
        } catch (error) {
            console.error("Error during update:", error);
            notification.error({
                message: "Error Updating Trainer",
                description: error.response?.data?.message || error.message || "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setFullName("");
        setSlug("");
        setSpecialization("");
        setExperienceYear("");
        setCertificate("");
        setPhoneNumber("");
        setScheduleTrainers([]);
        setBranch("");
        setFileList([]);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Edit Trainer"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
            confirmLoading={loading}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Full Name</span>
                    <Input
                        value={fullName}
                        placeholder="Full Name"
                        onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                    {error.fullName && <span style={{ color: "red" }}>{error.fullName}</span>}
                </div>

                <div>
                    <span>Specialization</span>
                    <Input
                        value={specialization}
                        placeholder="Specialization"
                        onChange={(e) => handleChange("specialization", e.target.value)}
                    />
                    {error.specialization && <span style={{ color: "red" }}>{error.specialization}</span>}
                </div>

                <div>
                    <span>Experience Year</span>
                    <Input
                        value={experienceYear}
                        placeholder="Experience Year"
                        onChange={(e) => handleChange("experienceYear", e.target.value)}
                    />
                    {error.experienceYear && <span style={{ color: "red" }}>{error.experienceYear}</span>}
                </div>

                <div>
                    <span>Certificate</span>
                    <Input
                        value={certificate}
                        placeholder="Certificate"
                        onChange={(e) => handleChange("certificate", e.target.value)}
                    />
                    {error.certificate && <span style={{ color: "red" }}>{error.certificate}</span>}
                </div>

                <div>
                    <span>Phone Number</span>
                    <Input
                        value={phoneNumber}
                        placeholder="Phone Number"
                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    />
                    {error.phoneNumber && <span style={{ color: "red" }}>{error.phoneNumber}</span>}
                </div>

                <div>
                    <span>Schedule</span>
                    <Select
                        mode="multiple"
                        value={scheduleTrainers}
                        placeholder="Schedule"
                        onChange={(value) => handleChange("scheduleTrainers", value)}
                        options={scheduleOptions}
                    >
                    </Select>
                    {error.scheduleTrainers && <span style={{ color: "red" }}>{error.scheduleTrainers}</span>}
                </div>

                <div>
                    <span>Branch</span>
                    <Select
                        value={branch}
                        placeholder="Branch"
                        onChange={(value) => handleChange("branch", value)}
                        dropdownStyle={{ minWidth: 250 }}
                    >
                        {branches.map((branchItem) => (
                            <Option key={branchItem.id} value={branchItem.id}>
                                {branchItem.branchName}
                            </Option>
                        ))}
                    </Select>
                    {error.branch && <span style={{ color: "red" }}>{error.branch}</span>}
                </div>

                <div>
                    <span>Photo</span>
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
                    {error.file && <span style={{ color: "red" }}>{error.file}</span>}
                </div>
            </div>
        </Modal>
    );
};

export default UpdateTrainer;