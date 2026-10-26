/**
 * RESPONSIVE COMPONENT TIP:
 * Instead of fixed `w-28` (112px) which overflows narrow screens when 3 are placed side-by-side,
 * use `w-full max-w-[110px] sm:w-28` and `h-28 sm:h-36`.
 * This allows each card to contract smoothly on 320px–375px mobile screens!
 */
const SmallContainer = ({ name, icon }) => {
  return (
    <div
      className="
        h-28 sm:h-36
        w-full max-w-[100px] sm:max-w-[112px]
        rounded-xl sm:rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-md
        flex flex-col
        items-center
        justify-center
        gap-2 sm:gap-3
        p-2
        transition-transform duration-200 hover:scale-105
      "
    >
      <div className="text-cyan-400 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-9 sm:[&>svg]:h-9 flex items-center justify-center">
        {icon}
      </div>

      <div className="text-white text-xs sm:text-sm text-center font-medium leading-tight line-clamp-2">
        {name}
      </div>
    </div>
  );
};

export default SmallContainer;