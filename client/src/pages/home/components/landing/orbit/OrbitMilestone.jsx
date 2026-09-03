const OrbitMilestone = ({ title, angle, status, desc, icon, iconScale, iconPosition }) => {
  const isLeftSide = angle > 90 && angle < 270;

  return (
    <div
      className={`tv-orbit-milestone${isLeftSide ? " tv-orbit-milestone--left" : ""}`}
      style={{ "--milestone-angle": `${angle}deg` }}
    >
      <div className="tv-orbit-milestone-inner">
        <div className="tv-orbit-milestone-icon">
          <img
            src={icon}
            alt=""
            style={{
              transform: iconScale ? `scale(${iconScale})` : undefined,
              objectPosition: iconPosition || "center",
            }}
          />
        </div>
        <div className="tv-orbit-milestone-copy">
          <span className="tv-orbit-milestone-status">{status}</span>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default OrbitMilestone;
