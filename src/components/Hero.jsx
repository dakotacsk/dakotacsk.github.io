import { useTypingText } from "../hooks/useTypingText.js";

const phrases = [
  "ML Engineer.",
  "Creative Technologist.",
  "Film Enthusiast.",
  "Founder.",
  "Headphones Lover.",
];

export function Hero() {
  const typedText = useTypingText(phrases);

  return (
    <section className="hero-section">
      <div className="glass-card hero-card">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="hero-profile-wrap">
          <img
            src="img/me.PNG"
            alt="Dakota Chang"
            className="hero-profile-image"
          />
        </div>
        <div className="hero-text">
          <p className="hero-subtitle">
            I&apos;m a
            <span className="typing-wrapper">
              <span className="typing" id="typing-text">
                {typedText}
              </span>
              <span className="typing-cursor">|</span>
            </span>
          </p>
          <p className="hero-description">
            Loves talking to humans and building AI solutions that drive
            real-world impact.
          </p>
          <p className="handwriting-note">and yes this is my handwriting!</p>
        </div>
      </div>
    </section>
  );
}
