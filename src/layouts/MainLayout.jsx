import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
    Home,
    Search,
    Bell,
    Heart,
    Compass,
    AlarmClockCheck,
} from "lucide-react";

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const navItems = [
        { icon: Home, label: "হোম", path: "/" },
        { icon: AlarmClockCheck, label: "নামাজের সময়", path: "/salah-time" },
        { icon: Compass, label: "কিবলা", path: "/qibla" },
        { icon: Heart, label: "আমল", path: "/amal" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex flex-col min-h-screen bg-base-200">
            {/* Top Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#bc31d1] to-[#d65de6] shadow-lg z-50">
                <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <Home
                                className="w-6 h-6 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <h1 className="text-white text-xl font-bold tracking-wide">
                            প্রেয়ার মেট
                        </h1>
                    </div>

                    {/* Header Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105"
                        >
                            <Search
                                className="w-5 h-5 text-white"
                                strokeWidth={2.5}
                            />
                        </button>
                        <Link to={"/notifications"} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105 relative">
                            <Bell
                                className="w-5 h-5 text-white"
                                strokeWidth={2.5}
                            />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 mt-16 mb-20 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-base-100 border-t border-base-300 z-50 shadow-2xl">
                <div className="h-full max-w-2xl mx-auto px-4 flex items-center justify-around">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                                    active
                                        ? "bg-[#bc31d1]/10 -translate-y-1"
                                        : "hover:bg-base-200"
                                }`}
                            >
                                <div className="relative">
                                    <Icon
                                        className={`w-6 h-6 transition-colors ${
                                            active
                                                ? "text-[#bc31d1]"
                                                : "text-base-content/60"
                                        }`}
                                        strokeWidth={active ? 2.5 : 2}
                                    />
                                    {active && (
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#bc31d1] rounded-full"></div>
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-medium transition-colors ${
                                        active
                                            ? "text-[#bc31d1] font-semibold"
                                            : "text-base-content/60"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Active Navigation Indicator */}
            <div className="fixed bottom-[76px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#bc31d1] to-transparent opacity-30 pointer-events-none"></div>
        </div>
    );
};

export default MainLayout;
