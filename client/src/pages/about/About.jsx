import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_FULL, BRAND_TAGLINE, LOGO_MARK } from "../../utils/brand";
import "./About.css";

const values = [
  {
    title: "Quality",
    body: "We build experiences that players can trust, enjoy, and return to.",
  },
  {
    title: "Creativity",
    body: "We look for new ways to make games more immersive, engaging, and memorable.",
  },
  {
    title: "Innovation",
    body: "We push beyond conventional approaches to explore what the next generation of gaming can become.",
  },
  {
    title: "Player Focus",
    body: "We design technology around real player experiences, reducing unnecessary complexity and friction.",
  },
];

const About = () => (
  <>
    <Helmet>
      <title>{BRAND_NAME} | About</title>
      <meta
        name="description"
        content={`${BRAND_FULL} creates high-quality games and Limit Break V2 Web3 infrastructure for players and stakers.`}
      />
    </Helmet>
    <section className="lb-about">
      <div className="container py-5">
        <div className="lb-about-hero">
          <img src={LOGO_MARK} alt="" className="lb-about-logo" />
          <h1 className="F1">{BRAND_NAME}</h1>
          <p className="F3 lb-about-tagline">{BRAND_TAGLINE}</p>
          <p className="F4 lb-about-lead">
            {BRAND_FULL} is a mobile gaming company focused on high-quality games players enjoy
            and return to over time. V2 extends that mission with noncustodial, EVM-compatible
            infrastructure — frictionless onboarding, gasless transactions, staking, and
            player-owned value.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/careers" className="tv-btn lb-btn-solid">
              Careers
            </Link>
            <Link to="/staking" className="tv-btn tv-btn-outline">
              Staking
            </Link>
          </div>
        </div>

        <div className="row g-4 mt-2">
          {values.map((v) => (
            <div key={v.title} className="col-md-6">
              <article className="lb-about-card">
                <h2>{v.title}</h2>
                <p>{v.body}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
