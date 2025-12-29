// CSS
import '../css/style.css';
import '../css/pages/beliefs.css';

// Components
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';

const BELIEFS = [
  {
    title: 'About God',
    body:
      'There is one God: The Father, the Son, and the Holy Spirit; who subsist in unity, and also as three separate distinct Persons.',
  },
  {
    title: 'About Jesus Christ',
    body:
      'Jesus Christ is God’s Son. He was born of a virgin as both God and man, lived a sinless life, died to atone for the sins of human beings, was buried, arose from the grave, ascended into heaven and will literally return to earth.',
  },
  {
    title: 'About the Holy Spirit',
    body:
      'The Holy Spirit is the divine helper, assistant, counselor and instructor and His work is to reveal Christ, convict of sin, lead to repentance, guide believers, comfort, strengthen, and sanctify the soul.',
  },
  {
    title: 'About the Bible',
    body:
      'The Bible is God’s Holy Word, without error, and is the sole authority for life.',
  },
  {
    title: 'About Man',
    body:
      'Human beings are the special creations of God, made in His image. They fell through the sin of the first man, Adam, and all human beings are sinners in need of salvation.',
  },
  {
    title: 'About Salvation',
    body:
      'Salvation is a gift through repentance toward God and faith in Jesus Christ. Every person who truly is saved is eternally secure in the Lord Jesus Christ and will spend eternity in heaven, while those who die in their sins will spend eternity in hell. Each believer has direct access to God through the Lord Jesus Christ.',
  },
  {
    title: 'About Baptism',
    body:
      'We perform believer’s baptism. Baptism follows salvation, which is why it is called believer’s baptism. Baptism is commanded for new believers (Matt. 28:18-20). Baptism does not save you or make you a Christian; your faith and trust in Jesus Christ alone and His sacrifice for your sin makes you a Christian. Believer’s baptism should be one of the first acts of obedience as a Christian. It identifies you as a member of the body of Christ. Additionally, the English word “baptism” actually comes from the Greek word, baptizo, which means “to immerse or submerge.” Therefore, biblical baptism is complete immersion by a Christian to identify himself/herself with Jesus Christ as Lord and Savior. Jesus provides the example of biblical baptism in Matt. 3:16, which records: “After being baptized, Jesus came up immediately from the water…”',
  },
];

function Beliefs() {
  return (
    <>
      <Navbar />
      <PageHeader pageName="Our Beliefs" />

      <main className="beliefs-container">
        <section className="section">
          <header className="section-header">
            <h2>What we believe</h2>
          </header>

          <ol className="beliefs-list">
            {BELIEFS.map((belief) => (
              <li className="belief-item" key={belief.title}>
                <div className="belief-content">
                  <h3>{belief.title}</h3>
                  <p>{belief.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}

export default Beliefs;
