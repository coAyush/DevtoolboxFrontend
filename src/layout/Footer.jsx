import { Boxes, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080D] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Boxes className="w-5 h-5 text-cyan-400" />
              <span>DevToolBox</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Industrial productivity utilities for casual creators and high-throughput REST APIs for developers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Web Studio Tools */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-cyan-400 font-mono">
              Web Studio Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tools" className="hover:text-slate-200 transition-colors">QR Code Studio</a></li>
              <li><a href="#tools" className="hover:text-slate-200 transition-colors">PDF Compressor</a></li>
              <li><a href="#tools" className="hover:text-slate-200 transition-colors">Word to PDF Converter</a></li>
              <li><a href="#tools" className="hover:text-slate-200 transition-colors">URL Shortener & Analytics</a></li>
              <li><a href="#tools" className="hover:text-slate-200 transition-colors">UUID & Password Generator</a></li>
            </ul>
          </div>

          {/* Column 2: Developer Platform */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-violet-400 font-mono">
              Developer Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#api" className="hover:text-slate-200 transition-colors">REST API Reference</a></li>
              <li><a href="#api" className="hover:text-slate-200 transition-colors">API Key Provisioning</a></li>
              <li><a href="#api" className="hover:text-slate-200 transition-colors">Redis Rate Limiting Spec</a></li>
              <li><a href="#api" className="hover:text-slate-200 transition-colors">Spring AI Observability</a></li>
              <li><Link to="/pricing" className="hover:text-slate-200 transition-colors">API Pricing Tiers</Link></li>
            </ul>
          </div>

          {/* Column 3: Stack & Architecture */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-300 font-mono">
              Architecture
            </h4>
            <div className="text-xs space-y-1.5 text-slate-400 font-mono">
              <p>Frontend: React 19 + Tailwind v4</p>
              <p>Backend: Spring Boot 3.4 + Security 6</p>
              <p>Database: PostgreSQL + Flyway</p>
              <p>Cache: Redis Token Bucket</p>
              <p>Observability: Spring AI Agent</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} DevToolBox SaaS Platform. Enterprise Blueprint v2.0.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
