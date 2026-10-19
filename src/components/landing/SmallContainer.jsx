const SmallContainer = ({ name, icon }) => {
  return (
    <div
      className="
        h-36
        w-28
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-md
        flex flex-col
        items-center
        justify-center
        gap-3
      "
    >
      <div className="text-cyan-400 text-5xl">
        {icon}
      </div>

      <div className="text-white text-sm text-center">
        {name}
      </div>
    </div>
  );
};

export default SmallContainer;