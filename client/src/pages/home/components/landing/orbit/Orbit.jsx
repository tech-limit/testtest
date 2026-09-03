import "./Orbit.css";

const Orbit = ({ logo, children }) => (
  <div className="tv-orbit">
    <div className="tv-orbit-glow" aria-hidden="true" />
    <div className="tv-orbit-ring tv-orbit-ring--inner" aria-hidden="true" />
    <div className="tv-orbit-ring tv-orbit-ring--track" aria-hidden="true" />
    <div className="tv-orbit-ring tv-orbit-ring--outer" aria-hidden="true" />
    <div className="tv-orbit-center">{logo}</div>
    {children}
  </div>
);

export default Orbit;
