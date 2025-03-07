import React, { useState } from "react";
import { Input, Button } from "antd"; // Import Ant Design
import { SendOutlined } from "@ant-design/icons"; // Biểu tượng gửi tin nhắn
import "../../../assets/css/Main/ChatInput.css";

const ChatInput = ({ onSend }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="chat-input">
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onPressEnter={handleSend} // Xử lý Enter với Ant Design
            />
            <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSend}
                size="large"
            />
        </div>
    );
};

export default ChatInput;
