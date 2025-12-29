// CSS
import '../css/style.css';
import '../css/pages/donate.css';

// Components
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';

// Icons (optional)
import { IoMailOutline, IoCashOutline } from 'react-icons/io5';

function Donate() {
  return (
    <>
      <Navbar />
      <PageHeader pageName="Donate" />

      <main className="donate-container">
        {/* What donations cover */}
        <section className="section">
          <header className="section-header">
            <h2>What Your Donation Supports</h2>
            <p className="kicker">Fueling the mission</p>
          </header>
          <div className="card">
            <ul className="bullet-list">
              <li>Scholarships for youth to attend trips, retreats, and hunts</li>
              <li>Bibles, devotionals, study resources, and mentoring materials</li>
              <li>Safety equipment, permits, and program logistics</li>
              <li>Meals, transportation, and lodging support for participants</li>
              <li>Media, storytelling, and outreach to spread the gospel</li>
            </ul>
          </div>
        </section>

        {/* Donate by Check */}
        <section className="section">
          <header className="section-header">
            <h2>Donate by Check</h2>
            <p className="kicker">Mailing address</p>
          </header>
          <div className="card address-card">
            <IoMailOutline className="icon" aria-hidden />
            <div>
              <div className="org">SIGHTS ON CHRIST</div>
              <div>Make Checks Payable To: <strong>SIGHTS ON CHRIST</strong></div>
              <div>PO 465</div>
              <div>Royse City, TX 75189</div>
              <div className="note">Please write “Donation” in the memo line.</div>
            </div>
          </div>
        </section>

        {/* PayPal only */}
        <section className="section">
          <header className="section-header">
            <h2>Donate Securely with PayPal</h2>
            <p className="kicker">The safer, easier way to pay online</p>
          </header>

          <div className="card pay-only">
            <IoCashOutline className="icon" aria-hidden />
            <div className="pay-copy">
              <p>
                Give one-time or set up a recurring monthly gift through PayPal.
              </p>
            </div>
            {/* TODO: replace href with your actual PayPal donate link */}
            <a
              className="btn btn-primary"
              href="https://www.paypal.com/donate?token=RNxKjfqZtrGREv1hT8sRbglaqMq9Ivqr7QvmNWx_3siEVRAJhwhUqCzkNaQ7nmyzyCK-cxIoh4UDVA7Z&locale.x=US"
              target="_blank"
              rel="noreferrer"
              aria-label="Donate via PayPal"
            >
              Donate with PayPal
            </a>
          </div>
        </section>

        {/* 501(c)(3) */}
        <section className="section">
          <header className="section-header">
            <h2>501(c)(3) Information</h2>
            <p className="kicker">Tax-deductible giving</p>
          </header>
          <div className="card">
            <p><strong>SIGHTS ON CHRIST</strong> is a 501(c)(3) non-profit organization.</p>
            <p>All donations are tax-deductible to the extent allowed by law.</p>
            <p className="muted">
              Texas Tax Exempt / EIN: <strong>47-4104861</strong> &nbsp;•&nbsp; You will receive a receipt for your records.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Donate;
