import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useNavigation } from "react-router";
import Loading from "../pages/Loading";
const AppLayout = () => {
  const navigationState = useNavigation();
  console.log(navigationState);

  return (
    <>
      {navigationState.state == "loading" && <Loading />}
      <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
export default AppLayout;