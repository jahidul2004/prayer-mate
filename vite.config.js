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
                name: "নামাজের সময় অ্যাপ",
                short_name: "নামাজ অ্যাপ",
                description:
                    "নামাজের সময়, কিবলা ও দোয়া দেখার জন্য Progressive Web App",
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
