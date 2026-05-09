import { experiences } from "../data/projects.js";
import { useState } from "react";

export function ExperienceCard() {
  const [scrolledBottom, setScrolledBottom] = useState(false);

  function handleScroll(event) {
    const list = event.currentTarget;
    setScrolledBottom(list.scrollTop + list.clientHeight >= list.scrollHeight - 4);
  }

  return (
    <div className="glass-card experience-card">
      <h2>Recent Experience</h2>
      <div className={`exp-list-wrap ${scrolledBottom ? "scrolled-bottom" : ""}`}>
        <div className="exp-list" onScroll={handleScroll}>
          {experiences.map((experience) => (
            <div
              className="exp-item"
              style={{ "--exp-color": experience.color }}
              key={experience.company}
            >
              <h4>{experience.company}</h4>
              <p>{experience.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
