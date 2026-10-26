import { Code2, Layers, Rocket, ShieldCheck, Wrench, Zap } from "lucide-react";
import PageBackground from "../../../styles/Pagebackground";
import FeatureCard from "../../../components/landing/FeatureCard";

const Features = () => {
    const featureContent = [
        {
            logo: <Layers size={36} className="text-cyan-400" />,
            tag: "All-in-One Toolkit",
            text: "Access everyday utilities and developer tools from one powerful platform."
        },
        {
            logo: <Zap size={36} className="text-cyan-400" />,
            tag: "Fast & Lightweight",
            text: "Get things done quickly with simple, responsive and efficient tools."
        },
        {
            logo: <Code2 size={36} className="text-purple-400" />,
            tag: "Developer Friendly",
            text: "Built with APIs, code utilities and documentation designed for developers."
        },
        {
            logo: <ShieldCheck size={36} className="text-purple-400" />,
            tag: "Secure by Design",
            text: "Keep your data and API credentials protected with security-focused features."
        },
        {
            logo: <Wrench size={36} className="text-cyan-400" />,
            tag: "Everyday Tools",
            text: "Generate QR codes, manage PDFs, shorten URLs and handle common tasks easily."
        },
        {
            logo: <Rocket size={36} className="text-purple-400" />,
            tag: "Powerful APIs",
            text: "Integrate DevToolBox capabilities directly into your own applications."
        }
    ];

    return (
        <PageBackground>
            {/* 
             * RESPONSIVE LAYOUT TIP:
             * AVOID using `absolute top-4 left-[36%]` for headings!
             * Absolute positioning with percentage offsets breaks instantly on mobile devices.
             * Instead, use standard document flow: `flex flex-col items-center`,
             * responsive margins/paddings, and proper text scaling.
             */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center gap-8 sm:gap-12">
                <div aria-label="tagline" className="flex flex-col items-center gap-2 text-center max-w-2xl">
                    <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                        Everything You Need
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400">
                        One toolbox, infinite possibilities
                    </p>
                </div>

                <FeatureCard content={featureContent} />
            </div>
        </PageBackground>
    );
};

export default Features;