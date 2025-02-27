import React from 'react';
import aboutImage from '../../assets/images/about.png'; // Adjust path if needed

const About = () => {
  return (
    <section id="about">
      <div className="container">

        <div className="section-header">
          <h2 className="section-title wow fadeInDown">Who we are</h2>
          <p className="wow fadeInDown">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa <br /> semper aliquam quis mattis quam.
          </p>
        </div>

        <div className="row">
          <div className="col-sm-6 wow fadeInLeft">
            <img className="img-responsive" src={aboutImage} alt="About Us" />
          </div>

          <div className="col-sm-6 wow fadeInRight">
            <h3 className="column-title">Our Fitness Studio</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa semper aliquam quis mattis quam. Morbi vitae tortor tempus, placerat leo et, suscipit lectus. Phasellus ut euismod massa, eu eleifend ipsum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa semper aliquam quis mattis quam adipiscing elit. Praesent eget risus vitae massa.
            </p>
            <ul className="listarrow">
              <li><i className="fa fa-angle-double-right"></i>Aerobic</li>
              <li><i className="fa fa-angle-double-right"></i>Cardio</li>
              <li><i className="fa fa-angle-double-right"></i>Abdomen</li>
              <li><i className="fa fa-angle-double-right"></i>Special Trainer</li>
              <li><i className="fa fa-angle-double-right"></i>Round the clock</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
