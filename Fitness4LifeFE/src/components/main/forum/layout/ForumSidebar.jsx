// ForumSidebar.jsx
import React from "react";
import { Menu, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const forumMenuItems = [
    { key: "1", label: "WHAT'S NEW", path: "/forums/whats-new" },
    { key: "2", label: "NEW POSTS", path: "/forums/post-new" },
    { key: "3", label: "LATEST ACTIVITY", path: "/forums/#" },
    { key: "4", label: "FORUM-HOME", path: "/forums" },
    { key: "5", label: "...", path: "/forum/#" }
];

const ForumSidebar = () => {
    const navigate = useNavigate();

    const handleMenuClick = (menuItem) => {
        navigate(menuItem.path); // Navigate to the menu path
    };

    return (
        <section id="services">
            <div style={{ height: "100%", background: "#fff", padding: "16px" }}>
                <Title level={4} style={{ textAlign: "center" }}>Forum Menu</Title>
                <Menu
                    mode="inline"
                    onClick={(item) =>
                        handleMenuClick(forumMenuItems.find((menu) => menu.key === item.key))
                    }
                    items={forumMenuItems.map((menu) => ({
                        key: menu.key,
                        icon: <FileTextOutlined />,
                        label: menu.label
                    }))}
                />
            </div>
        </section>
    );
};

export default ForumSidebar;
