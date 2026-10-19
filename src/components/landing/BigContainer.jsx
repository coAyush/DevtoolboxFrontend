const BigContainer = ({ title, children, theme = "cyan" ,value,className}) => {
  return (
    <div
      className={`
        w-[420px]
        rounded-3xl
        p-8
        backdrop-blur-md
        bg-slate-900/40
        border
        ${
          theme === "cyan"
            ? "border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.35)]"
            : "border-purple-400/60 shadow-[0_0_40px_rgba(168,85,247,0.35)]"
        }
      ${className}`}
    >
      <h2
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "cyan" ? "text-cyan-400" : "text-purple-400"
        }`}
      >
        {title}
      </h2>

      <div className="flex justify-center gap-4">
        {children}
      </div>
      <div aria-label="button"  className={`
    mt-6
    w-full
    py-3
    rounded-xl
    text-center
    font-semibold
    ${
      theme === "cyan"
        ? "bg-cyan-500 text-black hover:bg-cyan-200 text-pink-950"
        : "bg-purple-500 text-white hover:bg-pink-600 text-purple-400"
    }
 `}>{value}</div>
    </div>
  );
};

export default BigContainer;