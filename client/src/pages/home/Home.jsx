import { Helmet } from "react-helmet-async";
import "./Home.css";
import LimitBreakHero from "./components/landing/LimitBreakHero";
import LimitBreakPillars from "./components/landing/LimitBreakPillars";
import LimitBreakRoadmap from "./components/landing/LimitBreakRoadmap";
import LimitBreakFeatures from "./components/landing/LimitBreakFeatures";
import LimitBreakTokenomics from "./components/landing/LimitBreakTokenomics";
import LimitBreakCareersTeaser from "./components/landing/LimitBreakCareersTeaser";
import { BRAND_NAME, BRAND_FULL, BRAND_TAGLINE } from "../../utils/brand";

const Home = () => (
  <div className="tv-home lb-home">
    <Helmet>
      <title>{BRAND_NAME} V2 | {BRAND_TAGLINE}</title>
      <meta
        name="description"
        content={`${BRAND_FULL} V2 — frictionless onboarding, gasless play, staking, and player-owned value.`}
      />
    </Helmet>
    <LimitBreakHero />
    <LimitBreakPillars />
    <LimitBreakRoadmap />
    <LimitBreakFeatures />
    <LimitBreakTokenomics />
    <LimitBreakCareersTeaser />
  </div>
);

export default Home;
