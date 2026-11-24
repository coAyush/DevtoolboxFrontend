import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Boxes, ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";
import NavigationButtons from "../styles/NavigationButtons";
import { checkLoggedIn } from "../services/landing/checkLoggedinService";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/tools", label: "Tools" },
  { to: "/pricing", label: "Pricing" },
  { to: "/aboutUs", label: "About Us" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userAuth, setUserAuth] = useState(null);
  const { pathname } = useLocation();

  // Route change resets mobile menu
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check login state to toggle Dashboard vs Log In/Sign up
  useEffect(() => {
    let isMounted = true;
    checkLoggedIn()
      .then((res) => {
        if (isMounted && res && res.code === 0 && res.data?.authenticated) {
          setUserAuth(res.data);
        } else if (isMounted) {
          setUserAuth(null);
        }
      })
      .catch(() => {
        if (isMounted) setUserAuth(null);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Close menu on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const dashboardPath = userAuth?.role ? `/${userAuth.role.toLowerCase()}/dashboard` : "/user/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Navigation History & Brand */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <NavigationButtons />
          </div>

          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Boxes className="w-5 h-5 transition-transform group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">DevToolBox</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v2.0
              </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition-colors hover:text-white py-1 relative ${
                  isActive ? "text-cyan-400 active-link font-semibold" : "text-slate-300"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>All systems normal</span>
          </div>

          {userAuth ? (
            <NavLink
              to={dashboardPath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </NavLink>

              <NavLink
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080c14]/95 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-950/40 text-cyan-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {userAuth ? (
              <NavLink
                to={dashboardPath}
                className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
