import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_FULL, LOGO_MARK } from "../../utils/brand";
import "./Careers.css";

const roles = [
  { role: "Technical Lead", level: "Lead", band: "$200K – $230K" },
  { role: "Smart Contract Lead", level: "Lead", band: "$185K – $220K" },
  { role: "Senior Blockchain Engineer", level: "Senior", band: "$175K – $220K" },
  { role: "AI / ML Engineer", level: "Mid-Senior", band: "$170K – $210K" },
  { role: "Senior Full-Stack Engineer", level: "Senior", band: "$165K – $210K" },
  { role: "Security Engineer", level: "Mid-Senior", band: "$155K – $205K" },
  { role: "Backend Engineer", level: "Mid-Senior", band: "$150K – $190K" },
  { role: "DevOps / Platform Engineer", level: "Mid-Senior", band: "$150K – $190K" },
  { role: "Frontend Engineer", level: "Mid", band: "$140K – $180K" },
  { role: "Product Manager", level: "Mid-Senior", band: "$145K – $195K" },
  { role: "UI / UX Designer", level: "Mid", band: "$130K – $175K" },
  { role: "Software Engineer", level: "Mid", band: "$140K – $175K" },
  { role: "Junior Software Engineer", level: "Junior", band: "$100K – $125K" },
];

const stack = [
  "React.js / JavaScript & TypeScript",
  "Node.js API & services",
  "Web3, smart contracts, staking",
  "Gasless transactions & player-owned value",
];

const reasons = [
  "Ship next-generation mobile gaming experiences",
  "Own meaningful engineering and product outcomes",
  "Work across modern apps and Web3-enabled infrastructure",
  "Influence architecture on V2 pillars",
];

const Careers = () => (
  <>
    <Helmet>
      <title>{BRAND_NAME} | Careers</title>
      <meta
        name="description"
        content={`Join ${BRAND_FULL} V2 — engineering, smart contracts, product, and design roles.`}
      />
    </Helmet>
    <section className="lb-careers">
      <div className="container py-5">
        <header className="lb-careers-hero">
          <div className="lb-careers-hero-copy">
            <p className="lb-careers-eyebrow">We&apos;re hiring</p>
            <h1 className="lb-careers-title">Build Limit Break V2 with us</h1>
            <p className="lb-careers-lead">
              Help ship frictionless onboarding, gasless play, ecosystem staking, and
              player-owned value. Remote-first roles across engineering and product.
            </p>
            <p className="lb-careers-note">
              Final offers depend on experience. Performance bonus and BET token / equity
              may be included.
            </p>
            <div className="lb-careers-actions">
              <a className="lb-careers-cta" href="#open-roles">
                Browse open roles
              </a>
            </div>
          </div>
          <div className="lb-careers-hero-aside" aria-hidden="true">
            <img src={LOGO_MARK} alt="" className="lb-careers-hero-mark" />
            <span>13 open roles</span>
          </div>
        </header>

        <div className="lb-careers-grid">
          <article className="lb-careers-card">
            <h2>Tech stack</h2>
            <ul>
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="lb-careers-card">
            <h2>Why Limit Break</h2>
            <ul>
              {reasons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="lb-careers-roles-block" id="open-roles">
          <div className="lb-careers-roles-heading">
            <h2>Open roles</h2>
            <p>Base salary bands in USD. Levels reflect our internal framework.</p>
          </div>
          <div className="lb-roles-table">
            <div className="lb-roles-head">
              <span>Role</span>
              <span>Level</span>
              <span>Base salary</span>
            </div>
            {roles.map((r) => (
              <div key={r.role} className="lb-roles-row">
                <span className="lb-role-name">{r.role}</span>
                <span className="lb-role-level">{r.level}</span>
                <span className="lb-role-band">{r.band}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="lb-careers-footer">
          Prefer to explore the product first?{" "}
          <Link to="/home" className="lb-inline-link">
            Visit the V2 home
          </Link>
          .
        </p>
      </div>
    </section>
  </>
);

export default Careers;
