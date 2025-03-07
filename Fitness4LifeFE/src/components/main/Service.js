import React from 'react';

const services = [
  { icon: "fa-futbol-o", title: "Aerobic", description: "Backed by some of the biggest names in the industry, Firefox OS is an open platform that fosters greater" },
  { icon: "fa-compass", title: "Cardio", description: "Backed by some of the biggest names in the industry, Firefox OS is an open platform that fosters greater" },
  { icon: "fa-database", title: "Six Pack", description: "Morbi vitae tortor tempus, placerat leo et, suscipit lectus. Phasellus ut euismod massa, eu eleifend ipsum." },
  { icon: "fa-bar-chart", title: "Classes", description: "Morbi vitae tortor tempus, placerat leo, suscipit lectus. Phasellus ut euismod massa, eu eleifend ipsum." },
  { icon: "fa-paper-plane-o", title: "Special Trainer", description: "Morbi vitae tortor tempus, placerat leo et, suscipit lectus. Phasellus ut euismod massa, eu eleifend ipsum." },
  { icon: "fa-bullseye", title: "Health Sports", description: "Morbi vitae tortor tempus, placerat leo et, suscipit lectus. Phasellus ut euismod massa, eu eleifend ipsum." }
];

const Service = () => {
  return (
    <section id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title wow fadeInDown">Whats Best For You</h2>
          <p className="wow fadeInDown">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa <br /> semper aliquam quis mattis quam.
          </p>
        </div>
        <div className="row">
          <div className="features">
            {services.map((service, index) => (
              <div
                key={index}
                className="col-md-3.5 col-sm-6 wow fadeInUp"
                data-wow-duration="300ms"
                data-wow-delay={`${index * 100}ms`}
              >
                <div className="media service-box">
                  <div className="pull-left">
                    <i className={`fa ${service.icon}`}></i>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">{service.title}</h4>
                    <p>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
