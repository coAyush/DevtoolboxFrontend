import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loadingAnimation from "../assets/loading.lottie";

const Loading = () => {
  return (
    <div className="min-h-screen bg-[#080B11] flex flex-col items-center justify-center gap-4">
      <div className="w-36 h-36">
        <DotLottieReact
          src={loadingAnimation}
          autoplay
          loop
        />
      </div>
      <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
        Initializing DevToolBox Workspace...
      </p>
    </div>
  );
};

export default Loading;
