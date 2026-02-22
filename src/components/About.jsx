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
              <img src="/images/catWaraMeme.jpg" alt="Political analysis visual" />
            </div>
          </div>
        </section>

        <section className="why-section">
          <div className="why-container">
            <div className="why-image">
              <img src="/images/catWaraMeme.jpg" alt="Why we do what we do" />
            </div>

            <div className="why-text">
              <h2>Why We Do It</h2>
              <p>
                We started Coupcats because we believe that political instability shouldn't be a guessing game.  Today, that same passion pushes us to constantly improve, adapt, and deliver results that actually matter.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default About;