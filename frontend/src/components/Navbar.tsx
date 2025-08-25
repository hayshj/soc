import '../css/components/navbar.css'
import Logo from '../assets/images/SOCaltlogo.png'
import { Link, useLocation } from 'react-router-dom'
import { IoMenu, IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';

function Navbar(){

    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();


    {/* Disable Scrolling while menu is open */}
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup on unmount
        };
    }, [menuOpen]);

    return(
        <>
            <div id="navbar">
                <Link to="/" id="logoLink">
                    <img 
                        id="logo"
                        src={Logo}
                        height='100%'
                        width='100%'
                    />
                </Link>
                {menuOpen ?
                    <IoClose 
                        id="closeIcon"
                        className='navIcon' 
                        onClick={() => setMenuOpen(false)}
                    />
                :
                    <IoMenu 
                        id="menuIcon" 
                        className='navIcon' 
                        onClick={() => setMenuOpen(true)}
                    />
                }   
                <div id="navMenu" className={menuOpen ? 'open' : ''}>
                    <Link 
                        to="/" 
                        className={`link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        className={`link ${location.pathname === '/about' ? 'active' : ''}`}
                    >
                        About Us
                    </Link>
                    <Link 
                        to="/get-involved" 
                        className={`link ${location.pathname === '/get-involved' ? 'active' : ''}`}
                    >
                        Get Involved
                    </Link>
                    <Link 
                        to="/events" 
                        className={`link ${location.pathname === '/events' ? 'active' : ''}`}
                    >
                        Events
                    </Link>
                    <Link 
                        to="/media" 
                        className={`link ${location.pathname === '/media' ? 'active' : ''}`}
                    >
                        Media
                    </Link>
                    <Link 
                        to="/donate" 
                        className={`link ${location.pathname === '/donate' ? 'active' : ''}`}
                    >
                        Donate
                    </Link>
                    <Link 
                        to="/contact" 
                        className={`link ${location.pathname === '/contact' ? 'active' : ''}`}
                    >
                        Contact Us
                    </Link>
                    <Link 
                        to="/forms" 
                        className={`link ${location.pathname === '/forms' ? 'active' : ''}`}
                    >
                        Forms
                    </Link>
                </div>
                <div id="navLinks">
                    <ul>
                        <li>
                        <Link 
                            to="/" 
                            className={`link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        </li>
                        <Link 
                            to="/about" 
                            className={`link ${location.pathname === '/about' ? 'active' : ''}`}
                        >
                            About Us
                        </Link>
                        <li>
                        <Link 
                            to="/get-involved" 
                            className={`link ${location.pathname === '/get-involved' ? 'active' : ''}`}
                        >
                            Get Involved
                        </Link>
                        </li>
                        <li>
                        <Link 
                            to="/events" 
                            className={`link ${location.pathname === '/events' ? 'active' : ''}`}
                        >
                            Events
                        </Link>
                        </li>
                        <li>
                        <Link 
                            to="/media" 
                            className={`link ${location.pathname === '/media' ? 'active' : ''}`}
                        >
                            Media
                        </Link>   
                        </li>
                        <li>
                        <Link 
                            to="/donate" 
                            className={`link ${location.pathname === '/donate' ? 'active' : ''}`}
                        >
                            Donate
                        </Link>
                        </li>
                        <li>
                        <Link 
                            to="/contact" 
                            className={`link ${location.pathname === '/contact' ? 'active' : ''}`}
                        >
                            Contact Us
                        </Link>
                        </li>
                        <li>
                        <Link 
                            to="/forms" 
                            className={`link ${location.pathname === '/forms' ? 'active' : ''}`}
                        >
                            Forms
                        </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar;