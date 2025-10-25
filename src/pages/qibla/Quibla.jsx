import React, { useState, useEffect } from "react";
import {
    Compass,
    MapPin,
    Navigation,
    RefreshCw,
    Locate,
    ArrowUp,
    Globe2,
} from "lucide-react";

const Qibla = () => {
    const [qiblaDirection, setQiblaDirection] = useState(285); // Example: 285° from North
    const [userLocation, setUserLocation] = useState({
        city: "ঢাকা",
        country: "বাংলাদেশ",
        lat: 23.8103,
        lon: 90.4125,
    });
    const [deviceHeading, setDeviceHeading] = useState(0);
    const [loading, setLoading] = useState(false);
    const [locationPermission, setLocationPermission] = useState(true);
    const [compassRotation, setCompassRotation] = useState(0);

    // Calculate Qibla direction from user's location to Kaaba
    const calculateQiblaDirection = (lat, lon) => {
        const kaabaLat = 21.4225;
        const kaabaLon = 39.8262;

        const φ1 = (lat * Math.PI) / 180;
        const φ2 = (kaabaLat * Math.PI) / 180;
        const Δλ = ((kaabaLon - lon) * Math.PI) / 180;

        const y = Math.sin(Δλ);
        const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
        const θ = Math.atan2(y, x);
        const bearing = ((θ * 180) / Math.PI + 360) % 360;

        return Math.round(bearing);
    };

    // Update location and recalculate Qibla
    const updateLocation = async () => {
        setLoading(true);

        if ("geolocation" in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;
                const direction = calculateQiblaDirection(latitude, longitude);

                setQiblaDirection(direction);
                setUserLocation({
                    city: "ঢাকা", // In real app, use reverse geocoding API
                    country: "বাংলাদেশ",
                    lat: latitude,
                    lon: longitude,
                });
                setLocationPermission(true);
            } catch (error) {
                console.error("Location error:", error);
                setLocationPermission(false);
            }
        }

        setTimeout(() => setLoading(false), 1000);
    };

    // Device orientation for compass
    useEffect(() => {
        const handleOrientation = (event) => {
            if (event.alpha !== null) {
                setDeviceHeading(event.alpha);
                setCompassRotation(-event.alpha);
            }
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleOrientation);
            return () =>
                window.removeEventListener(
                    "deviceorientation",
                    handleOrientation
                );
        }
    }, []);

    // Calculate arrow rotation (points to Qibla)
    const arrowRotation = qiblaDirection - deviceHeading;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="w-full max-w-md mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-2xl flex items-center justify-center shadow-lg">
                        <Compass className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        কিবলা নির্দেশক
                    </h1>
                </div>
                <p className="text-gray-600 text-sm">
                    মক্কার কাবা শরীফের দিকনির্দেশনা
                </p>
            </div>

            {/* Location Info */}
            <div className="w-full max-w-md mb-8">
                <div className="bg-white rounded-3xl p-5 shadow-xl border border-purple-100/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-[#bc31d1]" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">
                                    বর্তমান অবস্থান
                                </div>
                                <div className="text-lg font-bold text-gray-800">
                                    {userLocation.city}, {userLocation.country}
                                </div>
                            </div>
                        </div>
                        <Globe2 className="w-8 h-8 text-purple-300" />
                    </div>
                </div>
            </div>

            {/* Main Compass */}
            <div className="w-full max-w-md mb-8">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100/50 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#bc31d1]/5 to-[#d65de6]/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full -ml-16 -mb-16 blur-xl"></div>

                    <div className="relative z-10">
                        {/* Compass Circle */}
                        <div className="relative w-full aspect-square max-w-sm mx-auto">
                            {/* Outer decorative rings */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 animate-pulse"></div>
                            <div className="absolute inset-3 rounded-full bg-white shadow-inner"></div>

                            {/* Compass base (rotates with device) */}
                            <div
                                className="absolute inset-6 transition-transform duration-300 ease-out"
                                style={{
                                    transform: `rotate(${compassRotation}deg)`,
                                }}
                            >
                                {/* Cardinal directions */}
                                <div className="absolute inset-0">
                                    {/* North */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                        <div className="text-xl font-bold text-red-500">
                                            N
                                        </div>
                                    </div>
                                    {/* South */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                        <div className="text-sm font-semibold text-gray-400">
                                            S
                                        </div>
                                    </div>
                                    {/* East */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <div className="text-sm font-semibold text-gray-400">
                                            E
                                        </div>
                                    </div>
                                    {/* West */}
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                        <div className="text-sm font-semibold text-gray-400">
                                            W
                                        </div>
                                    </div>
                                </div>

                                {/* Degree markers */}
                                {[...Array(36)].map((_, i) => {
                                    const angle = i * 10;
                                    const isCardinal = angle % 90 === 0;
                                    return (
                                        <div
                                            key={i}
                                            className="absolute top-1/2 left-1/2 origin-bottom"
                                            style={{
                                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-45%)`,
                                                height: "50%",
                                            }}
                                        >
                                            <div
                                                className={`mx-auto ${
                                                    isCardinal
                                                        ? "w-1 h-4 bg-gray-400"
                                                        : "w-0.5 h-2 bg-gray-300"
                                                }`}
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Qibla Arrow (points to Kaaba) */}
                            <div
                                className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                                style={{
                                    transform: `rotate(${arrowRotation}deg)`,
                                }}
                            >
                                <div className="relative">
                                    {/* Arrow glow effect */}
                                    <div className="absolute inset-0 blur-xl bg-[#bc31d1]/30 rounded-full scale-150"></div>

                                    {/* Main arrow */}
                                    <div className="relative">
                                        <Navigation
                                            className="w-24 h-24 text-[#bc31d1] drop-shadow-2xl"
                                            fill="#bc31d1"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Center dot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-full shadow-lg"></div>
                            </div>
                        </div>

                        {/* Direction Info */}
                        <div className="mt-8 text-center">
                            <div className="text-sm text-gray-500 mb-2">
                                কিবলার দিক
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <div className="text-5xl font-bold text-[#bc31d1]">
                                    {qiblaDirection}°
                                </div>
                                <ArrowUp
                                    className="w-8 h-8 text-[#bc31d1]"
                                    strokeWidth={3}
                                />
                            </div>
                            <div className="text-gray-600 font-medium">
                                {qiblaDirection >= 0 &&
                                    qiblaDirection < 45 &&
                                    "উত্তর"}
                                {qiblaDirection >= 45 &&
                                    qiblaDirection < 135 &&
                                    "পূর্ব"}
                                {qiblaDirection >= 135 &&
                                    qiblaDirection < 225 &&
                                    "দক্ষিণ"}
                                {qiblaDirection >= 225 &&
                                    qiblaDirection < 315 &&
                                    "পশ্চিম"}
                                {qiblaDirection >= 315 && "উত্তর"}
                                {" - "}
                                {qiblaDirection >= 315 || qiblaDirection < 45
                                    ? "উত্তর"
                                    : ""}
                                {qiblaDirection >= 45 && qiblaDirection < 135
                                    ? "পূর্ব"
                                    : ""}
                                {qiblaDirection >= 135 && qiblaDirection < 225
                                    ? "দক্ষিণ"
                                    : ""}
                                {qiblaDirection >= 225 && qiblaDirection < 315
                                    ? "পশ্চিম"
                                    : ""}
                                {" দিক"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instruction Card */}
            <div className="w-full max-w-md mb-6">
                <div className="bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 rounded-2xl p-5 border border-[#bc31d1]/20">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 mb-1">
                                কিভাবে ব্যবহার করবেন
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                আপনার ফোনটি সমতল রাখুন এবং সবুজ তীরটি কাবার দিকে
                                ঘুরুন। তীরটি যে দিকে নির্দেশ করবে, সেই দিকেই
                                কিবলা।
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Location Button */}
            <button
                onClick={updateLocation}
                disabled={loading}
                className="w-full max-w-md bg-gradient-to-r from-[#bc31d1] to-[#d65de6] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-[#bc31d1]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>আপডেট হচ্ছে...</span>
                    </>
                ) : (
                    <>
                        <Locate className="w-6 h-6" />
                        <span>লোকেশন আপডেট করুন</span>
                    </>
                )}
            </button>

            {/* Permission message */}
            {!locationPermission && (
                <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-red-600">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            লোকেশন পারমিশন প্রয়োজন। দয়া করে আপনার ব্রাউজারে
                            পারমিশন দিন।
                        </span>
                    </div>
                </div>
            )}

            {/* Kaaba Distance Info */}
            <div className="w-full max-w-md mt-6 text-center">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-100/50">
                    <div className="text-sm text-gray-600 mb-1">
                        মক্কা থেকে দূরত্ব
                    </div>
                    <div className="text-2xl font-bold text-[#bc31d1]">
                        ৩,৮৫০ কিমি
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Qibla;
