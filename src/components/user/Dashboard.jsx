
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from "motion/react"
import { useLoaderData } from 'react-router'
import {
    FileText,
    Link2,
    QrCode,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import SmallContainer from '../landing/SmallContainer'
import SimpleBarChart from './Charts'
import { useUserDetails } from '../../context/User/UserDetailsContext'
const UserDashboard = () => {
    const { code, message, status, data } = useLoaderData()
    console.log(data);
    const { userDetails, userMonthlyStatsDto } = data;
    const [searchTerm, setSearchTerm] = useState('')
    const [startIndex, setStartIndex] = useState(0)
    const { setUser, setLoading } = useUserDetails()
    useEffect(() => {
        setUser(data);
        setLoading(false);
    }, [data, setUser, setLoading]);

    const userTools = [
        {
            name: 'QR Code',
            description: 'Generate QR codes quickly',
            icon: <QrCode size={32} className="text-cyan-400" />,
        },
        {
            name: 'PDF Tools',
            description: 'Manage and process PDF files',
            icon: <FileText size={32} className="text-cyan-400" />,
        },
        {
            name: 'Link Shortener',
            description: 'Create short, shareable links',
            icon: <Link2 size={32} className="text-cyan-400" />,
        },
    ]

    const subscribe = userDetails.subscriptionStatus;

    const filteredTools = useMemo(
        () =>
            userTools.filter(tool =>
                `${tool.name} ${tool.description}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase().trim())
            ),
        [searchTerm]
    )

    // Show 3 cards on desktop, 2 on medium screens, 1 on mobile.
    // The carousel scrolls by one card at a time.
    const [visibleCount, setVisibleCount] = useState(3)

    React.useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) setVisibleCount(1)
            else if (window.innerWidth < 1024) setVisibleCount(2)
            else setVisibleCount(4)
        }

        updateVisibleCount()
        window.addEventListener('resize', updateVisibleCount)

        return () => window.removeEventListener('resize', updateVisibleCount)
    }, [])

    React.useEffect(() => {
        setStartIndex(0)
    }, [searchTerm])

    const maxStart = Math.max(0, filteredTools.length - visibleCount)

    const visibleTools = filteredTools.slice(
        Math.min(startIndex, maxStart),
        Math.min(startIndex, maxStart) + visibleCount
    )

    const previous = () => setStartIndex(i => Math.max(0, i - 1))
    const next = () =>
        setStartIndex(i => Math.min(maxStart, i + 1))

    return (
        <div className="h-full w-full bg-transparent flex flex-col gap-8 md:gap-10 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 md:px-8 pt-4">
                <div className="h-10 w-full max-w-80 rounded-xl bg-slate-700 flex items-center px-3 gap-2">
                    <Search size={22} className="text-cyan-400 shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search tools..."
                        aria-label="Search tools"
                        className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-slate-300"
                    />
                </div>

                <button
                    disabled={subscribe}
                    className={`shrink-0 rounded-xl px-3 py-2 text-xs md:text-sm text-white ${subscribe
                        ? 'bg-green-500 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 active:scale-95'
                        }`}
                >
                    {subscribe ? 'Subscribed' : 'Subscribe'}
                </button>
            </div>

            {/* Intro */}
            <div className="px-4 md:px-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        DevToolBox
                    </span>
                </h1>

                <div className="mt-4 text-lg md:text-2xl text-slate-300">
                    Build faster with{' '}
                    <span className="font-semibold text-cyan-400">
                        <TypeAnimation
                            sequence={[
                                'powerful tools.', 1800,
                                'tools that simplify your workflow.', 1800,
                                'everything you need to work smarter.', 1800,
                            ]}
                            wrapper="span"
                            speed={50}
                            deletionSpeed={65}
                            repeat={Infinity}
                            cursor
                        />
                    </span>
                </div>
            </div>
            <div className='flex gap-5 mt-15'>
                {/* Quick Launch Tools */}
                <div className='w-1/2'>
                    <section className="px-4 md:px-8 ">
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <div>
                                <h2 className="text-xl md:text-2xl font-semibold text-white">
                                    Quick Launch
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    Find the right tool and get started.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="hidden sm:block text-sm text-slate-400 mr-2">
                                    {filteredTools.length} tools
                                </span>

                                <button
                                    onClick={previous}
                                    disabled={startIndex === 0 || filteredTools.length <= visibleCount}
                                    aria-label="Previous tools"
                                    className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <button
                                    onClick={next}
                                    disabled={startIndex >= maxStart || filteredTools.length <= visibleCount}
                                    aria-label="Next tools"
                                    className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {filteredTools.length > 0 ? (
                            <div className="grid grid-cols-2 grid-rows-2 sm:grid-rows-1 grid-cols-1 gap-1.5">
                                {visibleTools.map(tool => (
                                    <div
                                        key={tool.name}
                                        className="min-w-0 rounded-2xl border border-slate-700/70 bg-slate-800/50 p-5 hover:border-cyan-400/60 hover:bg-slate-800 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="rounded-xl bg-slate-700/70 p-3">
                                                {tool.icon}
                                            </div>
                                            <ChevronRight
                                                size={19}
                                                className="text-slate-500"
                                            />
                                        </div>

                                        <h3 className="text-lg font-semibold text-white">
                                            {tool.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {tool.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                                <Search className="mx-auto mb-3 text-slate-500" size={28} />
                                <p className="text-slate-200 font-medium">
                                    No tools found
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Try another search term.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
                <div className='w-1/2 h-1/2'>
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <SimpleBarChart days={userMonthlyStatsDto.days}
                            usages={userMonthlyStatsDto.usages}
                            month={userMonthlyStatsDto.month} />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
