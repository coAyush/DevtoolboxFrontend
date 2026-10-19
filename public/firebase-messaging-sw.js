importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDiJww0bOZKTOJJVXyjv4R08nPoxtnRKto",
    authDomain: "devtoolbox-91200.firebaseapp.com",
    projectId: "devtoolbox-91200",
    storageBucket: "devtoolbox-91200.firebasestorage.app",
    messagingSenderId: "1034912653854",
    appId: "1:1034912653854:web:c1f848674261e5a6a7c40f",
    measurementId: "G-E06P9LF017"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    const notificationTitle = payload.notification.title || "devtoolbox";
    const options = {
        body: payload.notification.body || "",
        icon: "/devtoolbox-fcm-icon.png",
        vibrate: true,
        tag: "devtoolbox-notification",
        data: {
            url: "/dashboard",
            type: "GENERAL_NOTIFICATION"
        },

        actions: [
            {
                action: "open",
                title: "Open"
            },
            {
                action: "dismiss",
                title: "Dismiss"
            }
        ]
    }

    self.registration.showNotification(notificationTitle, options);
});