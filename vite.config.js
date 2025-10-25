import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.png",
                "robots.txt",
                "apple-touch-icon.png",
            ],
            manifest: {
                name: "প্রেয়ার মেট",
                short_name: "প্রেয়ার মেট",
                description:
                    "প্রেয়ার মেট হলো একটি প্রার্থনা অ্যাপ যা আপনাকে আপনার প্রার্থনাগুলো ট্র্যাক করতে এবং স্মরণ করাতে সাহায্য করে।",
                theme_color: "#bc31d1",
                background_color: "#ffffff",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    server: {
        port: 5000,
        host: "0.0.0.0",
    },
});
