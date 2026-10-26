import {
    QrCode,
    FileText,
    Link2,
    Key,
    Terminal,
    Code2
} from "lucide-react";

import { TypeAnimation } from "react-type-animation";

import PageBackground from "../../styles/Pagebackground";
import GlassContainer from "../../styles/GlassContainer";

import BigContainer from "../../components/landing/BigContainer";
import SmallContainer from "../../components/landing/SmallContainer";

const userTools = [
    {
        name: "QR Code",
        icon: <QrCode size={40} className="text-cyan-400" />,
    },
    {
        name: "PDF Tools",
        icon: <FileText size={40} className="text-cyan-400" />,
    },
    {
        name: "Link Shortener",
        icon: <Link2 size={40} className="text-cyan-400" />,
    },
];

const developerTools = [
    {
        name: "Code Syntax",
        icon: <Code2 size={40} className="text-purple-400" />,
    },
    {
        name: "API Key",
        icon: <Key size={40} className="text-purple-400" />,
    },
    {
        name: "Uptime",
        icon: <Terminal size={40} className="text-purple-400" />,
    },
];

const sections = [
    {
        title: "For Normal Users",
        theme: "cyan",
        value: "Launch Web Studio",
        tools: userTools,
    },
    {
        title: "For Developers",
        theme: "purple",
        value: "Get API Keys & Documentation",
        tools: developerTools,
    },
];

const Landing = () => {
    return (
        <PageBackground>
            <GlassContainer>

                {/* 
                 * RESPONSIVE TYPOGRAPHY TIP:
                 * Never use static desktop font sizes like `text-6xl` directly on mobile.
                 * Always start mobile-first: `text-2xl sm:text-4xl md:text-5xl lg:text-6xl`.
                 * Also avoid `overflow-hidden` on wrapping text containers, which can cut off descending characters or extra lines.
                 */}
                <div
                    aria-label="descp"
                    className="w-full flex justify-center text-center px-2 min-h-[90px] sm:min-h-[120px] md:min-h-[140px] items-center"
                >
                    <TypeAnimation
                        sequence={[
                            "Empowering Creators and Developers",
                            1500,
                            "Building Tools for Every Developer",
                            1500,
                            "One Platform. Infinite Possibilities.",
                            1500,
                        ]}
                        speed={40}
                        repeat={Infinity}
                        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl leading-tight sm:leading-snug tracking-tight"
                    />
                </div>

                {/* 
                 * RESPONSIVE GRID / FLEX TIP:
                 * Use `w-full`, `flex flex-col md:flex-row`, and `items-center` so cards 
                 * stack gracefully one above another on mobile and sit side-by-side on desktop.
                 */}
                <div
                    aria-label="sections"
                    className="flex flex-col lg:flex-row justify-center items-center gap-6 sm:gap-8 w-full"
                >
                    {sections.map((section) => (
                        <BigContainer
                            key={section.title}
                            title={section.title}
                            theme={section.theme}
                            value={section.value}
                            className="breathe-cyan"
                        >
                            {section.tools.map((tool) => (
                                <SmallContainer
                                    key={tool.name}
                                    name={tool.name}
                                    icon={tool.icon}
                                />
                            ))}
                        </BigContainer>
                    ))}
                </div>

            </GlassContainer>
        </PageBackground>
    );
};

export default Landing;