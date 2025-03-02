import React, { useState, useEffect } from 'react';
import { getTokenData } from '../../serviceToken/tokenUtils';
import { fetchAllTrainer } from '../../serviceToken/TrainerSERVICE';

const OurTeam = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("trainers", trainers);

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        setLoading(true);
        const tokenData = getTokenData();
        const response = await fetchAllTrainer(tokenData.access_token);
        
        if (response && Array.isArray(response.data)) {
          setTrainers(response.data);
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error('Error loading trainers:', error);
        setError('Failed to load trainers');
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, []);

  // CSS for consistent image sizing
  const imageContainerStyle = {
    width: '100%',
    height: '250px', // Fixed height for all image containers
    overflow: 'hidden',
    position: 'relative'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top'
  };

  return (
    <section id="our-team">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title wow fadeInDown">Our Team</h2>
          <p className="wow fadeInDown">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa <br />
            semper aliquam quis mattis quam.
          </p>
        </div>

        <div className="row text-center">
          {loading ? (
            <div className="col-12">
              <p>Loading trainers...</p>
            </div>
          ) : error ? (
            <div className="col-12">
              <p>Error: {error}</p>
            </div>
          ) : (
            trainers.map((trainer, index) => (
              <div className="col-md-3 col-sm-6 col-xs-12" key={trainer.id || index}>
                <div
                  className="team-member wow fadeInUp"
                  data-wow-duration="400ms"
                  data-wow-delay={`${index * 100}ms`}
                >
                  <div className="team-img" style={imageContainerStyle}>
                    <img 
                      style={imageStyle}
                      src={trainer.photo || `../../assets/images/team/0${(index % 4) + 1}.jpg`} 
                      alt={trainer.fullName} 
                    />
                  </div>
                  <div className="team-info">
                    <h3>{trainer.fullName}</h3>
                    <span>{trainer.specialization || 'Trainer'}</span>
                  </div>
                  <ul className="social-icons">
                    <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                    <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;