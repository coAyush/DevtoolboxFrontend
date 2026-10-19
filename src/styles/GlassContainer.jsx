const GlassContainer = ({ children }) => {
  return (
    <div className="
      h-[calc(100vh-80px)]
      w-[98%]
      max-w-7xl
      rounded-3xl
      border border-cyan-400/40
      bg-slate-950/70
      backdrop-blur-md
      shadow-[0_0_40px_rgba(34,211,238,0.15)]
      overflow-hidden
      flex flex-col
      gap-y-15
      p-4
    ">
      {children}
    </div>
  );
};

export default GlassContainer;