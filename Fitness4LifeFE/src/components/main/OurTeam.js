import React, { useState, useEffect } from 'react';
import { getTokenData } from '../../serviceToken/tokenUtils';
import { fetchAllTrainer } from '../../serviceToken/TrainerSERVICE';
import { Carousel, Card, Spin, Alert, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../../assets/css/Main/TrainerHome.css'
const OurTeam = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = React.createRef();
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

  // Carousel navigation handlers
  const next = () => {
    carouselRef.current.next();
  };

  const previous = () => {
    carouselRef.current.prev();
  };

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section id="our-team" style={{ padding: '60px 0' }}>
      <div className="container">
        <div className="section-header text-center" style={{ marginBottom: '40px' }}>
          <h2 className="section-title wow fadeInDown">Our Team</h2>
          <p className="wow fadeInDown">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa <br />
            semper aliquam quis mattis quam.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" tip="Loading trainers..." />
          </div>
        ) : error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        ) : (
          <div className="team-carousel-container">
            <div style={{ position: 'relative' }}>
              <Button
                className="carousel-button prev"
                onClick={previous}
                icon={<LeftOutlined />}
                shape="circle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-20px',
                  zIndex: 2,
                  transform: 'translateY(-50%)'
                }}
              />

              <Carousel ref={carouselRef} {...carouselSettings}>
                {trainers.map((trainer, index) => (
                  <div key={trainer.id || index} style={{ padding: '0 10px' }}>
                    <Card
                      hoverable
                      className="team-member wow fadeInUp"
                      cover={
                        <div style={{ height: '250px', overflow: 'hidden' }}>
                          <img
                            alt={trainer.fullName}
                            src={trainer.photo || `../../assets/images/team/0${(index % 4) + 1}.jpg`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center top'
                            }}
                          />
                        </div>
                      }
                      bodyStyle={{ textAlign: 'center', padding: '20px' }}
                    >
                      <Card.Meta
                        title={trainer.fullName}
                        description={trainer.specialization || 'Trainer'}
                      />
                      <div className="social-icons" style={{ marginTop: '15px' }}>
                        <a href="#" style={{ margin: '0 5px' }}><i className="fa fa-facebook"></i></a>
                        <a href="#" style={{ margin: '0 5px' }}><i className="fa fa-twitter"></i></a>
                        <a href="#" style={{ margin: '0 5px' }}><i className="fa fa-google-plus"></i></a>
                        <a href="#" style={{ margin: '0 5px' }}><i className="fa fa-linkedin"></i></a>
                      </div>
                    </Card>
                  </div>
                ))}
              </Carousel>

              <Button
                className="carousel-button next"
                onClick={next}
                icon={<RightOutlined />}
                shape="circle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-20px',
                  zIndex: 2,
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeam;