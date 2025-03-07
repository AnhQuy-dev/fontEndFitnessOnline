import { Form, Input, notification, Modal, Select, Switch, Row, Col, Spin, AutoComplete, Button, Divider } from "antd";
import { useEffect, useState } from "react";
import { updateUserAPI } from "../../../serviceToken/authService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const UpdateUser = ({ isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadUsers }) => {
    const [form] = Form.useForm();
    const tokenData = getTokenData();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [fileError, setFileError] = useState('');
    const [addressOptions, setAddressOptions] = useState([]);
    const [customHobby, setCustomHobby] = useState('');
    const [customHobbies, setCustomHobbies] = useState([]);

    useEffect(() => {
        if (dataUpdate) {
            // Handle hobbies - convert from string to array if needed
            let hobbies = dataUpdate.profileDTO?.hobbies || "";
            if (typeof hobbies === 'string' && hobbies.trim() !== '') {
                // If hobbies is a comma-separated string, convert to array
                hobbies = hobbies.split(',').map(hobby => hobby.trim());
            }
            
            form.setFieldsValue({
                fullName: dataUpdate.fullName || "",
                role: dataUpdate.role || "",
                gender: dataUpdate.gender || "",
                status: dataUpdate.active ?? false,
                phone: dataUpdate.phone || "",
                hobbies: hobbies,
                address: dataUpdate.profileDTO?.address || "",
                age: dataUpdate.profileDTO?.age || "",
                maritalStatus: dataUpdate.profileDTO?.maritalStatus || "",
                description: dataUpdate.profileDTO?.description || "",
            });
        } else {
            form.resetFields();
        }
        setFileError('');
        setFileList([]);
        setCustomHobby('');
        setCustomHobbies([]);
    }, [dataUpdate, form]);

    // Validate phone number
    const validatePhoneNumber = (_, value) => {
        const phoneRegex = /^[0-9]{10,12}$/;
        if (value && !phoneRegex.test(value)) {
            return Promise.reject("Please enter a valid phone number (10-12 digits)");
        }
        return Promise.resolve();
    };

    // Validate age
    const validateAge = (_, value) => {
        if (value && (value < 18 || value > 100)) {
            return Promise.reject("Age must be between 18 and 100");
        }
        return Promise.resolve();
    };

    // Validate file type for image only
    const validateFile = () => {
        const fileInput = document.getElementById("fileInput");
        if (fileInput?.files.length > 0) {
            const file = fileInput.files[0];
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                setFileError('Please upload an image file only (JPG, PNG, GIF, etc.)');
                return false;
            }
            
            // Check file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setFileError('Image size should not exceed 5MB');
                return false;
            }
            
            setFileError('');
            return true;
        }
        return true; // No file selected is valid (not changing profile picture)
    };

    // Mock function to fetch address suggestions
    // In a real application, you would replace this with an actual API call
    const fetchAddressSuggestions = async (value) => {
        if (!value || value.length < 3) {
            setAddressOptions([]);
            return;
        }

        try {
            // Replace this with your actual API call
            // For example: const response = await fetch(`https://api.address.com/search?q=${value}`);
            
            // This is a mock implementation
            setTimeout(() => {
                const mockResults = [
                    // Ho Chi Minh City Districts
                    { value: `${value}, District 1, Ho Chi Minh City` },
                    { value: `${value}, District 2, Ho Chi Minh City` },
                    { value: `${value}, District 3, Ho Chi Minh City` },
                    { value: `${value}, District 4, Ho Chi Minh City` },
                    { value: `${value}, District 5, Ho Chi Minh City` },
                    { value: `${value}, District 6, Ho Chi Minh City` },
                    { value: `${value}, District 7, Ho Chi Minh City` },
                    { value: `${value}, District 8, Ho Chi Minh City` },
                    { value: `${value}, District 9, Ho Chi Minh City` },
                    { value: `${value}, District 10, Ho Chi Minh City` },
                    { value: `${value}, District 11, Ho Chi Minh City` },
                    { value: `${value}, District 12, Ho Chi Minh City` },
                    { value: `${value}, Binh Thanh District, Ho Chi Minh City` },
                    { value: `${value}, Thu Duc City, Ho Chi Minh City` },
                    { value: `${value}, Go Vap District, Ho Chi Minh City` },
                    { value: `${value}, Tan Binh District, Ho Chi Minh City` },
                    { value: `${value}, Tan Phu District, Ho Chi Minh City` },
                    { value: `${value}, Phu Nhuan District, Ho Chi Minh City` },
                    { value: `${value}, Binh Tan District, Ho Chi Minh City` },
                    { value: `${value}, Cu Chi District, Ho Chi Minh City` },
                    { value: `${value}, Hoc Mon District, Ho Chi Minh City` },
                    { value: `${value}, Binh Chanh District, Ho Chi Minh City` },
                    { value: `${value}, Nha Be District, Ho Chi Minh City` },
                    { value: `${value}, Can Gio District, Ho Chi Minh City` },
                    
                    // HCMC Streets and Areas
                    { value: `${value}, Nguyen Hue Walking Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Le Loi Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Dong Khoi Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Bui Vien Walking Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Pham Ngu Lao Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Nguyen Trai Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Vo Van Kiet Boulevard, Ho Chi Minh City` },
                    { value: `${value}, Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City` },
                    { value: `${value}, Hai Ba Trung Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Nguyen Van Linh Parkway, District 7, Ho Chi Minh City` },
                    { value: `${value}, Le Van Sy Street, District 3, Ho Chi Minh City` },
                    { value: `${value}, Phan Xich Long Street, Phu Nhuan District, Ho Chi Minh City` },
                    { value: `${value}, Nguyen Thi Minh Khai Street, District 1, Ho Chi Minh City` },
                    { value: `${value}, Truong Son Street, Tan Binh District, Ho Chi Minh City` },
                    { value: `${value}, Hoang Van Thu Street, Phu Nhuan District, Ho Chi Minh City` },
                    { value: `${value}, Cach Mang Thang Tam Street, District 3, Ho Chi Minh City` },
                    { value: `${value}, Nam Ky Khoi Nghia Street, District 3, Ho Chi Minh City` },
                    { value: `${value}, Tran Hung Dao Street, District 1, Ho Chi Minh City` },
                    
                    // HCMC Landmarks
                    { value: `${value}, Ben Thanh Market, District 1, Ho Chi Minh City` },
                    { value: `${value}, Saigon Central Post Office, District 1, Ho Chi Minh City` },
                    { value: `${value}, Notre Dame Cathedral, District 1, Ho Chi Minh City` },
                    { value: `${value}, Independence Palace, District 1, Ho Chi Minh City` },
                    { value: `${value}, Bitexco Financial Tower, District 1, Ho Chi Minh City` },
                    { value: `${value}, War Remnants Museum, District 3, Ho Chi Minh City` },
                    { value: `${value}, Jade Emperor Pagoda, District 3, Ho Chi Minh City` },
                    { value: `${value}, Saigon Opera House, District 1, Ho Chi Minh City` },
                    { value: `${value}, Phu My Hung, District 7, Ho Chi Minh City` },
                    { value: `${value}, Turtle Lake, District 3, Ho Chi Minh City` },
                    { value: `${value}, Thao Dien, District 2, Ho Chi Minh City` },
                    { value: `${value}, Landmark 81, Binh Thanh District, Ho Chi Minh City` },
                    { value: `${value}, Tan Son Nhat International Airport, Tan Binh District, Ho Chi Minh City` },
                    { value: `${value}, Saigon Zoo and Botanical Gardens, District 1, Ho Chi Minh City` },
                    { value: `${value}, Ky Hoa Park, District 10, Ho Chi Minh City` },
                    { value: `${value}, Suoi Tien Theme Park, Thu Duc City, Ho Chi Minh City` },
                    { value: `${value}, Dam Sen Cultural Park, District 11, Ho Chi Minh City` },
                    { value: `${value}, Phu Tho Stadium, District 11, Ho Chi Minh City` },
                    { value: `${value}, Binh Quoi Tourist Village, Binh Thanh District, Ho Chi Minh City` },
                    { value: `${value}, Vinhomes Central Park, Binh Thanh District, Ho Chi Minh City` },
                    { value: `${value}, Ho Chi Minh City University of Technology, District 10, Ho Chi Minh City` },
                    { value: `${value}, Nguyen Hue Flower Street, District 1, Ho Chi Minh City` },
                    
                    // Hanoi
                    { value: `${value}, Hoan Kiem District, Hanoi` },
                    { value: `${value}, Ba Dinh District, Hanoi` },
                    { value: `${value}, Hai Ba Trung District, Hanoi` },
                    { value: `${value}, Dong Da District, Hanoi` },
                    { value: `${value}, Tay Ho District, Hanoi` },
                    { value: `${value}, Hoang Mai District, Hanoi` },
                    { value: `${value}, Long Bien District, Hanoi` },
                    { value: `${value}, Old Quarter, Hoan Kiem District, Hanoi` },
                    { value: `${value}, West Lake, Tay Ho District, Hanoi` },
                    { value: `${value}, Hoan Kiem Lake, Hoan Kiem District, Hanoi` },
                    
                    // Da Nang
                    { value: `${value}, Hai Chau District, Da Nang` },
                    { value: `${value}, Ngu Hanh Son District, Da Nang` },
                    { value: `${value}, Son Tra District, Da Nang` },
                    { value: `${value}, Marble Mountains, Ngu Hanh Son District, Da Nang` },
                    { value: `${value}, My Khe Beach, Son Tra District, Da Nang` },
                    { value: `${value}, Dragon Bridge, Hai Chau District, Da Nang` },
                    
                    // Other Major Cities
                    { value: `${value}, Hoi An Ancient Town, Quang Nam Province` },
                    { value: `${value}, Nha Trang, Khanh Hoa Province` },
                    { value: `${value}, Da Lat, Lam Dong Province` },
                    { value: `${value}, Vung Tau, Ba Ria-Vung Tau Province` },
                    { value: `${value}, Phan Thiet, Binh Thuan Province` },
                    { value: `${value}, Can Tho, Mekong Delta` },
                    { value: `${value}, Hai Phong City` },
                    { value: `${value}, Hue, Thua Thien Hue Province` },
                    { value: `${value}, Sapa, Lao Cai Province` },
                    { value: `${value}, Ha Long Bay, Quang Ninh Province` }
                ];
                setAddressOptions(mockResults);
            }, 300);
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            setAddressOptions([]);
        }
    };

    const handleAddressSearch = (value) => {
        fetchAddressSuggestions(value);
    };

    const handleAddressSelect = (value) => {
        form.setFieldsValue({ address: value });
    };

    const handleSubmitBtn = async () => {
        // Prevent multiple submissions
        if (loading) return;
        
        // Validate image file
        if (!validateFile()) {
            return;
        }
        
        try {
            setLoading(true);
            const values = await form.validateFields();
            const formData = new FormData();
            Object.keys(values).forEach((key) => formData.append(key, values[key]));

            const fileInput = document.getElementById("fileInput");
            if (fileInput?.files.length > 0) {
                formData.append("file", fileInput.files[0]);
            }

            const response = await updateUserAPI(dataUpdate.id, formData, tokenData.access_token);
            notification.success({
                message: "Update User",
                description: "User updated successfully.",
            });
            resetAndCloseModal();
            await loadUsers();
        } catch (error) {
            notification.error({
                message: "Error Updating User",
                description: error.response?.data?.message || "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to add custom hobby
    const addCustomHobby = () => {
        if (customHobby && customHobby.trim() !== '') {
            const newHobby = customHobby.trim();
            if (!customHobbies.includes(newHobby)) {
                setCustomHobbies([...customHobbies, newHobby]);
            }
            
            // Add to current selection if not already selected
            const currentHobbies = form.getFieldValue('hobbies') || [];
            if (!currentHobbies.includes(newHobby)) {
                form.setFieldsValue({ hobbies: [...currentHobbies, newHobby] });
            }
            
            setCustomHobby('');
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        form.resetFields();
        setDataUpdate(null);
        setLoading(false);
        setFileError('');
        setFileList([]);
        setCustomHobby('');
        setCustomHobbies([]);
    };

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateFile();
        } else {
            setFileError('');
        }
    };

    return (
        <Modal
            title="Edit User"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okText="Update"
            cancelText="Cancel"
            maskClosable={false}
            width={700}
            okButtonProps={{ loading: loading }}
            cancelButtonProps={{ disabled: loading }}
            closable={!loading}
        >
            <Spin spinning={loading} tip="Updating user...">
                <Form form={form} layout="vertical" disabled={loading}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Account Status" name="status" valuePropName="checked">
                                <Switch checkedChildren="Unlock" unCheckedChildren="Lock" />
                            </Form.Item>

                            <Form.Item 
                                label="Full Name" 
                                name="fullName" 
                                rules={[
                                    { required: true, message: "Full name is required." },
                                    { min: 3, message: "Full name must be at least 3 characters." },
                                    { max: 50, message: "Full name must not exceed 50 characters." }
                                ]}
                            >
                                <Input placeholder="Full Name" />
                            </Form.Item>

                            <Form.Item 
                                label="Phone" 
                                name="phone" 
                                rules={[
                                    { required: true, message: "Phone number is required." },
                                    { validator: validatePhoneNumber }
                                ]}
                            >
                                <Input placeholder="Phone" />
                            </Form.Item>

                            <Form.Item label="Hobbies" name="hobbies">
                                <Select
                                    placeholder="Select hobbies"
                                    mode="multiple"
                                    allowClear
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Add custom hobby"
                                                    value={customHobby}
                                                    onChange={(e) => setCustomHobby(e.target.value)}
                                                    style={{ flex: 'auto' }}
                                                />
                                                <Button
                                                    type="text"
                                                    style={{ flex: 'none', marginLeft: '8px' }}
                                                    onClick={addCustomHobby}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                >
                                    <Select.Option value="Reading">Reading</Select.Option>
                                    <Select.Option value="Sports">Sports</Select.Option>
                                    <Select.Option value="Traveling">Traveling</Select.Option>
                                    <Select.Option value="Photography">Photography</Select.Option>
                                    <Select.Option value="Cooking">Cooking</Select.Option>
                                    <Select.Option value="Drawing">Drawing</Select.Option>
                                    <Select.Option value="Music">Music</Select.Option>
                                    <Select.Option value="Gaming">Gaming</Select.Option>
                                    <Select.Option value="Dancing">Dancing</Select.Option>
                                    <Select.Option value="Gardening">Gardening</Select.Option>
                                    <Select.Option value="Fishing">Fishing</Select.Option>
                                    <Select.Option value="Hiking">Hiking</Select.Option>
                                    <Select.Option value="Swimming">Swimming</Select.Option>
                                    <Select.Option value="Cycling">Cycling</Select.Option>
                                    <Select.Option value="Yoga">Yoga</Select.Option>
                                    {customHobbies.map(hobby => (
                                        <Select.Option key={hobby} value={hobby}>{hobby}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item 
                                label="Age" 
                                name="age" 
                                rules={[
                                    { required: true, message: "Valid age is required." },
                                    { type: 'number', message: "Age must be a number." },
                                    { validator: validateAge }
                                ]}
                            >
                                <Input type="number" placeholder="Age" min={18} max={100} />
                            </Form.Item>

                            <Form.Item label="Marital Status" name="maritalStatus" rules={[{ required: true, message: "Marital status is required." }]}>
                                <Select placeholder="Marital Status">
                                    <Select.Option value="SINGLE">Single</Select.Option>
                                    <Select.Option value="MARRIED">Married</Select.Option>
                                    <Select.Option value="FA">Forever Alone</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Role" name="role" rules={[{ required: true, message: "Role is required." }]}>
                                <Select placeholder="Role">
                                    <Select.Option value="ADMIN">Admin</Select.Option>
                                    <Select.Option value="USER">User</Select.Option>
                                    <Select.Option value="MANAGER">Manager</Select.Option>
                                    <Select.Option value="TRAINER">Trainer</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Gender is required." }]}>
                                <Select placeholder="Gender">
                                    <Select.Option value="MALE">Male</Select.Option>
                                    <Select.Option value="FEMALE">Female</Select.Option>
                                    <Select.Option value="OTHER">Other</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Address" name="address">
                                <AutoComplete
                                    options={addressOptions}
                                    onSearch={handleAddressSearch}
                                    onSelect={handleAddressSelect}
                                    placeholder="Type to search for address"
                                />
                            </Form.Item>

                            <Form.Item 
                                label="Description" 
                                name="description"
                                rules={[
                                    { max: 500, message: "Description must not exceed 500 characters." }
                                ]}
                            >
                                <Input.TextArea 
                                    placeholder="Description" 
                                    rows={4}
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item label="Profile Picture">
                                <Input 
                                    id="fileInput" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                />
                                {fileError && <div style={{ color: 'red', marginTop: '5px' }}>{fileError}</div>}
                                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                                    Accepted formats: JPG, PNG, GIF. Max size: 5MB
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default UpdateUser;