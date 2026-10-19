import { onMessage } from "firebase/messaging"
import { messaging } from "./firebaseConfig"

const listenForMessage = (callback) => {
    return onMessage(messaging, (payload) => {
        callback(payload)
    })
}
export { listenForMessage }