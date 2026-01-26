// CSS
import '../css/style.css';
import '../css/pages/about.css';

// Components
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';

// Images
import JW from '../assets/images/board/JW.jpg';
import MR from '../assets/images/board/MR.jpg';
import CB from '../assets/images/board/CB.jpg';
import KP from '../assets/images/board/KP.jpg';

type BoardMember = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};

const BOARD: BoardMember[] = [
  { name: 'Joe Watkins', role: 'President', photo: JW, bio: 'I joined SOC in 2018 after a transformative meeting with founders Matt Rager and Andy Mitchell. Initially, I invited them to partner with me in a Center Shot Ministry with the church, but after thoughtful discussions, they encouraged me to become part of SOC instead. In January 2019, during a pivotal moment in San Saba, Texas, we recognized that it was time to let God take the lead in our work at SOC. This decision has truly been a blessing. I was elected as the first Vice President of the SOC board, a position I proudly held for five years. In 2025, I was honored to be elected President alongside a new board. I look forward to discovering what God has planned for us in the coming years. My passion lies in serving the youth through coaching little league and mentoring young individuals in the outdoors. With over 20 years of experience in the fire service, I am dedicated to building the next generation of leaders. It is vital to me to help young men grow into responsible adults, leading by example and emphasizing that we all learn from our mistakes. I have been happily married for 21 years to my beautiful wife, Holly, and I am a proud father to Caleb and Aubrey Jo. They have both grown up serving as junior mentors in SOC and are currently thriving as college athletes in baseball and softball.' },
  { name: 'Michael Rackley', role: 'Vice President', photo: MR, bio: 'Michael grew up in Ferris, Texas, and was active in church periodically throughout his teenage years. In 2013, he and his wife became members of Lakepointe Church in Rockwall. Around that same time, he began seeking a place to serve that aligned with both his personal interests and his faith. He was introduced to Sights On Christ  through founder Matt Rager, and after attending his first SOC event—a dove hunt in 2013—he knew he had found an organization where he could combine his passion for the outdoors with his desire to share Christ with youth. Michael has been involved with SOC since 2013. He served as Treasurer for approximately five years and, in the 2025 board election, was grateful and honored to be elected Vice President. He has witnessed firsthand the significant growth of SOC over the years and remains sincerely thankful for the volunteers who faithfully give their time and for the ranch owners who generously open their properties and partner with the ministry. He understands how much their support is essential to the mission and impact of SOC. Professionally, Michael has worked in the telecommunications industry for 27 years and currently serves as a project manager. Throughout his career, he has held multiple leadership roles, where he mentored installers and technicians in their professional development as well as in life and in faith as trust was established.An avid outdoorsman, Michael has a strong passion for introducing others—especially youth—to outdoor experiences they may not otherwise have the opportunity to enjoy. He has been married to his wife for 17 years; she also serves as a mentor with SOC. Together, they have a preteen son who has been around SOC for most of his life, and they look forward to seeing him and his peers become the next generation of youth impacted by the ministry.' },
  { name: 'Claire Blakey', role: 'Treasurer', photo: CB, bio: `My name is Claire Blakey, and I have the privilege of serving as the Treasurer of Sights On Christ as of 2025. It is crazy to think that I have been with SOC since 2019. It started with a love for the Lord and a love of hunting, and while on Matt Rager’s basketball team, I would hear him talking about this ministry. Eventually, I started to wonder, where is this for girls? So, I called Joe and to his words, “I didn’t think she would make it happen.” I called him asking for a girls’ hunt—and we made it happen! Six years later we have seen the girls’ chapter of this ministry grow so much larger. I have gotten the privilege of being the youth to youth mentor to mentor to receiving our first SOC scholarship, and now to serving on the board. This ministry has captured my heart and given me my biggest blessings in ministry. My love is for the youth generation and young women, and I cannot wait to see what these next few years look like with SOC and to help be in the forefront of making disciples while experiencing His beautiful creation… the outdoors! I have gotten to witness so many young women's life change through SOC and to get to sit in a deer stand, or in a room with these young women truly lifts my spirit. Being a witness of the fire of the Lord in this generation is truly something that keeps my heart burning and longing for more. I am newly married to Layne Blakey. We are both finishing college and will be graduating in December of 2025. As we are starting our life together we both have a heart for the youth and cannot wait to see the Lord's hand in ministry.` },
  { name: 'Kollin Padon', role: 'Secretary', photo: KP, bio: 'Kollin Padon was born in Dallas, Texas, and raised in Royse City, where he developed a strong foundation in faith, family, and hard work. He attended Eastfield College and Texas A&M University-Commerce, where he pursued his education while working toward becoming a licensed Journeyman Electrician. With over 10 years of experience in the construction industry, Kollin now works at GoVisionXP, where he manages fixed installations of cutting-edge LED screen technology. His career reflects a deep commitment to quality, leadership, and innovation in the field. Kollin is an active member and Deacon at Fellowship Church, where he serves faithfully in both the Youth and Men’s Ministries. He has also dedicated three years as a Trail Life Chairman, mentoring young men in character and leadership. Outside of work and ministry, Kollin enjoys the outdoors with his wife, Monica Padon, and their three daughters—Hailey, Adleigh, and Kinsley. Whether it’s fishing, swimming, playing sports, exploring, or their favorite—waterfowl hunting—the Padons make the most of every adventure together. Kollin also proudly supports the local high school football team on Friday nights, reflecting his heart for community and service. Kollin has been a part of Sights on Christ for 3 years pouring into both students and mentors who have a tug towards sharing the Gospel in the outdoors.' },
];

function About() {
  return (
    <>
      <Navbar />
      <PageHeader pageName="About Us" />

      <main className="about-container">

        {/* Board Members */}
        <section id="board" className="section">
          <div className="section-header">
            <h2>Board of Directors</h2>
            <p className="kicker">Leadership & Stewardship</p>
          </div>

          <div className="board-grid">
            {BOARD.map((m) => (
              <article className="member-card" key={m.name}>
                {m.photo && (
                  <div className="member-image">
                    <img
                      src={m.photo}
                      alt={`${m.name}, ${m.role}`}
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="member-meta">
                  <h3 className="member-name">{m.name}</h3>
                  <span className="member-role">{m.role}</span>
                </div>
                {m.bio && <p className="member-bio">{m.bio}</p>}
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default About;
