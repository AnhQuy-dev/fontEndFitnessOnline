// import React, { useState } from "react";
// import "../../../assets/css/Main/Chatbot.css";

// import Message from "./Message";
// import ChatInput from "./ChatInput";
// import { sendMessageToGemini } from "../../../serviceToken/openAIService";

// const Chatbot = () => {
//     const [messages, setMessages] = useState([
//         { text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" },
//     ]);

//     const handleSendMessage = async (message) => {
//         const newMessages = [...messages, { text: message, sender: "user" }];
//         setMessages(newMessages);

//         const botResponse = await sendMessageToGemini(
//             `Bạn là một trợ lý AI chuyên nghiệp. Hãy trả lời ngắn gọn, lịch sự và đúng trọng tâm theo phong cách sau:
//             - Nếu ai hỏi về thời tiết, trả lời theo dạng: "Hôm nay trời đẹp, nhiệt độ khoảng 28°C."
//             - Nếu ai hỏi về trang web này là gì thì: trả lời theo dạng: "Trang web này có tên là FITNESSFORLIFE hoạt động về lĩnh vực gym tổng hợp. ở đây bạn có thể tham khảo các dịch vụ của FITNESSFORLIFE cùng với đó là diễn đàn trò chuyện chia sẽ kiến thức kinh nghiệm với nhau."
//             - Nếu ai hỏi về giá sản phẩm hoặc có những sản phẩm nào, trả lời theo dạng: "Sản phẩm hiện tại có giá X VNĐ. với các gói tập theo từng mức giá khác nhau bạn có thể vào MEMBERSHIP để tham khảo thử"
//             - Nếu ai hỏi về khuyến mãi, trả lời theo dạng: "Chúng tôi đang có chương trình giảm giá XX% đến ngày YY. và các hoạt động thú vị khi bạn tham gia với chúng tôi"
//             - Nếu ai hỏi về tôi có thể đăng kí tài khoản thế nào:, trả lời theo dạng :" chúng tôi có tích hợp chức năng login và đăng ký vào trang web. bạn có thể click vào nút login ở góc phía trên bên phải màn hình để login hoặc đanh kí tài khoản"
//             Người dùng: ${message}
//             Trợ lý AI:`
//         );

//         setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
//     };

//     return (
//         <div className="chatbot">
//             <div className="chat-window">
//                 {messages.map((msg, index) => (
//                     <Message key={index} text={msg.text} sender={msg.sender} />
//                 ))}
//             </div>
//             <ChatInput onSend={handleSendMessage} />
//         </div>
//     );
// };

// export default Chatbot;
import React, { useState } from "react";
import "../../../assets/css/Main/Chatbot.css";

import Message from "./Message";
import ChatInput from "./ChatInput";
import { sendMessageToGemini } from "../../../serviceToken/openAIService";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you?", sender: "bot" },
    ]);

    const detectLanguage = (text) => {
        const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
        return vietnameseChars.test(text) ? "vi" : "en";
    };

    const handleSendMessage = async (message) => {
        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);

        const language = detectLanguage(message);

        const botPrompt = language === "vi"
            ? `Bạn là một trợ lý AI chuyên nghiệp. Hãy trả lời ngắn gọn, lịch sự và đúng trọng tâm theo phong cách sau:
            - Nếu ai hỏi về thời tiết, trả lời theo dạng: "Hôm nay trời đẹp, nhiệt độ khoảng 28°C."
            - Nếu ai hỏi về trang web này là gì thì: trả lời theo dạng: "Trang web này có tên là FITNESSFORLIFE hoạt động về lĩnh vực gym tổng hợp. Ở đây bạn có thể tham khảo các dịch vụ của FITNESSFORLIFE cùng với đó là diễn đàn trò chuyện chia sẻ kiến thức kinh nghiệm với nhau."
            - Nếu ai hỏi về giá sản phẩm hoặc có những sản phẩm nào, trả lời theo dạng: "Sản phẩm hiện tại có giá X VNĐ. Với các gói tập theo từng mức giá khác nhau, bạn có thể vào MEMBERSHIP để tham khảo thử."
            - Nếu ai hỏi về khuyến mãi, trả lời theo dạng: "Chúng tôi đang có chương trình giảm giá XX% đến ngày YY, cùng các hoạt động thú vị khi bạn tham gia với chúng tôi."
            - Nếu ai hỏi về cách đăng ký tài khoản, trả lời theo dạng: "Chúng tôi có tích hợp chức năng đăng nhập và đăng ký trên trang web. Bạn có thể nhấn vào nút Login ở góc trên bên phải màn hình để đăng nhập hoặc đăng ký tài khoản."
            Người dùng: ${message}
            Trợ lý AI:`
            : `You are a professional AI assistant. Please respond briefly, politely, and to the point in the following style:
            - If someone asks about the weather, respond like: "Today's weather is nice, around 28°C."
            - If someone asks what this website is about, respond like: "This website is called FITNESSFORLIFE and operates in the comprehensive gym industry. Here, you can explore FITNESSFORLIFE's services as well as join a forum to share knowledge and experiences."
            - If someone asks about product prices or available products, respond like: "The current product price is X VND. We offer different training packages at various price points. You can check the MEMBERSHIP section for details."
            - If someone asks about promotions, respond like: "We are currently offering a XX% discount until YY, along with exciting activities when you join us."
            - If someone asks how to register an account, respond like: "We have integrated login and registration features on the website. You can click the Login button in the top right corner of the screen to log in or register an account."
            User: ${message}
            AI Assistant:`;

        const botResponse = await sendMessageToGemini(botPrompt);

        setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    };

    return (
        <div className="chatbot">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <Message key={index} text={msg.text} sender={msg.sender} />
                ))}
            </div>
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
};

export default Chatbot;
