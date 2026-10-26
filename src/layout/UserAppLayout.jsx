import React, { useEffect } from 'react'
import PageBackground from '../styles/Pagebackground'
import UserNavbar from './UserNavbar'
import { Outlet, useLoaderData } from 'react-router'
import { messaging } from '../firebase/firebaseConfig'
import { getToken } from 'firebase/messaging'
import { toastCustom } from '../util/toat'
import { listenForMessage } from '../firebase/notification'
import { UserDetailsProvider } from '../context/User/UserDetailsContext'
const UserAppLayout = () => {
  const loaderData = useLoaderData();
  console.log(loaderData);
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: "BJnd5gigRcfVJY7eEVvKu4pIrZ7emVasqJ0xBhmWckwXXnDM-PuAzV09pWF5Z3-8GvL6HE5nXfd9NzWIquU7RpA" });
      console.log("FCM token", token);
    } else if (permission === "denied") {
      toastCustom("Notification permission deneid");
    } else {
      toastCustom("Notification permission deneid");
    }
  }

  useEffect(() => {
    requestPermission();
    const unsubscribe = listenForMessage((payload) => {
      toastCustom(`${payload.notification.title}` + "\n" + `${payload.notification.body}`);
    })
    return () => unsubscribe()
  }, [])

  /**
   * RESPONSIVE DASHBOARD LAYOUT TIP:
   * 1. NEVER wrap both a sidebar (Navbar) and <Outlet /> in a `flex items-center justify-center` container.
   *    A dashboard layout needs a continuous horizontal shell: `flex min-h-screen w-full`.
   * 2. The main content area MUST have:
   *    - `flex-1`: fills remaining horizontal width.
   *    - `min-w-0`: prevents flex child elements (like charts/tables/pre tags) from blowing out the width.
   *    - `min-h-screen overflow-y-auto`: enables vertical scrolling on mobile when content is long.
   *    - `pt-16 lg:pt-6`: leaves space for the mobile hamburger button (`top-4 left-4`) on mobile screens!
   */
  return (
    <UserDetailsProvider>
      <div className="min-h-screen w-full flex bg-[#080B11] text-slate-100 overflow-x-hidden relative">
        <UserNavbar />
        <main className="flex-1 min-w-0 min-h-screen overflow-y-auto pt-16 lg:pt-6 px-3 sm:px-6 lg:px-8 pb-12">
          <Outlet />
        </main>
      </div>
    </UserDetailsProvider>
  );
};

export default UserAppLayout;