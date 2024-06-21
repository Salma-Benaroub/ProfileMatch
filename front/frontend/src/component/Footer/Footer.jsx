import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './footer.css'

function Footer() {
  return (
    <>
    <div className="container2" id="contact1">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: RecomProfil@gmail.com</p>
          <p>Phone: +212 5228533 </p>
          <p>Address: Khouribga 123 street</p>
        </div>
        <div className="footer-content">
          <h3>Quick Links</h3>
          <ul className="list">
            <li><a href="#companies">All companies</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
            
          </ul>
        </div>
        <div className="footer-content">
          <h3>Follow Us</h3>
          <ul className="social-icons">
            <li><a href="#"><FontAwesomeIcon icon={faFacebook} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faLinkedin} /></a></li>
          </ul>
        </div>
      </div>
      <div className="bottom-bar">
        <p>&copy; 2024 RecomProfil. All rights reserved</p>
      </div>
      </>
  )
}

export default Footer