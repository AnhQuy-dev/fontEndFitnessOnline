import React from "react";
import { Card } from "antd"; // Import Ant Design
import "../../../assets/css/Main/Message.css";

const Message = ({ text, sender, onLinkClick }) => {
    const renderMessage = (text) => {
        return text.split(/(<a href=".*?">.*?<\/a>)/g).map((part, index) => {
            const match = part.match(/<a href="(.*?)">(.*?)<\/a>/);
            if (match) {
                return (
                    <a
                        key={index}
                        href={match[1]}
                        onClick={(e) => onLinkClick(e, match[1])}
                        className="message-link"
                    >
                        {match[2]}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <Card className={`message ${sender}`} bordered={false}>
            {renderMessage(text)}
        </Card>
    );
};

export default Message;
