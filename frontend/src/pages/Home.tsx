// CSS
import '../css/style.css';
import '../css/pages/home.css';

// Components
import Navbar from '../components/Navbar';
import TestCard from '../components/TestCard';
import EventCard from '../components/EventCard';

// Dependencies
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';

// Images
import Logo from '../assets/images/SOCmainlogo.png';
import lucasLaster from '../assets/images/testamonials/lucasLaster.jpg';
import parkerHutton from '../assets/images/testamonials/parkerHutton.jpg';
import johnRowe from '../assets/images/testamonials/johnRowe.jpg';

type Event = {
  title: string;
  date: string;
  location: string;
};

function Home() {

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch {
        console.error("Error fetching events");
      }
    }

    fetchEvents();
  }, []);

  return (
    <>
      <div id="bg-gradient"></div>
      <Navbar />

        {/* Hero Section */}
        <div id="homeHero" className="FSHero">
            <div id="homeHeroContent">
                <div id="homeHeroLogo">
                  <img 
                    src={Logo}
                    alt='logo'
                  />
                </div>
                <div id="ctab">
                    <Link to="#" className="btn btn-primary">Get Involved</Link>
                    <Link to="#" className="btn btn-secondary">Donate</Link>
                </div>
            </div>
        </div>

        {/* Body */}
        <div id='homeBody'>

          <div id='missionStatementSection'>
            <h1 className='sectionHeader'>Our Mission</h1>
            <p id='missionStatement'>To impact youth lives, by spreading the gospel, while experiencing the great outdoors.</p>
          </div>

          <div id='testimonials'>
            <div id='testCards'>
              <TestCard
                quote="My experience with sights on christ was very powerful, it lets a group of really diverse kids come together over learning about hunting, good meals, and most importantly the word of God."
                image={lucasLaster}
                name="Lucas Laster"
              />
              <TestCard
                quote="Sights on Christ was a great learning experience that taught young men how to correctly read the Bible, pray, and taught of faith. The hunts are awesome and helps you connect on a personal level with the mentors."
                image={parkerHutton}
                name="Parker Hutton"
              />
              <TestCard
                quote="Thank you for letting me be a part of the organization.  There is nothing better than hunting and having a devotional with all you guys, and just having a good time.  I love all y’all with a passion and y’all have made me a better person in life.  I can’t wait for the next hunt with y’all."
                image={johnRowe}
                name="John Rowe"
              />
            </div>
          </div>

          <div id="events">
            <h1 className='sectionHeader'>Upcoming Events</h1>
            {events.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                date={event.date}
                location={event.location}
              />
            ))}
          </div>

          <div id="videoHighlight">
            <h1 className="sectionHeader">Watch Our Mission in Action</h1>
            <div id="videoWrapper">
              <iframe 
                id="videoFrame"
                src="https://www.youtube.com/embed/rMj2Me6K8po"
                title="Sights on Christ Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

        </div>
    </>
  );
}

export default Home;