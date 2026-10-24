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

  return (
    <UserDetailsProvider>
      <div className='flex h-screen w-screen'>
        <PageBackground>
          <UserNavbar />
          <Outlet />
        </PageBackground>
      </div>
    </UserDetailsProvider>
  )
}

export default UserAppLayout