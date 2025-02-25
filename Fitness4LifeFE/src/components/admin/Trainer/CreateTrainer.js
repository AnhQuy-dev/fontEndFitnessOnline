import { Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { createTrainer } from "../../../services/TrainerService";
import axios from "axios";

const { Option } = Select;

function CreateTrainer(props) {
    const { loadTrainers, isModalOpen, setIsModelOpen,token } = props;

    const [fullName, setFullName] = useState("");
    const [slug, setSlug] = useState("");
    const [file, setFile] = useState(null);
    const [specialization, setSpecialization] = useState("");
    const [experienceYear, setExperienceYear] = useState(0);
    const [certificate, setCertificate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [scheduleTrainers, setScheduleTrainers] = useState([]);
    const [branch, setBranch] = useState(0);
    const [branches, setBranches] = useState([]); // State to store branch data
    const [error, setErrors] = useState({});

    useEffect(() => {
        // Fetch Branch data when component is mounted
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
                console.log(">>Chack Data", setBranches);

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
            case "slug":
                newErrors.slug = value.trim() ? "" : "Slug is required.";
                break;
            case "specialization":
                newErrors.specialization = value.trim() ? "" : "Specialization is required.";
                break;
            case "experienceYear":
                newErrors.experienceYear = value >= 0 ? "" : "Experience year must be greater than or equal to 0.";
                break;
            case "certificate":
                newErrors.certificate = value.trim() ? "" : "Certificate is required.";
                break;
            case "phoneNumber":
                newErrors.phoneNumber = value.trim() ? "" : "Phone number is required.";
                break;
            case "branch":
                newErrors.branch = value ? "" : "Branch is required.";
                break;
            case "scheduleTrainers":
                newErrors.scheduleTrainers = value.length > 0 ? "" : "Schedule is required.";
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {
            fullName: fullName.trim() ? "" : "Full name is required.",
            slug: slug.trim() ? "" : "Slug is required.",
            specialization: specialization.trim() ? "" : "Specialization is required.",
            experienceYear: experienceYear >= 0 ? "" : "Experience year must be greater than or equal to 0.",
            certificate: certificate.trim() ? "" : "Certificate is required.",
            phoneNumber: phoneNumber.trim() ? "" : "Phone number is required.",
            branch: branch ? "" : "Branch is required.",
            scheduleTrainers: scheduleTrainers.length > 0 ? "" : "Schedule is required."
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
            branch: setBranch,
            scheduleTrainers: setScheduleTrainers,
        };

        setters[field]?.(value);
        validateField(field, value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };

    const handleSubmitBtn = async () => {
        const hasErrors = validateAllFields();
        if (hasErrors) {
            notification.error({
                message: "Validation Error",
                description: "Please fix the errors in the form before submitting."
            });
            return;
        }

        const res = await createTrainer(fullName, slug, file, specialization, experienceYear, certificate, phoneNumber, scheduleTrainers, branch);

        if (res.data) {
            notification.success({
                message: "Create Trainer",
                description: "Trainer created successfully."
            });
            resetAndCloseModal();
            await loadTrainers();
        } else {
            notification.error({
                message: "Error Creating Trainer",
                description: JSON.stringify(res.message)
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModelOpen(false);
        setFullName("");
        setSlug("");
        setFile(null);
        setSpecialization("");
        setExperienceYear(0);
        setCertificate("");
        setPhoneNumber("");
        setBranch(0);
        setScheduleTrainers([]);
        setErrors({});
    };

    return (
        <>
            <Modal
                title="Create A New Trainer"
                open={isModalOpen}
                onOk={() => { handleSubmitBtn(); }}
                onCancel={() => { resetAndCloseModal(); }}
                okText={"Create"}
                cancelText={"Cancel"}
                maskClosable={false}
            >
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                    <div>
                        <span>Full Name</span>
                        <Input
                            value={fullName}
                            onChange={(event) => { handleChange("fullName", event.target.value); }}
                        />
                        {error.fullName && <span style={{ color: "red" }}>{error.fullName}</span>}
                    </div>
                    <div>
                        <span>Slug</span>
                        <Input
                            value={slug}
                            onChange={(event) => { handleChange("slug", event.target.value); }}
                        />
                        {error.slug && <span style={{ color: "red" }}>{error.slug}</span>}
                    </div>
                    <div>
                        <span>Specialization</span>
                        <Input
                            value={specialization}
                            onChange={(event) => { handleChange("specialization", event.target.value); }}
                        />
                        {error.specialization && <span style={{ color: "red" }}>{error.specialization}</span>}
                    </div>
                    <div>
                        <span>Experience Year</span>
                        <Input
                            type="number"
                            value={experienceYear}
                            onChange={(event) => { handleChange("experienceYear", event.target.value); }}
                        />
                        {error.experienceYear && <span style={{ color: "red" }}>{error.experienceYear}</span>}
                    </div>
                    <div>
                        <span>Certificate</span>
                        <Input
                            value={certificate}
                            onChange={(event) => { handleChange("certificate", event.target.value); }}
                        />
                        {error.certificate && <span style={{ color: "red" }}>{error.certificate}</span>}
                    </div>
                    <div>
                        <span>Phone Number</span>
                        <Input
                            value={phoneNumber}
                            onChange={(event) => { handleChange("phoneNumber", event.target.value); }}
                        />
                        {error.phoneNumber && <span style={{ color: "red" }}>{error.phoneNumber}</span>}
                    </div>
                    <div>
                        <span>Branch</span>
                        <Select
                            value={branch}
                            onChange={(value) => { handleChange("branch", value); }}
                            style={{ width: "100%" }}
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

                        <span>Schedule</span>
                        <Select
                            mode="multiple"
                            value={scheduleTrainers}
                            onChange={(value) => { handleChange("scheduleTrainers", value); }}
                            style={{ width: "100%" }}
                        >
                            <Option value="Monday">Monday</Option>
                            <Option value="Tuesday">Tuesday</Option>
                            <Option value="Wednesday">Wednesday</Option>
                            <Option value="Thursday">Thursday</Option>
                            <Option value="Friday">Friday</Option>
                            <Option value="Saturday">Saturday</Option>
                            <Option value="Sunday">Sunday</Option>
                        </Select>
                        {error.scheduleTrainers && <span style={{ color: "red" }}>{error.scheduleTrainers}</span>}
                    </div>
                    <div>
                        <span>File</span>
                        <Input type="file" onChange={handleFileChange} />
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CreateTrainer;
