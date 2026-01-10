import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ContentHelper } from './utils';
import { Textual } from './ContentWrapper';

export const QuickRead = ({ }) => {
    //const data = useRef(null)
    const [random_section, set_random_section] = useState(null)
    const [title, setTitle] = useState(null)
    const [paper_title, set_paper_title] = useState(null)
    const [paper_id, set_paper_id] = useState(null)
    const reload_icon_ref = useRef(null)

    const get_data = useCallback(async (rondom_part = ContentHelper.randomized_part()) => {
        return await window.ubook.api.readContent(rondom_part)
    })

    const set_content = useCallback(async () => {
        const data = await get_data()
        // Get Random paper
        const papers = data['parts'][0]['papers']
        const random_paper = papers[Math.floor(Math.random() * papers.length)]
        set_paper_title(random_paper.title)
        set_paper_id(random_paper.paper_id)

        //Get Random section
        const sections = random_paper['sections']
        const random_section = sections[Math.floor(Math.random() * sections.length)]
        set_random_section(random_section)

        setTitle(ContentHelper.prepTitle(random_section))

    }, [random_section, title, paper_title, paper_id])

    useEffect(() => {
        set_content()
    }, [])

    const reload_content = useCallback(() => {
        reload_icon_ref.current?.classList.add("animate-spin-200");
        set_content()
        setTimeout(() => {
            reload_icon_ref.current?.classList.remove("animate-spin-200");
        }, 500); // stop spinning after 500ms
    })

    return (

        <div
            data-portal-container='quick-read-container'
            id="quick-read-container"
            className="h-fit pb-[16vh] max-h-[84vh] overflow-y-auto select-text bg-gradient-to-b from-blue-50/80 to-blue-100/80 dark:invert rounded-[8px] m-2 transform transition-all duration-700 font-reader scrollbar-custom border border-white/50 shadow-inner">
            <section className="block w-full">
                <h1 className="flex flex-col w-full text-xl font-bold">{paper_title}<br /><p className="p-0.5 rounded-md bg-white dark:bg-green-600"></p><p className="text-lg font-normal">{title}</p></h1>
                <div className="flex w-full justify-between items-center">
                    <p className="text-sm text-orange-300">
                        <sub>{paper_id}</sub>
                    </p>
                    <button onClick={reload_content} aria-label="reload" title="Reload"
                        className="flex items-center gap-2 p-1 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition duration-300">
                        <svg ref={reload_icon_ref} id="reloadIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M21 4v5h-5m1.65-3.65a8 8 0 1 0 2.1 8.45" />
                        </svg>
                    </button>
                </div>
            </section>
            {random_section?.paragraphs.map((paragraph, index) => (
                <Textual key={index} paragraph={paragraph} />
            ))}
        </div>
    )
}
