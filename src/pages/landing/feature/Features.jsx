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
        <>
            <PageBackground>
                <div className="min-h-screen flex flex-col items-center justify-center gap-4 relative">
                    <div aria-label="tagline" className="flex flex-col gap-0.5 absolute top-4 left-[36%]">
                        <h1 className="font-bold text-4xl text-white text-center tracking-tight">Everything You Need</h1>
                        <p className="text-center text-muted-foreground">One toolbox infinte possibilities</p>
                    </div>
                    <FeatureCard content={featureContent} />
                </div>
            </PageBackground>
        </>
    )
}

export default Features;