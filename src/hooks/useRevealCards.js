import { useEffect } from "react";

export function useRevealCards() {
  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");
    if (!cards.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          window.setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, index * 80);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    cards.forEach((card) => {
      card.classList.add("reveal-card");
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);
}
