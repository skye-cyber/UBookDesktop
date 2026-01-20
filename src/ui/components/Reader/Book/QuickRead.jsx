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
            className="overflow-y-hidden select-none transform transition-all duration-100">

            {/* Header */}
            <div className='bg-[#423eac]/25 dark:bg-[#005574]/25 dark:text-white shadow-centered-sm  shadow-[#55557f] border-b border-[#5954e8] dark:border-[#006282] block w-full'>
                <button onClick={reload_content} aria-label="reload" title="Reload"
                    className="fixed z-50 right-0 top-1 flex items-center gap-2 p-1 bg-blue-600/70 dark:bg-blue-500/50 dark:hover:bg-blue-600/70 text-white rounded-2xl shadow hover:bg-blue-700/80 transition duration-300">
                    <svg ref={reload_icon_ref} id="reloadIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M21 4v5h-5m1.65-3.65a8 8 0 1 0 2.1 8.45" />
                    </svg>
                </button>

                <section>
                    <h1 className="flex flex-col w-full text-lg truncate font-bold">{paper_title}</h1>
                    <p className="text-sm truncate font-normal">{title}</p>
                </section>
            </div>

            {/* Content */}
            <section className='bg-[#423eac]/20 dark:bg-[#00242d]/0 pt-2 dark:text-white max-h-[84vh] pb-16 px-2 text-sm font-sans tracking-wide leading-relaxed text-gray-900 dark:text-purple-900 select-none  overflow-y-auto scrollbar-custom'>
                {random_section?.paragraphs.map((paragraph, index) => (
                    <Textual key={index} paragraph={paragraph} />
                ))}
            </section>
        </div>
    )
}
