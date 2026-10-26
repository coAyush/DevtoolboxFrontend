/**
 * RESPONSIVE DESIGN TIP:
 * 1. Avoid fixed heights like `h-[calc(100vh-80px)]` combined with `overflow-hidden`.
 *    On mobile devices, content naturally stacks vertically and is much taller than the screen.
 *    Using `min-h-[...]` and allowing the height to grow (`h-auto`) ensures content can scroll.
 * 2. Use responsive padding (`p-4 sm:p-6 md:p-8`) instead of a single fixed padding.
 * 3. Use responsive gaps (`gap-y-6 sm:gap-y-10 md:gap-y-14`) so small screens don't waste precious space.
 */
const GlassContainer = ({ children }) => {
  return (
    <div
      className="
        min-h-[calc(100vh-6rem)]
        h-auto
        w-full
        max-w-7xl
        rounded-2xl sm:rounded-3xl
        border border-cyan-400/40
        bg-slate-950/70
        backdrop-blur-md
        shadow-[0_0_40px_rgba(34,211,238,0.15)]
        flex flex-col
        gap-y-6 sm:gap-y-10 md:gap-y-14
        p-4 sm:p-6 md:p-8 lg:p-10
        mx-auto
        my-4 sm:my-8
      "
    >
      {children}
    </div>
  );
};

export default GlassContainer;