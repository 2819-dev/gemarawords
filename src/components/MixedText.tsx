import { groupMixedParts } from '../lib/mixedText.ts'

const LRM = '\u200E'
const RLI = '\u2067'
const PDI = '\u2069'

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
          <span
            key={index}
            className="hebrew-phrase"
            dir="ltr"
            style={{
              display: 'inline-flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              columnGap: '0.35em',
              direction: 'ltr',
            }}
          >
            {group.words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className={`hebrew ${hebrewClassName ?? ''}`}
                lang="he"
                style={{ display: 'inline-block', unicodeBidi: 'isolate' }}
              >
                {`${RLI}${word}${PDI}`}
              </span>
            ))}
            {LRM}
          </span>
        ) : (
          <span key={index}>{group.text}</span>
        ),
      )}
      {LRM}
    </span>
  )
}
