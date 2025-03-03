import React, { useState } from "react";
import "../../../assets/css/Main/ChatInput.css";

const ChatInput = ({ onSend }) => {
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents newline in input
            handleSendMessage();
        }
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown} // Add Enter key event
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatInput;
