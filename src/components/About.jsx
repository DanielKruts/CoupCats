import "./About.css"
const About = () => 
{
    return(
      <div>
        <section className="hero-image">
            <img
                src="/images/coup.jpg"
                className="hero-large-desktop"
                alt="Two people on a cliff with sunset"
                loading="lazy"
            />
            <div className="hero-overlay">
              <span className="hero-subtitle">About Us</span>
              <h1 className="hero-text">
                The number one source for information on coups around the world, providing data, analysis, and insights to help understand and predict political instability.
              </h1>
            </div>
        </section>

        <section className="details-section">
          <div className="details-container">
            <div className="details-text">
              <h2>What We Do</h2>
              <p>
                We analyze a wide range of signals—including political events, economic stressors, military dynamics, and social unrest—to generate early-warning insights on coup likelihood and regime instability. Our forecasts are designed to support researchers, analysts, journalists, policymakers, and anyone who needs clearer visibility into fragile political environments.
              </p>
            </div>

            <div className="details-image">
              <img src="/images/ThailandCoup.jpg" alt="Political analysis visual" />
            </div>
          </div>
        </section>

        <section className="why-section">
          <div className="why-container">
            <div className="why-image">
              <img src="/images/Armored Take.jpg" alt="Why we do what we do" />
            </div>

            <div className="why-text">
              <h2>Why We Do It</h2>
              <p>
                We started Coupcats because we believe that political instability shouldn't be a guessing game.  Today, that same passion pushes us to constantly improve, adapt, and deliver results that actually matter.
              </p>
            </div>
          </div>
        </section>
        <section className="decision-section">
          <section className="decision-section">

          <div className="decision-header">
            <h2>Main Decision-Making Factors</h2>
              <p>
                Our forecasts are guided by a balance of data, context, and expert analysis.
              </p>
          </div>

        </section>
          <div className="decision-container">
            <div className="decision-card">
              <h3>Main Factor One</h3>
              <p>
                Filler text
              </p>
            </div>

          <div className="decision-card">
            <h3>Main factor two</h3>
            <p>
              Filler text 
            </p>
          </div>

          <div className="decision-card">
            <h3>Main factor three</h3>
            <p>
              Filler text
            </p>
          </div>
          </div>
        </section>
        
      </div>
    );
  };
  
  export default About;