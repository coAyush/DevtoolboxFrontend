const FeatureCard = ({ content }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 p-2 gap-x-5 gap-y-20">
            {content.map((item, i) => (
                <div
                    key={i}
                    className="
                        relative
                        p-[1px]
                        rounded-xl
                        overflow-hidden
                        bg-gradient-to-r
                        from-cyan-400
                        to-purple-500
                        hover:animate-pulse
                        h-[130%]
                        min-h-[200px]
                        w-[90%]
                    "
                >
                    <div
                        className="
                            h-full
                            rounded-xl
                            bg-slate-950
                            p-5
                            flex flex-col
                            gap-2
                        "
                    >
                        <div className="text-white text-lg">{item.logo}</div>
                        <div className="mt-1.5 text-cyan-400 text-xl">{item.tag}</div>
                        <div className="text-slate-400 text-lg">{item.text}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeatureCard;