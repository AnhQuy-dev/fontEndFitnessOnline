import React from 'react';
import '../../assets/css/footer.css'; // Create a CSS file for styling if needed
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer-v1">
      <div className="footer">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-md-3" style={{ marginBottom: '40px' }}>
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Link to="/" className="logo"> <div className="logo-name" style={{ fontSize: "28px" }}><span>FITNESS</span>4LIFE</div></Link>
             
            </div>
              <p>At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.</p>
              <p>Our mission is to deliver high quality, affordable healthcare services to the broader population in India.</p>
            </div>

            {/* Latest Posts Section */}
            <div className="col-md-3" style={{ marginBottom: '40px' }}>
              <div className="posts">
                <div className="headline"><h2>Latest Posts</h2></div>
                <ul className="list-unstyled latest-list">
                  <li><a href="/blog">Incredible content</a><small>December 16, 2020</small></li>
                  <li><a href="/gallery">Latest Images</a><small>December 16, 2020</small></li>
                  <li><a href="/terms">Terms and Conditions</a><small>December 16, 2020</small></li>
                </ul>
              </div>
            </div>

            {/* Useful Links Section */}
            <div className="col-md-3" style={{ marginBottom: '40px' }}>
              <div className="headline"><h2>Useful Links</h2></div>
              <ul className="list-unstyled link-list">
                <li><a href="/about">About us</a><i className="fa fa-angle-right"></i></li>
                <li><a href="/contact">Contact us</a><i className="fa fa-angle-right"></i></li>
                <li><a href="/appointment">Book Appointment</a><i className="fa fa-angle-right"></i></li>
              </ul>
            </div>

            {/* Contact Information Section */}
            <div className="col-md-3 map-img" style={{ marginBottom: '40px' }}>
              <div className="headline"><h2>Contact Us</h2></div>
              <address>
                Fitness4Life <br />
                Aptech, IN <br />
                Phone: 886 666 00555 <br />
                Email: <a href="mailto:fitness4life@gmail.com">fitness4life@gmail.com</a>
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Social Links */}
      <div className="copyright">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>
                2020 &copy; All Rights Reserved. 
                <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
              </p>
            </div>

            {/* Social Links */}
            <div className="col-md-6">
              <ul className="footer-socials list-inline">
                <li><a href="http://www.facebook.com" className="tooltips" title="Facebook"><i className="fa fa-facebook"></i></a></li>
                <li><a href="http://www.skype.com" className="tooltips" title="Skype"><i className="fa fa-skype"></i></a></li>
                <li><a href="http://www.googleplus.com" className="tooltips" title="Google Plus"><i className="fa fa-google-plus"></i></a></li>
                <li><a href="http://www.linkedin.com" className="tooltips" title="LinkedIn"><i className="fa fa-linkedin"></i></a></li>
                <li><a href="http://www.pinterest.com" className="tooltips" title="Pinterest"><i className="fa fa-pinterest"></i></a></li>
                <li><a href="http://www.twitter.com" className="tooltips" title="Twitter"><i className="fa fa-twitter"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
