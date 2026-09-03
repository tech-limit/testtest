import { LOGO_MARK } from "../../../../utils/brand";
import Orbit from "./orbit/Orbit";
import OrbitMilestone from "./orbit/OrbitMilestone";
import { ROADMAP_MILESTONES } from "./orbit/roadmapMilestones";

const LimitBreakRoadmap = () => (
  <section className="tv-section tv-roadmap" id="roadmap">
    <div className="container text-center">
      <h2 className="tv-section-title">V2 roadmap for gaming and staking</h2>
      <Orbit
        logo={
          <div className="tv-orbit-center-logo">
            <img src={LOGO_MARK} alt="" />
          </div>
        }
      >
        {ROADMAP_MILESTONES.map((milestone) => (
          <OrbitMilestone key={milestone.title} {...milestone} />
        ))}
      </Orbit>
    </div>
  </section>
);

export default LimitBreakRoadmap;
