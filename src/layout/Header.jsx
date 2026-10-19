import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Boxes, Terminal, ArrowRight, Menu, X } from "lucide-react";
import NavigationButtons from "../styles/NavigationButtons";

const navLinks = [
  { to: "/features", label: "Features", hover: "hover:text-cyan-400" },
  { to: "/tools", label: "Tools", hover: "hover:text-cyan-400" },
  { to: "/aboutUs", label: "About Us", hover: "hover:text-violet-400" },
  { to: "/pricing", label: "Pricing", hover: "hover:text-cyan-400" },
];

//  Desktop link  class 
const desktopLink =
  (hover) =>
    ({ isActive, isPending }) =>
      `nav-link ${isActive || isPending ? "active-link" : ""} ${hover} transition-colors flex items-center gap-1.5`;

// Mobile link class
const mobileLink = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium transition-colors ${isActive
    ? "bg-slate-800/70 text-cyan-400"
    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
  }`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Page/route badle toh menu apne aap band ho jaye
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Esc dabane pe band ho jaye
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080B11]/80 backdrop-blur-md">
      {/* ===== Top bar (hamesha dikhta hai) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Back/forward buttons: chhoti screen pe jagah bachane ke liye hide */}
        <div className="hidden sm:block">
          <NavigationButtons />
        </div>

        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Boxes className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">DevToolBox</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">v2.0</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">DUAL-TRACK SAAS</span>
          </div>
        </NavLink>

        {/* ===== Desktop nav (md se upar) ===== */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map(({ to, label, hover, icon: Icon }) => (
            <NavLink key={to} to={to} className={desktopLink(hover)}>
              {Icon && <Icon className="w-3.5 h-3.5 text-violet-400" />}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ===== Desktop CTAs (md se upar) ===== */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>99.99% UPTIME</span>
          </div>

          <NavLink to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log In
          </NavLink>

          <NavLink
            to="/signup"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </NavLink>
        </div>

        {/* ===== Hamburger (sirf mobile) ===== */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ===== Mobile panel ===== */}
      <div
        id="mobile-menu"
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 px-4 pt-2 pb-4 border-t border-slate-800/80">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={mobileLink}>
                {Icon && <Icon className="w-4 h-4 text-violet-400" />}
                {label}
              </NavLink>
            ))}

            {/* CTAs mobile mein panel ke andar */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <NavLink
                to="/login"
                className="rounded-lg px-3 py-3 text-center text-sm font-medium text-slate-300 border border-slate-800 hover:text-white hover:border-slate-600 transition-colors"
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-600 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;