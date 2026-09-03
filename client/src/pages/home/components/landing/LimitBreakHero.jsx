import { Link } from "react-router-dom";
import {
  HERO_ART,
  LOGO_MARK,
  PARTNER_CMC,
  PARTNER_METAMASK,
  PARTNER_UNISWAP,
  PARTNER_BINANCE,
  PARTNER_POLYGON,
  PARTNER_CHAINLINK,
  PARTNER_CERTIK,
  BRAND_NAME,
} from "../../../../utils/brand";

const badgeIcons = [
  { src: PARTNER_CMC, alt: "CoinMarketCap" },
  { src: PARTNER_METAMASK, alt: "MetaMask" },
  { src: PARTNER_UNISWAP, alt: "Uniswap" },
  { src: PARTNER_BINANCE, alt: "Binance" },
];

const trustPartners = [
  { label: "Powered by:", logo: PARTNER_POLYGON, alt: "Polygon" },
  { label: "Protected by:", logo: PARTNER_CHAINLINK, alt: "Chainlink" },
  { label: "Audited by:", logo: PARTNER_CERTIK, alt: "CertiK" },
];

const LimitBreakHero = () => (
  <section className="tv-hero lb-hero">
    <div className="container">
      <div className="tv-hero-grid lb-hero-grid">
        <div className="tv-hero-copy">
          <div className="tv-hero-badges">
            {badgeIcons.map((icon) => (
              <div key={icon.alt} className="tv-hero-badge">
                <img src={icon.src} alt={icon.alt} />
              </div>
            ))}
          </div>

          <div className="lb-hero-brand-row">
            <img src={LOGO_MARK} alt="" className="lb-hero-brand-mark" />
            <p className="lb-hero-eyebrow">{BRAND_NAME} V2</p>
          </div>
          <h1 className="tv-hero-title">
            <span>Limit Break</span>
          </h1>
          <p className="lb-hero-kicker">Accessible Web3 gaming for players and stakers</p>

          <p className="tv-hero-desc">
            Frictionless onboarding, gasless transactions, ecosystem staking, and
            player-owned value — built so players return for experiences they trust.
          </p>

          <div className="tv-hero-actions">
            <Link to="/signup" className="tv-btn tv-btn-outline">
              Get Started
            </Link>
            <Link to="/staking" className="tv-btn lb-btn-solid">
              Stake BET
            </Link>
          </div>

          <div className="tv-trust-row">
            {trustPartners.map((partner) => (
              <div key={partner.alt} className="tv-trust-item">
                <span className="tv-trust-label">{partner.label}</span>
                <img src={partner.logo} alt={partner.alt} className="tv-trust-logo" />
              </div>
            ))}
          </div>
        </div>

        <div className="tv-hero-visual lb-hero-visual">
          <div className="lb-hero-art">
            <div className="lb-hero-art-glow" aria-hidden="true" />
            <img
              src={HERO_ART}
              alt={`${BRAND_NAME} V2`}
              className="lb-hero-art-img"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default LimitBreakHero;
