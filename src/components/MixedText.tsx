import { splitMixedText } from '../lib/mixedText.ts'

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
          <span key={index} className={`hebrew ${hebrewClassName ?? ''}`} lang="he" dir="rtl">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  )
}
