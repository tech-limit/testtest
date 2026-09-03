import "./Footer.css";
import { Link, NavLink } from "react-router-dom";
import { BRAND_NAME, BRAND_FULL, BRAND_TAGLINE, LOGO_MARK } from "../../utils/brand";

const footerCols = [
  {
    title: "Platform",
    links: [
      { name: "Home", to: "/home" },
      { name: "Games", to: "/nfts" },
      { name: "Staking", to: "/staking" },
      { name: "Transactions", to: "/transactions" },
    ],
  },
  {
    title: "Products",
    links: [
      { name: "Player Value", to: "/home#pillars" },
      { name: "Tokenomics", to: "/home#tokenomics" },
      { name: "Rankings", to: "/rankings" },
      { name: "Support", to: "/support" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", to: "/about" },
      { name: "Careers", to: "/careers" },
      { name: "Contact", to: "/support" },
      { name: "Privacy", to: "/support" },
    ],
  },
];

const Footer = () => (
  <footer className="tv-footer lb-footer">
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-4">
          <Link className="tv-footer-brand d-flex align-items-center gap-2 text-decoration-none mb-3" to="/home">
            <img src={LOGO_MARK} alt="" className="tv-footer-icon" />
            <span className="tv-footer-name">{BRAND_NAME}</span>
          </Link>
          <p className="tv-footer-about">
            {BRAND_FULL} V2 — {BRAND_TAGLINE}. Frictionless onboarding, gasless
            play, staking, and player-owned value powered by BET.
          </p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title} className="col-6 col-lg-2 offset-lg-1">
            <h4 className="tv-footer-col-title">{col.title}</h4>
            <ul className="list-unstyled tv-footer-links">
              {col.links.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.to}>{link.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr className="tv-footer-hr" />
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <p className="tv-footer-copy mb-0">
          &copy; 2026 {BRAND_FULL} Inc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
