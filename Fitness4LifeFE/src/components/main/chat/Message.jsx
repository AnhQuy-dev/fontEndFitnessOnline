import React from "react";
import "../../../assets/css/Main/Message.css";

const Message = ({ text, sender }) => {
    return (
        <div className={`message ${sender}`}>
            <p>{text}</p>
        </div>
    );
};

export default Message;
