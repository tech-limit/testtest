import { WHITEPAPER_TOKENOMICS } from "../../../../utils/brand";

const LimitBreakTokenomics = () => (
  <section className="tv-section tv-tokenomics text-center" id="tokenomics">
    <div className="container">
      <h2 className="tv-section-title">BET Tokenomics</h2>
      <p className="tv-section-sub mx-auto">
        BET powers staking, player rewards, and ecosystem participation across Limit Break V2.
      </p>
      <div className="tv-token-grid">
        {[
          { label: "Total Supply", value: "1B BET" },
          { label: "Staking APR", value: "Up to 63%" },
          { label: "Player Rewards", value: "40%" },
          { label: "Community", value: "20%" },
        ].map((item) => (
          <div key={item.label} className="tv-token-card">
            <div className="tv-token-value">{item.value}</div>
            <div className="tv-token-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="tv-whitepaper">
        <img
          src={WHITEPAPER_TOKENOMICS}
          alt="BET token distribution across staking, player rewards, liquidity, and community pools"
          className="tv-whitepaper-chart"
        />
      </div>
    </div>
  </section>
);

export default LimitBreakTokenomics;
