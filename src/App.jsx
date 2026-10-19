import { Toaster } from 'react-hot-toast'
import './App.css'
import DevToolBoxRoutes from './routes/DevToolBoxRoutes'
import { messaging } from './firebase/firebaseConfig'
import { getToken, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { toastCustom } from './util/toat';
import { listenForMessage } from './firebase/notification';
import { accent, base } from './styles/toastStyles';
function App() {
  const requestPermission = async () => {
    //take permission
    const permission = await Notification.requestPermission();
    // generate token
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
    <>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 3500,

          // toast("hello") ya blank type ke liye -> cyan
          style: { ...base, ...accent("6, 182, 212") },

          success: {
            style: { ...base, ...accent("16, 185, 129") }, // emerald
            iconTheme: { primary: "#10b981", secondary: "#0f172a" },
          },
          error: {
            style: { ...base, ...accent("244, 63, 94") },  // rose
            iconTheme: { primary: "#f43f5e", secondary: "#0f172a" },
            duration: 5000, // error thoda zyada der dikhao
          },
          loading: {
            style: { ...base, ...accent("168, 85, 247") }, // purple
            iconTheme: { primary: "#a855f7", secondary: "#1e1b4b" },
          },
        }}
      />
      <DevToolBoxRoutes />
    </>
  )
}

export default App
