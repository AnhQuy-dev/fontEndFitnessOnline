import { Input, notification, Modal, Select, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { updateTrainer } from "../../../services/TrainerService";

const UpdateTrainer = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadTrainers, token } = props;
    const [fullName, setFullName] = useState("");
    const [slug, setSlug] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [experienceYear, setExperienceYear] = useState("");
    const [certificate, setCertificate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [scheduleTrainers, setScheduleTrainers] = useState([]);
    const [branch, setBranch] = useState("");
    const [file, setFile] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    const [branches, setBranches] = useState([]);  // State to store branch data
    const [error, setErrors] = useState({});

    // Fetch Branch data when component mounts
    useEffect(() => {
        const fetchAllBranch = async () => {
            try {
                const response = await fetch("http://localhost:8081/api/dashboard/branchs",{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setBranches(data.data);

            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };

        fetchAllBranch();
    }, []);

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
            file: setFile,
        };

        setters[field]?.(value);
        validateField(field, value);

    };



    useEffect(() => {
        if (dataUpdate) {
            setFullName(dataUpdate.fullName || "");
            setSlug(dataUpdate.slug || "");
            setSpecialization(dataUpdate.specialization || "");
            setExperienceYear(dataUpdate.experienceYear || "");
            setCertificate(dataUpdate.certificate || "");
            setPhoneNumber(dataUpdate.phoneNumber || "");
            setScheduleTrainers(dataUpdate.scheduleTrainers || []);
            setBranch(dataUpdate.branch || "");
            setCurrentFile(dataUpdate.photo);
            console.log("f", currentFile);


        }
    }, [dataUpdate]);

    useEffect(() => {
        if (dataUpdate) {
            setCurrentFile(dataUpdate.photo); // Lưu URL ảnh hiện tại
        }
    }, [dataUpdate]);

    const convertURLToFile = async (url) => {
        const response = await fetch(url); // Tải ảnh từ URL
        const blob = await response.blob(); // Chuyển đổi dữ liệu thành Blob
        const fileName = url.split('/').pop(); // Lấy tên file từ URL
        return new File([blob], fileName, { type: blob.type }); // Tạo đối tượng File
    };

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
            });
            return;
        }

        let fileToUpdate = null;
        if (!file) {
            if (currentFile.startsWith("http")) {
                fileToUpdate = await convertURLToFile(currentFile); // Chuyển URL thành File
            } else {
                fileToUpdate = currentFile; // Nếu đã là File, sử dụng trực tiếp
            }
        } else {
            fileToUpdate = file; // Nếu có file mới, sử dụng file mới
        }

        try {
            const res = await updateTrainer(
                dataUpdate.id,
                fullName,
                slug,
                fileToUpdate,
                specialization,
                experienceYear,
                certificate,
                phoneNumber,
                scheduleTrainers,
                branch
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
                    description: JSON.stringify(res.data || "Unknown error"),
                });
            }
        } catch (error) {
            console.error("Error during update:", error.response || error.message);
            notification.error({
                message: "Error Updating Trainer",
                description: error.response?.data?.message || "An unexpected error occurred.",
            });
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
        setFile(null);
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
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Full Name</span>
                    <Input
                        value={fullName}
                        placeholder="Full Name"
                        onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                </div>

                <div>
                    <span>Slug</span>
                    <Input
                        value={slug}
                        placeholder="Slug"
                        onChange={(e) => handleChange("slug", e.target.value)}
                    />
                </div>

                <div>
                    <span>Specialization</span>
                    <Input
                        value={specialization}
                        placeholder="Specialization"
                        onChange={(e) => handleChange("specialization", e.target.value)}
                    />
                </div>

                <div>
                    <span>Experience Year</span>
                    <Input
                        value={experienceYear}
                        placeholder="Experience Year"
                        onChange={(e) => handleChange("experienceYear", e.target.value)}
                    />
                </div>

                <div>
                    <span>Certificate</span>
                    <Input
                        value={certificate}
                        placeholder="Certificate"
                        onChange={(e) => handleChange("certificate", e.target.value)}
                    />
                </div>

                <div>
                    <span>Phone Number</span>
                    <Input
                        value={phoneNumber}
                        placeholder="Phone Number"
                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    />
                </div>

                <div>
                    <span>Schedule</span>
                    <Select
                        mode="multiple"
                        value={scheduleTrainers}
                        placeholder="Schedule"
                        onChange={(value) => handleChange("scheduleTrainers", value)}
                    >
                        <Select.Option value="MONDAY">Monday</Select.Option>
                        <Select.Option value="TUESDAY">Tuesday</Select.Option>
                        <Select.Option value="WEDNESDAY">Wednesday</Select.Option>
                        <Select.Option value="THURSDAY">Thursday</Select.Option>
                        <Select.Option value="FRIDAY">Friday</Select.Option>
                        <Select.Option value="SATURDAY">Saturday</Select.Option>
                        <Select.Option value="SUNDAY">Sunday</Select.Option>
                    </Select>
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
                            <Select.Option key={branchItem.id} 
                                        value={branchItem.id}
                                        placeholder={"SELECT BRANCH"}
                                        >
                                {branchItem.branchName}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <span>Photo</span>
                    <div>
                        {file ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Selected File"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }}
                            />
                        ) : currentFile ? (
                            <img
                                src={currentFile}
                                alt="Current Photo"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }}
                            />
                        ) : (
                            <span>No photo available</span>
                        )}
                    </div>
                    <Input
                        type="file"
                        accept=".jpeg, .jpg, .png"
                        onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            handleChange("file", selectedFile); // Cập nhật file mới
                        }}
                    />
                </div>

            </div>
            {error.file && <span style={{ color: "red" }}>{error.file}</span>}
        </Modal >
    );
};

export default UpdateTrainer;
