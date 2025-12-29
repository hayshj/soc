// CSS
import '../css/style.css';
import '../css/pages/getInvolved.css';

// Components
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import SocInterestForm from '../components/InterestForm'; // 👈 import the form component

function GetInvolved() {
  return (
    <>
      <Navbar />
      <PageHeader pageName="Get Involved" />

      <main className="involved-container">
        {/* Custom React Form */}
        <section className="section">
          <header className="section-header">
            <h2>Get Involved</h2>
            <p className="kicker">Mentor • Teen</p>
          </header>

          <div className="form-wrapper">
            <SocInterestForm /> {/* 👈 your new React form goes here */}
          </div>
        </section>

        {/* Contact info */}
        <section className="section">
          <header className="section-header">
            <h2>Contact Our Board</h2>
            <p className="kicker">We’re here to help</p>
          </header>

          <div className="board-grid">
            <div className="contact-card">
              <h3>Joe Watkins</h3>
              <p>President</p>
              <a href="mailto:joew@sightsonchrist.com">joew@sightsonchrist.com</a>
            </div>
            <div className="contact-card">
              <h3>Michael Rackley</h3>
              <p>Vice President</p>
              <a href="mailto:michaelr@sightsonchrist.com">michaelr@sightsonchrist.com</a>
            </div>
            <div className="contact-card">
              <h3>Claire Blakey</h3>
              <p>Treasurer</p>
              <a href="mailto:claireb@sightsonchrist.com">claireb@sightsonchrist.com</a>
            </div>
            <div className="contact-card">
              <h3>Kollin Padon</h3>
              <p>Secretary</p>
              <a href="mailto:kollinp@sightsonchrist.com">kollinp@sightsonchrist.com</a>
            </div>
            <div className="contact-card">
              <h3>General Inquiries</h3>
              <a href="mailto:info@sightsonchrist.com">info@sightsonchrist.com</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default GetInvolved;
