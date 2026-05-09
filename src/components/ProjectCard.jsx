import { Water } from "@paper-design/shaders-react";

function ExternalLink({ href }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-link"
    >
      Learn more →
    </a>
  );
}

function ProjectBackground({ project }) {
  const className = [
    "featured-project-bg",
    project.fitContain ? "bg-fit-contain" : "",
    project.shader === "water" ? "shader-project-bg" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (project.shader === "water") {
    return (
      <div
        className={className}
        style={{ backgroundImage: `url("${project.image}")` }}
      >
        <Water
          width={1280}
          height={720}
          image={project.image}
          colorBack="#000000"
          colorHighlight="#5cc9ff"
          highlights={0.1}
          layering={0.03}
          edges={0.74}
          waves={0.3}
          caustic={0.1}
          size={0.75}
          speed={0.55}
          scale={0.68}
          fit="contain"
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ backgroundImage: `url("${project.image}")` }}
    />
  );
}

export function ProjectCard({ project }) {
  const cardClass = [
    "glass-card",
    "featured-project",
    project.large ? "project-feature-large" : "",
    project.shader === "water" ? "water-project" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass}>
      <ProjectBackground project={project} />
      <div className="project-overlay">
        <div className="project-header-glass">
          <h3>{project.title}</h3>
          <span className={`badge-${project.badgeType}`}>{project.badge}</span>
        </div>
        <p className="project-desc">{project.description}</p>
        <ExternalLink href={project.href} />
      </div>
    </div>
  );
}
