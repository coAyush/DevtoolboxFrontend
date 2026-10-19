const PageBackground = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.25),transparent_35%),linear-gradient(to_bottom_right,#020617,#030b1f,#0f172a)] flex items-center justify-center relative">
      {children}
    </div>
  );
};

export default PageBackground;