import React, { useEffect, useRef } from 'react';
import { ContentHelper } from './utils';

export const Readable = ({ section }) => {
    const containerRef = useRef(null)

    return (
        <div ref={containerRef}>
            <h1 className="text-3xl font-bold mb-4 text-center underline decoration-lime-400">{section.title}</h1>
            {section.paragraphs.forEach(paragraph => {
                <Textual paragraph={paragraph} />
            })
            }
        </div>
    )
}

export const Textual = ({ paragraph }) => {
    const comment = ContentHelper.checkComment(paragraph);
    const commentHTML = `<span className='text-md text-sky-500'>${comment}</span>`
    console.log(comment)
    return (
        <>
            <div>{ContentHelper.cleanText(paragraph.text, paragraph.paragraph_number).replace(comment, commentHTML)}</div>
        </>
    )
}
