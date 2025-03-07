import axios from "axios";

const API_KEY = "AIzaSyD5ReNviWXwMzk29ZzHhKVU0cXQm4j61Sk"; // Thay bằng API Key của bạn
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const sendMessageToGemini = async (message) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                contents: [
                    {
                        parts: [{ text: message }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn đến Gemini:", error.response?.data || error.message);
        return "Lỗi khi kết nối với AI.";
    }
};
