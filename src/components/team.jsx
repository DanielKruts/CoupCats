import React from 'react';
import "./team.css";

const Team = () => {
  const Faculty = [
    {
      name: "Dr. Clayton Thyne",
      role: "University of Kentucky",
      image: "/images/ClaytonThyne.jpg",
      links: [
        { icon: "envelope", url: "mailto:clayton.thyne@uky.edu" },
        { icon: "globe", url: "https://polisci.as.uky.edu/users/clthyn2" }
      ]
    },
    {
      name: "Dr. Jonathan Powell",
      role: "University of Kentucky",
      image: "/images/JonathanPowell.jpg",
      links: [
        { icon: "envelope", url: "mailto:jonathan.powell@uky.edu" },
        { icon: "globe", url: "https://pattersonschool.uky.edu/people/jonathan-powell" }
      ]
    }
  ];

  const TEK = [
    {
      name: "Leah Smith",
      role: "Economics",
      image: "/images/Leah_Picture.png",
      year: "2025, 2026",
      links: [
        { icon: "envelope", url: "mailto:leah-smith22@outlook.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/leah-smith-53175b359/" }
      ]
    },
    {
      name: "Patricia Juarbe Rivera",
      role: "Public Policy | Economics",
      image: "/images/PatriciaJuarbe.jpeg",
      year: "2025, 2026",
      links: [
        { icon: "envelope", url: "mailto:patriciajuarbe6@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/particiajuarbe/" }
      ]
    },
    {
      name: "Synthiche Ntumba",
      role: "Marketing",
      image: "/images/Synthiche_Picture.jpg",
      year: "2026",
      links: [
        { icon: "envelope", url: "mailto:synthiche.ntumba@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/synthiche-ntumba-702054226/" }
      ]
    },
    {
      name: "Sarah McClellan",
      role: "Political Science",
      image: "/images/SarahMcClellan.jpg",
      year: "2026",
      links: [
        { icon: "envelope", url: "mailto:sarah.mcclellan@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/sarah-mcclellan-9b8a24224/" }
      ]
    },
    {
      name: "Sam Yauwanta",
      role: "Political Science",
      image: "/images/SamYauwanta.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:sam.yauwanta@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/sam-yauwanta-702054226/" }
      ]
    },
    {
      name: "Grace Beauchamp",
      role: "Political Science",
      image: "/images/GraceBeauchamp.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:grace.beauchamp@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/grace-beauchamp-702054226/" }
      ]
    },
    {
      name: "Catalina Hicks",
      role: "Political Science",
      image: "/images/CatalinaHicks.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:catalina.hicks@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/catalina-hicks-702054226/" }
      ]
    },
    {
      name: "Vanessa Keller",
      role: "Political Science",
      image: "/images/VanessaKeller.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:vanessa.keller@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/vanessa-keller-702054226/" }
      ]
    },
    {
      name: "Reece Harris",
      role: "Political Science",
      image: "/images/ReeceHarris.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:reece.harris@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/reece-harris-702054226/" }
      ]
    },
    {
      name: "Tucker Payne",
      role: "Political Science",
      image: "/images/TuckerPayne.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:tucker.payne@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/tucker-payne-702054226/" }
      ]
    },
    {
      name: "Leo Duncan",
      role: "Political Science",
      image: "/images/LeoDuncan.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:leo.duncan@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/leo-duncan-702054226/" }
      ]
    },
    {
      name: "Kade Spaulding",
      role: "Mathematics",
      image: "/images/kade_picture.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:kademarcus0908@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/kade-spaulding-908621236/" }
      ]
    },
    {
      name: "Harrison Hill",
      role: "Mathematics",
      image: "/images/Harrison_Picture.png",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:harryhill304@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/harrison-c-hill/" }
      ]
    },
    {
      name: "Camila Pimentel",
      role: "Political Science | International Studies",
      image: "/images/Camila_picture.jpeg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:camilatavarespimentel@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/camila-pimentel-053608207/" }
      ]
    },
    {
      name: "Jose Sequeira",
      role: "Computer Science",
      image: "/images/JoseSequeira.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:jsequeirasanchez@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/josequeira/" }
      ]
    },
    {
      name: "Morgan Blankenship",
      role: "Media Arts and Studies | Political Science",
      image: "/images/MorganBlankenship.jpeg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto: morganb20@hotmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/morgan-blankenship-653740226/" }
      ]
    },
    {
      name: "Emma Thyne",
      role: "Political Science",
      image: "/images/EmmaThyne.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:emma.thyne@outlook.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/emma-thyne-462109205/" }
      ]
    }

  ];

  const CS = [
    {
      name: "Daniel Krutsick",
      role: "Computer Science",
      image: "/images/DanielKrutsick.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:daniel.krutsick@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/daniel-krutsick-702054226/" }
      ]
    },
    {
      name: "Michelle Alcantara",
      role: "Computer Science",
      image: "/images/MichelleAlcantara.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:michelle.alcantara@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/michelle-alcantara-702054226/" }
      ]
    },
    {
      name: "Jennifer Macias",
      role: "Computer Science",
      image: "/images/JenniferMacias.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:jennifer.macias@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/jennifer-macias-702054226/" }
      ]
    },
    {
      name: "Owen Louis",
      role: "Computer Science",
      image: "/images/OwenLouis.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:owen.louis@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/owen-louis-702054226/" }
      ]
    },
    {
      name: "Bella Karn",
      role: "Computer Science",
      image: "/images/BellaKarn.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:ipka222@uky.edu" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/isabellakarn/" }
      ]
    }, 
    {
      name: "Adrian Treadwell",
      role: "Computer Science",
      image: "/images/adriantreadwell.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:astreadwell2@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/astreadwell/" }
      ]
    },
    {
      name: "Alexander Young",
      role: "Computer Science",
      image: "/images/AlexanderYoung.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:alexandersy04@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/alexander-young-a37124224/" }
      ]
    },
    {
      name: "Logan Hester",
      role: "Computer Science",
      image: "/images/LoganHester.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:sarah@uky.edu" },
        { icon: "linkedin", url: "#" }
      ]
    },
    {
      name: "Jose Sequeira",
      role: "Computer Science",
      image: "/images/JoseSequeira.jpg",
      year: "2025",
      links: [
        { icon: "envelope", url: "mailto:jsequeirasanchez@gmail.com" },
        { icon: "linkedin", url: "https://www.linkedin.com/in/josequeira/" }
      ]
    }
  ];

  return (

    <div className="team-container">
      {/* Page Title */}
      <h1 className="team-header">Meet the Team</h1>

      {/* TEK Team Section */}
      <div className="team-section">
        <h1 className="team-title">TEK Students</h1>
        <div className="team-grid">
          {TEK.map((member, index) => (
            <div className="team-card" key={`tek-${index}`}>
              <div className="card-header">
                <img src={member.image} alt={member.name} className="member-photo" />
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-year">{member.year}</p>
                </div>
              </div>
              <p className="member-bio">{member.bio}</p>
              <div className="social-links">
                {member.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    className={`social-link ${link.icon}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className={`fa${link.icon === 'envelope' ? 's' : 'b'} fa-${link.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CS Team Section */}
      <div className="team-section">
        <h1 className="team-title">Computer Science Students</h1>
        <div className="team-grid">
          {CS.map((member, index) => (
            <div className="team-card" key={`cs-${index}`}>
              <div className="card-header">
                <img src={member.image} alt={member.name} className="member-photo" />
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
              <p className="member-bio">{member.bio}</p>
              <div className="social-links">
                {member.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    className={`social-link ${link.icon}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className={`fa${link.icon === 'envelope' ? 's' : 'b'} fa-${link.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Section */}
      <div className="team-section">
        <h1 className="team-title">Faculty</h1>
        <div className="team-grid">
          {Faculty.map((member, index) => (
            <div className="team-card" key={`tek-${index}`}>
              <div className="card-header">
                <img src={member.image} alt={member.name} className="member-photo" />
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
              <p className="member-bio">{member.bio}</p>
              <div className="social-links">
                {member.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    className={`social-link ${link.icon}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className={`fa${['envelope', 'globe'].includes(link.icon) ? 's' : 'b'} fa-${link.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;