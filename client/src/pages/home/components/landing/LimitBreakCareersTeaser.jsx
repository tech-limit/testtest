import { Link } from "react-router-dom";

const roles = [
  "Technical Lead",
  "Smart Contract Lead",
  "Senior Full-Stack Engineer",
  "Frontend Engineer",
  "Product Manager",
];

const LimitBreakCareersTeaser = () => (
  <section className="tv-section lb-careers-teaser">
    <div className="container">
      <div className="lb-careers-panel">
        <div>
          <p className="tv-feature-eyebrow">Careers</p>
          <h2 className="tv-feature-title mb-3">Build the next generation of gaming</h2>
          <p className="tv-section-sub mb-0">
            Join engineering, smart contracts, product, and design roles shaping Limit Break V2 —
            onboarding, gasless play, staking, and player-owned value.
          </p>
          <ul className="lb-careers-roles">
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
        <Link to="/careers" className="tv-btn lb-btn-solid">
          View open roles
        </Link>
      </div>
    </div>
  </section>
);

export default LimitBreakCareersTeaser;
