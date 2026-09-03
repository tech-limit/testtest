import { Link } from "react-router-dom";
import { HiOutlineBolt, HiOutlineCubeTransparent, HiOutlineUsers, HiOutlineTrophy } from "react-icons/hi2";

const pillars = [
  {
    icon: HiOutlineUsers,
    title: "Frictionless Onboarding",
    body: "Create an account in minutes, connect a wallet when you are ready, and jump into play without crypto complexity.",
    link: "/signup",
    cta: "Create account",
  },
  {
    icon: HiOutlineBolt,
    title: "Gasless Transactions",
    body: "Sponsored transaction UX keeps gameplay smooth. Demo quotes show zero gas so players stay in the moment.",
    link: "/staking",
    cta: "See gasless demo",
  },
  {
    icon: HiOutlineCubeTransparent,
    title: "Ecosystem Participation",
    body: "Stake BET into pools that fund rewards and liquidity — earn yield while supporting the games you love.",
    link: "/staking",
    cta: "Explore staking",
  },
  {
    icon: HiOutlineTrophy,
    title: "Player-Owned Value",
    body: "Achievements, assets, and progress stay yours. Turn play into lasting ownership across the Limit Break ecosystem.",
    link: "/nfts",
    cta: "Browse games",
  },
];

const LimitBreakPillars = () => (
  <section className="tv-section lb-pillars" id="pillars">
    <div className="container text-center">
      <h2 className="tv-section-title">Built for V2</h2>
      <p className="tv-section-sub mx-auto">
        Four pillars that make gaming more accessible, seamless, and engaging for players and stakers.
      </p>
      <div className="lb-pillars-grid">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <article key={p.title} className="lb-pillar-card">
              <div className="lb-pillar-icon">
                <Icon />
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <Link to={p.link} className="lb-pillar-link">
                {p.cta}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default LimitBreakPillars;
