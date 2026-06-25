import { Fragment } from "react";

type SplitTextRevealProps = {
  text: string;
};

export function SplitTextReveal({ text }: SplitTextRevealProps) {
  const words = text.split(" ");

  return (
    <span aria-label={text}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-block overflow-hidden align-bottom" aria-hidden="true">
            {Array.from(word).map((character, characterIndex) => (
              <span
                key={`${character}-${characterIndex}`}
                data-split-char
                className="inline-block origin-bottom will-change-transform"
              >
                {character}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
