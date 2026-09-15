import { groupMixedParts } from '../lib/mixedText.ts'

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
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'baseline',
            }}
          >
            {group.words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className={`hebrew ${hebrewClassName ?? ''}`}
                lang="he"
                style={{ float: 'left', marginRight: '0.33em' }}
              >
                {word}
              </span>
            ))}
          </span>
        ) : (
          <span key={index}>{group.text}</span>
        ),
      )}
    </span>
  )
}
