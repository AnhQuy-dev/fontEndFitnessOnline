import React from 'react';
import teamMember1 from '../../assets/images/team/01.jpg';
import teamMember2 from '../../assets/images/team/02.jpg';
import teamMember3 from '../../assets/images/team/03.jpg';
import teamMember4 from '../../assets/images/team/04.jpg';

const teamMembers = [
  { name: 'Micky Deo', position: 'Founder', img: teamMember1, delay: '0ms' },
  { name: 'Mike Timobbs', position: 'Sr. Trainer', img: teamMember2, delay: '100ms' },
  { name: 'Remo Silvaus', position: 'Sr. Trainer', img: teamMember3, delay: '200ms' },
  { name: 'Niscal Deon', position: 'Jr. Trainer', img: teamMember4, delay: '300ms' },
];

const OurTeam = () => {
  return (
    <section id="our-team">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title wow fadeInDown">OUR TRAINERS</h2>
          <p className="wow fadeInDown">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa <br />
            semper aliquam quis mattis quam.
          </p>
        </div>

        <div className="row text-center">
          {teamMembers.map((member, index) => (
            <div className="col-md-3 col-sm-6 col-xs-12" key={index}>
              <div
                className="team-member wow fadeInUp"
                data-wow-duration="400ms"
                data-wow-delay={member.delay}
              >
                <div className="team-img">
                  <img className="img-responsive" src={member.img} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span>{member.position}</span>
                </div>
                <ul className="social-icons">
                  <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                  <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
