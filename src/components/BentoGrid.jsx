import { projects } from "../data/projects.js";
import { ExperienceCard } from "./ExperienceCard.jsx";
import { ProjectCard } from "./ProjectCard.jsx";
import { SocialArchiveCard } from "./SocialArchiveCard.jsx";

export function BentoGrid() {
  return (
    <section className="bento-grid">
      <div className="glass-card about-card">
        <h2>About</h2>
        <p>
          Machine learning engineer and entrepreneur passionate about solving
          real problems with AI. Currently co-founding Nuggy (AI-powered pricing
          for cannabis retail).
        </p>
        <div className="accent-text">Creating systems that matter.</div>
      </div>

      {projects.slice(0, 5).map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}

      <div className="glass-card combined-card">
        <div className="profile-section">
          <img
            src="archive/img/avatar_me_plip.jpeg"
            alt="Dakota"
            className="small-img"
          />
          <h3>she/her • 20 • Olin &apos;27</h3>
          <p>Boston, MA</p>
        </div>
        <div className="skills-section">
          <h4>ML/AI</h4>
          <p>PyTorch, TensorFlow, DSPy</p>
        </div>
      </div>

      {projects.slice(5).map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}

      <ExperienceCard />

      <div className="glass-card image-card">
        <img
          src="img/thankyou_bags.gif"
          alt="Thank you bags"
          className="image-card-img"
        />
      </div>

      <SocialArchiveCard />
    </section>
  );
}
