import React from "react";
import img1 from '../../assets/images/portfolio/01.jpg';
import img2 from '../../assets/images/portfolio/02.jpg';
import img3 from '../../assets/images/portfolio/03.jpg';
import img4 from '../../assets/images/portfolio/04.jpg';
import img5 from '../../assets/images/portfolio/05.jpg';
import img6 from '../../assets/images/portfolio/06.jpg';
import img7 from '../../assets/images/portfolio/07.jpg';
import img8 from '../../assets/images/portfolio/08.jpg';

const portfolioItems = [
  { src: img1, categories: "designing" },
  { src: img2, categories: "mobile development" },
  { src: img3, categories: "designing" },
  { src: img4, categories: "mobile" },
  { src: img5, categories: "designing development" },
  { src: img6, categories: "mobile" },
  { src: img7, categories: "designing development" },
  { src: img8, categories: "mobile" }
];


const Portfolio = () => {
  return (
    <section id="portfolio">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title wow fadeInDown">Gallery</h2>
          <p className="wow fadeInDown">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa
            <br /> semper aliquam quis mattis quam.
          </p>
        </div>
      
        <div className="portfolio-items">
          
          {portfolioItems.map((item, index) => (
            <div key={index} className={`portfolio-item ${item.categories}`}>
              <div className="portfolio-item-inner">
                <img className="img-responsive" src={item.src} alt="" />
                <div className="portfolio-info">
                  <a className="preview" href={item.src} rel="prettyPhoto">
                    <i className="fa fa-eye"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
