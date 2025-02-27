import React from "react";
import { Layout, Row, Col } from "antd";
import ForumSidebar from "./ForumSidebar";
import RecommendedArticles from "./RecommendedArticles";
import { Outlet, useLocation } from "react-router-dom";
import AdDisplay from "./AdDisplay";
const { Sider, Content } = Layout;

const ForumLayout = () => {
    const location = useLocation();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Thanh menu bên trái */}
            <Sider theme="light" width={250} style={{ background: "#fff" }}>
                <ForumSidebar />
                <AdDisplay />
            </Sider>

            {/* Nội dung chính + Bài viết đề xuất */}
            <Layout style={{ padding: "16px" }}>
                <Row gutter={[16, 16]}>
                    {/* Nội dung chính */}
                    <Col xs={24} md={16} lg={18}>
                        <Content style={{ background: "#f0f2f5", padding: "16px" }}>
                            <Outlet />
                        </Content>
                    </Col>

                    {/* Bài viết đề xuất (chỉ hiển thị ở /forums) */}
                    {location.pathname === "/forums" && (
                        <Col xs={24} md={8} lg={6}>
                            <Content
                                style={{
                                    background: "#ffffff",
                                    padding: "16px",
                                    borderLeft: "1px solid #f0f0f0",
                                    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                <RecommendedArticles />
                                <AdDisplay /> {/* Hiển thị quảng cáo */}
                            </Content>
                        </Col>
                    )}
                </Row>
            </Layout>
        </Layout>
    );
};

export default ForumLayout;
