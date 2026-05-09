import { useEffect, useState } from "react";

export function useTypingText(
  phrases,
  { typingSpeed = 100, deletingSpeed = 50, delayBetweenPhrases = 2000 } = {},
) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting && charIndex < currentPhrase.length) {
          setCharIndex((index) => index + 1);
          return;
        }

        if (!isDeleting) {
          setIsDeleting(true);
          return;
        }

        if (charIndex > 0) {
          setCharIndex((index) => index - 1);
          return;
        }

        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
      },
      !isDeleting && charIndex === currentPhrase.length
        ? delayBetweenPhrases
        : isDeleting
          ? deletingSpeed
          : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [
    charIndex,
    delayBetweenPhrases,
    deletingSpeed,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
  ]);

  return phrases[phraseIndex].slice(0, charIndex);
}
