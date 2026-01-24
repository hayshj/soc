import '../css/components/navbar.css'
import Logo from '../assets/images/SOCaltlogo.png'
import { Link, useLocation } from 'react-router-dom'
import { IoMenu, IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  // Disable body scrolling while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Apply transparent-at-top behavior ONLY on home;
  // otherwise always solid. Also force solid when menu is open.
  useEffect(() => {
    function applyState() {
      if (!isHome) {
        setScrolled(true);
        return;
      }
      setScrolled(window.scrollY > 10 || menuOpen);
    }

    window.addEventListener("scroll", applyState, { passive: true });
    applyState(); // initialize on mount & when deps change

    return () => window.removeEventListener("scroll", applyState);
  }, [isHome, menuOpen]);

  return (
    <div id="navbar" className={scrolled ? "scrolled" : ""}>
      <Link to="/" id="logoLink" aria-label="Home">
        <img
          id="logo"
          src={Logo}
          height="100%"
          width="100%"
          alt="Site Logo"
        />
      </Link>

      {menuOpen ? (
        <IoClose
          className="navIcon"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : (
        <IoMenu
          className="navIcon"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        />
      )}

      {/* Mobile Menu */}
      <div id="navMenu" className={menuOpen ? 'open' : ''}>
        <Link to="/" className={`link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/about" className={`link ${location.pathname === '/about' ? 'active' : ''}`}>
          About Us
        </Link>
        <Link to="/get-involved" className={`link ${location.pathname === '/get-involved' ? 'active' : ''}`}>
          Get Involved
        </Link>
        <Link to="/events" className={`link ${location.pathname === '/events' ? 'active' : ''}`}>
          Events
        </Link>
        <Link to="/devotionals" className={`link ${location.pathname === '/devotionals' ? 'active' : ''}`}>
          Devotionals
        </Link>
        <a
          href="https://sightsonchrist.smugmug.com"
          className="link"
          target="_blank"
          rel="noreferrer"
        >
          Media
        </a>
        <Link to="/donate" className={`link ${location.pathname === '/donate' ? 'active' : ''}`}>
          Donate
        </Link>
        <Link to="/beliefs" className={`link ${location.pathname === '/beliefs' ? 'active' : ''}`}>
          Our Beliefs
        </Link>
        <Link to="/forum" className={`link ${location.pathname === '/forum' ? 'active' : ''}`}>
          Deer Stand Testimonies
        </Link>
      </div>

      {/* Desktop Links */}
      <div id="navLinks">
        <ul>
          <li>
            <Link to="/" className={`link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={`link ${location.pathname === '/about' ? 'active' : ''}`}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/get-involved" className={`link ${location.pathname === '/get-involved' ? 'active' : ''}`}>
              Get Involved
            </Link>
          </li>
          <li>
            <Link to="/events" className={`link ${location.pathname === '/events' ? 'active' : ''}`}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/devotionals" className={`link ${location.pathname === '/devotionals' ? 'active' : ''}`}>
              Devotionals
            </Link>
          </li>
          <li>
            <a
              href="https://sightsonchrist.smugmug.com"
              className="link"
              target="_blank"
              rel="noreferrer"
            >
              Media
            </a>
          </li>
          <li>
            <Link to="/donate" className={`link ${location.pathname === '/donate' ? 'active' : ''}`}>
              Donate
            </Link>
          </li>
          <li>
            <Link to="/beliefs" className={`link ${location.pathname === '/beliefs' ? 'active' : ''}`}>
              Our Beliefs
            </Link>
          </li>
          <li>
            <Link to="/forum" className={`link ${location.pathname === '/forum' ? 'active' : ''}`}>
              Deer Stand Testimonies
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;

