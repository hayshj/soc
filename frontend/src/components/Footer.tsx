

import '../css/components/Footer.css';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/SOCmainlogo.png';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            className="footer-logo"
            src={Logo}
            alt="Sights on Christ logo"
          />
          <p className="footer-tagline">
            To impact youth lives, by spreading the gospel, while experiencing the great outdoors.
          </p>
        </div>

        <div className="footer-group">
          <h3>Explore</h3>
          <Link to="/about">About</Link>
          <Link to="/beliefs">Our Beliefs</Link>
          <Link to="/forum">Deer Stand Testimonies</Link>
          <Link to="/get-involved">Get Involved</Link>
          <Link to="/events">Events</Link>
          <Link to="/donate">Donate</Link>
        </div>

        <div className="footer-group">
          <h3>Contact</h3>
          <span>Sights on Christ</span>
          <span>PO 205</span>
          <span>Royse City, TX 75189</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Sights on Christ. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;

