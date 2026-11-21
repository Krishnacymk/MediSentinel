import React, { useEffect, useRef, useState } from 'react';

interface TaglineRevealProps {
  text?: string;
}

export const TaglineReveal: React.FC<TaglineRevealProps> = ({
  text = "Preventing excessive medicine purchases through verified cross pharmacy dispensing, early refill detection, and timely human intervention."
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(' ');
  const [activeWordsCount, setActiveWordsCount] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveWordsCount(words.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate words in reading order one at a time with base curve
            words.forEach((_, index) => {
              setTimeout(() => {
                setActiveWordsCount((prev) => Math.max(prev, index + 1));
              }, index * 75);
            });
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [words.length, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="py-16 px-4 bg-dark-bg transition-base"
      aria-label="Core mission statement"
    >
      <div className="max-w-[680px] mx-auto text-center">
        <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 mb-6 inline-block">
          Patient Safety Principle
        </span>

        <h2 className="heading-3 md:heading-2 leading-tight tracking-tight flex flex-wrap justify-center gap-x-2.5 gap-y-1">
          {words.map((word, idx) => {
            const isWordActive = prefersReducedMotion || idx < activeWordsCount;
            return (
              <span
                key={idx}
                className="transition-colors duration-500 ease-base-curve"
                style={{
                  color: isWordActive ? '#FFFFFF' : '#454545',
                  opacity: isWordActive ? 1 : 0.32,
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <p className="body-3 text-neutral-400 mt-6 max-w-lg mx-auto">
          We identify unusual purchasing patterns early so clinicians and pharmacists can provide care before repeated excess consumption leads to harm.
        </p>
      </div>
    </section>
  );
};
