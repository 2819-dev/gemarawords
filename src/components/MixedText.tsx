import { splitMixedText } from '../lib/mixedText.ts'

const LRM = '\u200E'

type MixedTextProps = {
  text: string
  className?: string
  hebrewClassName?: string
}

export function MixedText({ text, className, hebrewClassName }: MixedTextProps) {
  return (
    <span className={className} dir="ltr">
      {splitMixedText(text).map((part, index) =>
        part.hebrew ? (
          <span key={index}>
            <bdi className={`hebrew ${hebrewClassName ?? ''}`} lang="he">
              {part.text}
            </bdi>
            {LRM}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  )
}
