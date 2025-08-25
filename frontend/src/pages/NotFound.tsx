// CSS
import '../css/style.css';
import '../css/pages/notFound.css';

// Dependencies
import { Link } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar';

function NotFound(){
    return(
        <>
            <Navbar />
            <div className="FSHero">
                <h1>Page Not Found</h1>
                <Link 
                    to="/"
                    id="backToHome"
                >
                    Back to Home
                </Link>
            </div>
        </>
    )
}

export default NotFound;