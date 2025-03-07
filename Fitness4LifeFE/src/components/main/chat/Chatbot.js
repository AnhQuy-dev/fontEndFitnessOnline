import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/Main/Chatbot.css";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { sendMessageToGemini } from "../../../serviceToken/openAIService";

const Chatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you?", sender: "bot" },
    ]);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const detectLanguage = (text) => {
        const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
        return vietnameseChars.test(text) ? "vi" : "en";
    };

    const predefinedResponses = {
        vi: [
            {
                keywords: ["đăng ký tài khoản", "cách đăng ký tài khoản", "tạo tài khoản", "mở tài khoản"],
                response: `Bạn có thể đăng ký tài khoản tại <a href="/register">page register</a>. Nếu gặp vấn đề, vui lòng liên hệ <a href="/support">Hỗ trợ</a>.`
            },
            {
                keywords: ["giới thiệu trang web", "trang web này là gì", "FITNESS4ONLINE là gì"],
                response: `FITNESS4ONLINE là nền tảng cung cấp dịch vụ tập luyện thể thao, hỗ trợ bạn xây dựng lối sống khỏe mạnh. Tìm hiểu thêm tại <a href="/contact-us">Giới thiệu</a>.`
            },
            {
                keywords: ["Gym", "Fitness", "Bodybuilding", "Strength Training", "Cardio",
                    "Nutrition", "Supplements", "Fun Fitness Forum Policies"
                ],
                response: (keyword) =>
                    `Bạn có thể xem các bài viết hướng dẫn tại <a href="/blog?category=${encodeURIComponent(keyword)}">Blog về ${keyword}</a>.`
            },
            {
                keywords: ["Fun Fitness Forum Policies", "Forum Rules",
                    "Men's Fitness Program", "Women's Fitness Program", "General Bodybuilding Program",
                    "Fitness Q&A", "Exercise Form & Technique Correction", "Nutrition Experience", "Supplement Reviews",
                    "Weight Loss & Fat Loss Q&A", "Muscle Gain & Weight Gain Q&A", "Transformation Journal",
                    "Fitness Related Chats", "Fitness Trainers - Job Exchange", "National Gym Clubs",
                    "Find Workout Partners - Team Workout", "Supplement Marketplace", "Training Equipment & Accessories",
                    "Gym Transfer & Sales", "Mixed Martial Arts (MMA)", "CrossFit", "Powerlifting"
                ],
                response: (keyword) =>
                    `Bạn có thể tham gia thảo luận tại <a href="/forums/forum?category=${encodeURIComponent(keyword)}">Forum</a>.`
            },
            {
                keywords: ["mua gói tập", "đăng ký tập gym", "gói thành viên", "membership"],
                response: `Bạn có thể xem các gói tập tại <a href="/packageMain">Membership</a> và chọn gói phù hợp.`
            },
            {
                keywords: ["hỗ trợ kỹ thuật", "tài khoản bị lỗi", "không đăng nhập được"],
                response: `Nếu bạn gặp sự cố kỹ thuật, vui lòng truy cập <a href="/contact-us">Hỗ trợ</a> hoặc liên hệ admin.`
            },
            {
                keywords: ["cách thanh toán", "phương thức thanh toán", "thanh toán online"],
                response: `Chúng tôi hỗ trợ thanh toán qua paypal hoặc tại quầy. Xem hướng dẫn chi tiết tại.`
            },
            {
                keywords: ["hoàn tiền", "chính sách hoàn tiền", "hủy gói tập"],
                response: `Bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ khi đăng ký. Chi tiết tại <a href="/refund-policy">Chính sách hoàn tiền</a>.`
            }
        ],
        en: [
            {
                keywords: ["register an account", "how to register", "create account", "sign up"],
                response: `You can register at <a href="/login">Register an account</a>. If you have any issues, please visit <a href="/support">Support</a>.`
            },
            {
                keywords: ["about this website", "what is this website", "what is FITNESS4ONLINE"],
                response: `FITNESS4ONLINE is a platform that provides fitness training services and helps you build a healthy lifestyle. Learn more at <a href="/about">About Us</a>.`
            },
            {
                keywords: ["Gym", "Fitness", "Bodybuilding", "Strength Training", "Cardio",
                    "Nutrition", "Supplements"
                ],
                response: (keyword) =>
                    `You can check out our guides on <a href="/blog?category=${encodeURIComponent(keyword)}">Blog about ${keyword}</a>.`
            },
            {
                keywords: ["Fun Fitness Forum Policies", "Forum Rules",
                    "Men's Fitness Program", "Women's Fitness Program", "General Bodybuilding Program",
                    "Fitness Q&A", "Exercise Form & Technique Correction", "Nutrition Experience", "Supplement Reviews",
                    "Weight Loss & Fat Loss Q&A", "Muscle Gain & Weight Gain Q&A", "Transformation Journal",
                    "Fitness Related Chats", "Fitness Trainers - Job Exchange", "National Gym Clubs",
                    "Find Workout Partners - Team Workout", "Supplement Marketplace", "Training Equipment & Accessories",
                    "Gym Transfer & Sales", "Mixed Martial Arts (MMA)", "CrossFit", "Powerlifting"
                ],
                response: (keyword) =>
                    `You can check out with the community in the <a href="/forums/forum?category=${encodeURIComponent(keyword)}">Forum</a>.`
            },
            {
                keywords: ["buy training package", "register for gym", "membership options"],
                response: `You can explore different membership plans at <a href="/membership">Membership</a> and choose the one that suits you best.`
            },
            {
                keywords: ["technical support", "account issue", "login problem"],
                response: `If you encounter any technical issues, please visit <a href="/support">Support</a> or contact our administrator.`
            },
            {
                keywords: ["payment methods", "how to pay", "online payment"],
                response: `We support payments via credit card, PayPal, and bank transfer. Find more details at <a href="/payment">Payment</a>.`
            },
            {
                keywords: ["refund policy", "how to get a refund", "cancel membership"],
                response: `You can request a refund within 7 days of purchase. Read our <a href="/refund-policy">Refund Policy</a> for more details.`
            }
        ]
    };

    const findPredefinedResponse = (message, language) => {
        const responses = predefinedResponses[language] || [];
        const lowerMessage = message.toLowerCase();

        for (let item of responses) {
            for (let keyword of item.keywords) {
                const lowerKeyword = keyword.toLowerCase();
                const keywordParts = lowerKeyword.split(/\s*[-\s]\s*/); // Cắt từ theo dấu '-' hoặc khoảng trắng
                const matchCount = keywordParts.filter(part => lowerMessage.includes(part)).length;

                // Nếu ít nhất 50% từ trong keyword khớp với message, chấp nhận nó
                if (matchCount / keywordParts.length >= 0.5) {
                    return typeof item.response === "function"
                        ? item.response(keyword)
                        : item.response;
                }
            }
        }
        return null;
    };


    const handleSendMessage = async (message) => {
        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);

        const language = detectLanguage(message);
        let botResponse = findPredefinedResponse(message, language);

        if (!botResponse) {
            const botPrompt = language === "vi"
                ? `Bạn là trợ lý AI. Trả lời ngắn gọn theo phong cách FITNESS4ONLINE.\n\nNgười dùng: ${message}\nTrợ lý AI:`
                : `You are an AI assistant for FITNESS4ONLINE. Answer briefly.\n\nUser: ${message}\nAI Assistant:`;

            botResponse = await sendMessageToGemini(botPrompt);
        }

        setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    };

    const handleLinkClick = (event, link) => {
        event.preventDefault();
        navigate(link);
    };

    return (
        <div className="chatbot">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <Message key={index} text={msg.text} sender={msg.sender} onLinkClick={handleLinkClick} />
                ))}
                <div ref={chatEndRef} />
            </div>
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
};

export default Chatbot;
