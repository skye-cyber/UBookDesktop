import React, { useRef } from 'react';
import { ContentHelper } from './utils';

export const Readable = ({ section }) => {
    const containerRef = useRef(null)

    return (
        <div ref={containerRef} className='mb-12'>
            <h1 className="text-3xl font-bold mb-4 text-center underline decoration-lime-400">{section.title}</h1>
            {section.paragraphs.map((paragraph, index) => (
                <Textual key={index} paragraph={paragraph} />
            ))}
        </div>
    )
}

export const Textual = ({ paragraph }) => {
    const comment = ContentHelper.checkComment(paragraph);
    const commentHTML = `<span class='text-sm text-sky-500 font-brand'>${comment}</span>`
    let content = ContentHelper.cleanText(paragraph.text.replace(comment, commentHTML), paragraph.paragraph_number)
    return (
        <div
            id='textual'
            className='font-normal'
            dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    )
}
