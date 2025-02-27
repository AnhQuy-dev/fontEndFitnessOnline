import React from "react";
import "../../../assets/css/AdDisplay.css";


const AdDisplay = () => {
    const ads = [
        {
            title: "Giảm giá 50% cho sản phẩm mới",
            description: "Nhận ngay ưu đãi khi mua sản phẩm trong tuần này!",
            image: "https://via.placeholder.com/300x180",
            link: "#",
        },
        {
            title: "Mua 1 tặng 1",
            description: "Chương trình áp dụng đến hết tháng này!",
            image: "https://via.placeholder.com/300x180",
            link: "#",
        },
        {
            title: "Ưu đãi độc quyền",
            description: "Giảm giá 30% cho tất cả sản phẩm khi đặt qua app.",
            image: "https://via.placeholder.com/300x180",
            link: "#",
        },
    ];

    return (
        <div className="ad-display-container">
            {ads.map((ad, index) => (
                <div className="ad-box" key={index}>
                    <img src={ad.image} alt={ad.title} />
                    <h4 className="ad-title">{ad.title}</h4>
                    <p className="ad-description">{ad.description}</p>
                    <a href={ad.link} className="ad-button">
                        Xem Chi Tiết
                    </a>
                </div>
            ))}
        </div>
    );
};

export default AdDisplay;
