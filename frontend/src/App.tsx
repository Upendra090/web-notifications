import { useEffect, useState } from "react";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";
import { messaging } from "./firebase/firebaseConfig";
import { getToken } from "firebase/messaging";
import { BASE_BACKEND_URL, FIREBASE_VAPID_KEY } from "./utils";
import axios from "axios";
import { Slide, ToastContainer, toast } from "react-toastify";
import CreateNotification from "./components/CreateNotification";
const backendUrl = BASE_BACKEND_URL;

export default function App() {
  const [token, setToken] = useState<string>("");

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      let currentToken = localStorage.getItem("fcmToken");

      if (!currentToken) {
        currentToken = await getToken(messaging, {
          vapidKey: FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          console.log("Generated token:", currentToken);
          setToken(currentToken);
          localStorage.setItem("fcmToken", currentToken);
          await saveToken(currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      } else {
        console.log("Token already exists in localStorage:");
        setToken(currentToken);
      }
    } else {
      console.log("Permission to send notifications denied.");
      toast.error("Permission to send notifications denied.");
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  async function saveToken(token: any) {
    try {
      const response = await axios.post(`${backendUrl}/store-tokens`, {
        data: { gsmToken: token },
      });
      console.log("Token stored:", response);
      toast.success("Token stored successfully");
    } catch (err) {
      console.error("Error storing token:", err);
    }
  }

  return (
    <>
      <main className="text-gray-200 bg-gradient-to-r from-gray-900 to-slate-800 w-full h-full min-h-[100vh]">
        <header className="text-center py-2">
          <h1 className="text-2xl font-bold text-gray-200">
            React Notification with firebase
          </h1>
        </header>
        <main className="h-[30vh] text-center w-full flex justify-center items-center">
          <p>{token ? "Token generated and stored" : "Generating token..."}</p>
        </main>

        <CreateNotification />

        <ToastContainer position="top-center" theme="dark" transition={Slide} />
      </main>
    </>
  );
}
