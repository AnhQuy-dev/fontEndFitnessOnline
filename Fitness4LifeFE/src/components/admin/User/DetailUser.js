import { Drawer, Descriptions, Typography, Image } from "antd";
import "../../../assets/css/user.css";

const { Title, Text } = Typography;

const ViewUserDetail = (props) => {
    const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;

    return (
        <Drawer
            title={<Title level={4}>User Detail</Title>}
            onClose={() => {
                setDataDetail(null);
                setIsDataDetailOpen(false);
            }}
            open={isDataDetailOpen}
            width={500}
            footer={
                <Text type="secondary">
                    Please contact support for more user details if needed.
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
                        <Descriptions.Item label="Full Name">{dataDetail.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{dataDetail.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{dataDetail.phone}</Descriptions.Item>
                        <Descriptions.Item label="Role">{dataDetail.role}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{dataDetail.gender}</Descriptions.Item>
                        {dataDetail.profileDTO && (
                            <>
                                <Descriptions.Item label="Hobbies">{dataDetail.profileDTO.hobbies}</Descriptions.Item>
                                <Descriptions.Item label="Address">{dataDetail.profileDTO.address}</Descriptions.Item>
                                <Descriptions.Item label="Age">{dataDetail.profileDTO.age}</Descriptions.Item>
                                <Descriptions.Item label="Marital Status">
                                    {dataDetail.profileDTO.maritalStatus}
                                </Descriptions.Item>
                                <Descriptions.Item label="Description">
                                    {dataDetail.profileDTO.description}
                                </Descriptions.Item>
                            </>
                        )}
                    </Descriptions>
                    {dataDetail.profileDTO?.avatar && (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <Title level={5}>Avatar</Title>
                            <Image
                                src={dataDetail.profileDTO.avatar}
                                alt="Avatar"
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "50%",
                                    border: "2px solid #d9d9d9",
                                }}
                                placeholder
                            />
                        </div>
                    )}
                </>
            ) : (
                <div style={{ textAlign: "center", color: "red" }}>
                    <h3>Don't have anything here!</h3>
                </div>
            )}
        </Drawer>
    );
};

export default ViewUserDetail;
