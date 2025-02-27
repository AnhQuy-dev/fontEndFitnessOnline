import React from 'react';

const HeroBanner = () => {
  return (
    <section id="hero-banner">
      <div className="banner-inner">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h2>
                Stronger than <b>EVER</b>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisici <br /> Praesent eget risus.
              </p>
              <a className="btn btn-primary btn-lg" href="#">
                Start Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
