/**
 * RESPONSIVE CSS GRID TIP:
 * 1. Always use breakpoint-based columns:
 *    `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
 *    This gives 1 column on phones, 2 on tablets, and 3 on desktops.
 * 2. Avoid hacky heights like `h-[130%]` or `w-[90%]` inside grid items.
 *    Grid items should be `w-full h-full` so the grid controls layout predictably.
 * 3. Use reasonable gaps like `gap-4 sm:gap-6` rather than `gap-y-20` on mobile.
 */
const FeatureCard = ({ content }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {content.map((item, i) => (
                <div
                    key={i}
                    className="
                        relative
                        p-[1px]
                        rounded-2xl
                        overflow-hidden
                        bg-gradient-to-r
                        from-cyan-400
                        to-purple-500
                        transition-all duration-300
                        hover:scale-[1.02]
                        hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]
                        w-full
                        h-full
                    "
                >
                    <div
                        className="
                            h-full
                            rounded-2xl
                            bg-slate-950/90
                            backdrop-blur-xl
                            p-5 sm:p-6
                            flex flex-col
                            gap-3
                        "
                    >
                        <div className="text-white">{item.logo}</div>
                        <h3 className="text-cyan-400 text-lg sm:text-xl font-bold">{item.tag}</h3>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeatureCard;