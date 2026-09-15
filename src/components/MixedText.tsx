import { embedHebrewPhrase, groupMixedParts } from '../lib/mixedText.ts'

type MixedTextProps = {
  text: string
  className?: string
  hebrewClassName?: string
}

export function MixedText({ text, className, hebrewClassName }: MixedTextProps) {
  return (
    <span className={className} dir="ltr">
      {groupMixedParts(text).map((group, index) =>
        group.hebrew ? (
          <span key={index} className={`hebrew ${hebrewClassName ?? ''}`} lang="he" dir="ltr">
            {embedHebrewPhrase(group.words)}
          </span>
        ) : (
          <span key={index}>{group.text}</span>
        ),
      )}
    </span>
  )
}
