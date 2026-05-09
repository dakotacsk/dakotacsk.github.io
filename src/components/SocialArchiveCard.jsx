import { socialLinks } from "../data/projects.js";

export function SocialArchiveCard() {
  return (
    <div className="glass-card social-archive-card">
      <div className="social-section">
        <h2>Connect</h2>
        <div className="social-grid">
          {socialLinks.map((link) => (
            <a
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"
              }
              title={link.title}
              className="social-icon-glass"
              key={link.title}
            >
              <i className={link.iconClass}></i>
            </a>
          ))}
        </div>
      </div>
      <div className="archive-section">
        <h2>More</h2>
        <div className="archive-buttons">
          <a href="archive/portfolio.html" className="archive-link-btn">
            Detailed portfolio
          </a>
          <a href="archive/index.html" className="archive-link-btn">
            Past versions of this site
          </a>
        </div>
      </div>
    </div>
  );
}
