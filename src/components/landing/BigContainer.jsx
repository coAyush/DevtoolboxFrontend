/**
 * RESPONSIVE CONTAINER TIP:
 * 1. NEVER use fixed pixel widths like `w-[420px]` without `max-w`!
 *    Instead, use `w-full max-w-[420px]`. This ensures the element is 100% wide
 *    on small phone screens (320px - 400px) and caps at 420px on desktops.
 * 2. Use responsive padding (`p-4 sm:p-6 md:p-8`) so small screens keep precious content area.
 * 3. Use `grid grid-cols-3` or responsive flex so child icons don't burst out of container boundaries.
 */
const BigContainer = ({ title, children, theme = "cyan", value, className = "" }) => {
  return (
    <div
      className={`
        w-full
        max-w-[420px]
        rounded-2xl sm:rounded-3xl
        p-4 sm:p-6 md:p-8
        backdrop-blur-md
        bg-slate-900/40
        border
        transition-all duration-300
        ${
          theme === "cyan"
            ? "border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.25)] sm:shadow-[0_0_40px_rgba(34,211,238,0.35)]"
            : "border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.25)] sm:shadow-[0_0_40px_rgba(168,85,247,0.35)]"
        }
        ${className}
      `}
    >
      <h2
        className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 ${
          theme === "cyan" ? "text-cyan-400" : "text-purple-400"
        }`}
      >
        {title}
      </h2>

      {/* Grid layout guarantees the 3 small cards fit evenly within the card on any mobile screen */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5 md:gap-4 justify-items-center w-full">
        {children}
      </div>

      <div
        aria-label="button"
        className={`
          mt-5 sm:mt-6
          w-full
          py-2.5 sm:py-3
          px-3
          rounded-xl
          text-center
          text-xs sm:text-sm md:text-base
          font-semibold
          cursor-pointer
          transition-all duration-200
          ${
            theme === "cyan"
              ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              : "bg-purple-600 text-white hover:bg-purple-500"
          }
        `}
      >
        {value}
      </div>
    </div>
  );
};

export default BigContainer;