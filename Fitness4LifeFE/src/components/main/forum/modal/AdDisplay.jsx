import React from "react";
import "../../../../assets/css/AdDisplay.css";


const AdDisplay = () => {
    const ads = [
        {
            title: "50% Off on New Products",
            description: "Get special offers when buying products this week!",
            image: "https://via.placeholder.com/300x180",
            link: "#",
        },
        {
            title: "Buy One Get One Free",
            description: "Promotion applies until the end of this month!",
            image: "https://via.placeholder.com/300x180",
            link: "#",
        },
        {
            title: "Exclusive Offer",
            description: "30% off on all products when ordering through the app.",
            image: "https://via.placeholder.com/300x180",
            link: "#",
        },
    ];

    return (
        <div className="ad-display-container">
            {ads.map((ad, index) => (
                <div className="ad-box" key={index}>
                    <div className="running-dots"></div>
                    <div className="border-gradient"></div>
                    <div className="shine"></div>
                    <div className="ad-content">
                        <img src={ad.image} alt={ad.title} />
                        <h4 className="ad-title">{ad.title}</h4>
                        <p className="ad-description">{ad.description}</p>
                        <a href={ad.link} className="ad-button">
                            <span>View Details</span>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdDisplay;
