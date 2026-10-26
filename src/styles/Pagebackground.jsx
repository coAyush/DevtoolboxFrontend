/**
 * RESPONSIVE DESIGN TIP:
 * When using `flex items-center justify-center` on full-screen containers (`min-h-screen`),
 * if the child content exceeds the viewport height (very common on mobile phones),
 * the top content gets pushed out of view above the top edge!
 * FIX: Use `justify-start sm:justify-center` and add responsive padding (`px-3 sm:px-6 py-4 sm:py-8`)
 * so mobile users can comfortably see and scroll from the very top.
 */
const PageBackground = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.25),transparent_35%),linear-gradient(to_bottom_right,#020617,#030b1f,#0f172a)] flex flex-col items-center justify-start sm:justify-center px-3 sm:px-6 py-4 sm:py-8 relative overflow-x-hidden">
      {children}
    </div>
  );
};

export default PageBackground;