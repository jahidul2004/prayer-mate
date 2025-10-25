import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import router from "./Router/router";
import "./index.css";

// Service Worker register করা
// eslint-disable-next-line no-unused-vars
const updateSW = registerSW({
    onNeedRefresh() {
        // Optional: আপনি চাইলে user কে notify করতে পারেন যে নতুন version available
        console.log("নতুন version available, refresh করুন।");
    },
    onOfflineReady() {
        console.log("এখন আপনার অ্যাপ offline ব্যবহার করার জন্য ready।");
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
