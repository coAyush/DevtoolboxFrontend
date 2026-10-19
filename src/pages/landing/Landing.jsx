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

                {/* Hero */}
                <div
                    aria-label="descp"
                    className="font-extrabold text-white tracking-wide text-4xl overflow-hidden flex justify-center"
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
                        className="text-6xl md:text-7xl font-extrabold text-white max-w-4xl leading-tight"
                    />
                </div>

                {/* Tool sections */}
                <div
                    aria-label="sections"
                    className="flex justify-center gap-8 flex-wrap"
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