import { useState } from 'react'

export const ReadMore = ({ id, text, amountOfWords = 14 }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const splittedText = text.split(' ')
  const itCanOverflow = splittedText.length > amountOfWords
  const beginText = itCanOverflow
    ? splittedText.slice(0, amountOfWords - 1).join(' ')
    : text
  const endText = splittedText.slice(amountOfWords - 1).join(' ')

  const handleKeyboard = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <p id={id} className='text-sm font-normal italic text-grey-16'>
      {beginText}
      {itCanOverflow && (
        <>
          {!isExpanded && <span>... </span>}
          
          <span
            className={`${!isExpanded ? 'opacity-0' : 'opacity-100'} transition-all duration-300 overflow-hidden`}
            aria-hidden={!isExpanded}
          >
            {isExpanded && endText}
          </span>
          <span
            className='ml-s2 underline underline-offset-2'
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={id}
            onKeyDown={handleKeyboard}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'read less' : 'read more'}
          </span>
        </>
      )}
    </p>
  )
}