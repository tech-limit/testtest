import { Link } from "react-router-dom";
import { HiCheck } from "react-icons/hi2";
import {
  SCREENSHOT_GAMES,
  SCREENSHOT_CHARTS,
  SCREENSHOT_AFFILIATE,
} from "../../../../utils/brand";

const features = [
  {
    title: "Play games that players return to",
    subtitle: "Player focus",
    bullets: [
      "High-quality mobile-first experiences designed for long-term engagement",
      "Seamless Web3 touchpoints without forcing wallets at every step",
      "Rewards that flow back into staking and player-owned value",
    ],
    image: SCREENSHOT_GAMES,
    imageLeft: false,
    cta: "Explore Games",
    link: "/nfts",
  },
  {
    title: "Stake BET and power the ecosystem",
    subtitle: "Ecosystem participation",
    bullets: [
      "Conservative and growth pools with transparent mock APY",
      "Gasless claim path for staking rewards in demo mode",
      "Live charts for TVL, APR, and reward flow",
    ],
    image: SCREENSHOT_CHARTS,
    imageLeft: true,
    cta: "Open Staking",
    link: "/staking",
  },
  {
    title: "Grow with community and referrals",
    subtitle: "Shared upside",
    bullets: [
      "Invite friends and share ecosystem growth",
      "Track referrals and claim rewards from one dashboard",
      "Aligned incentives for players, stakers, and partners",
    ],
    image: SCREENSHOT_AFFILIATE,
    imageLeft: false,
    cta: "Get Started",
    link: "/signup",
  },
];

const LimitBreakFeatures = () => (
  <section className="tv-section tv-features">
    <div className="container">
      {features.map((f) => (
        <div
          key={f.title}
          className={`tv-feature-row ${f.imageLeft ? "tv-feature-row--reverse" : ""}`}
        >
          <div className="tv-feature-copy">
            <p className="tv-feature-eyebrow">{f.subtitle}</p>
            <h2 className="tv-feature-title">{f.title}</h2>
            <ul className="tv-feature-list">
              {f.bullets.map((b) => (
                <li key={b}>
                  <HiCheck />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to={f.link} className="tv-btn tv-btn-outline">
              {f.cta}
            </Link>
          </div>
          <div className="tv-feature-visual">
            <img src={f.image} alt={f.title} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default LimitBreakFeatures;
