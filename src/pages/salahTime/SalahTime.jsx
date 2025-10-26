import React, { useState, useEffect, useRef } from "react";
import {
    AlarmClock,
    MapPin,
    Calendar,
    Sunrise,
    Sun,
    Sunset,
    Moon,
    Star,
    Bell,
    BellOff,
    Clock,
    ChevronRight,
} from "lucide-react";
import logoWhiteTransparent from "../../assets/logoWhiteTransparent.png";

/**
 * Dynamic SalahTime component
 * - Uses AlAdhan API: https://api.aladhan.com/v1/timings
 * - Default location: Dhaka (23.8103, 90.4125)
 * - If user grants geolocation, use that and save to localStorage ("prayer_location")
 * - All times displayed in 12-hour format (AM/PM)
 * - Countdown updates every second and handles next-day rollover
 * - UI/structure unchanged (only data wiring)
 */

const DEFAULT_LOCATION = {
    lat: 23.8103,
    lon: 90.4125,
    label: "ঢাকা, বাংলাদেশ",
};

const LS_KEY = "prayer_location";

const SalahTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState({
        name: "আসর",
        time: "16:30",
        index: 2,
    });
    const [timeRemaining, setTimeRemaining] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [reminders, setReminders] = useState({
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
    });

    // dynamic states
    const [prayerTimes, setPrayerTimes] = useState([]); // array of {id,name,time,displayTime,icon,gradient,bgLight}
    const [sunTimes, setSunTimes] = useState({
        sunrise: { time: "--:--", icon: Sunrise },
        sunset: { time: "--:--", icon: Sunset },
    });
    const [hijriDisplay, setHijriDisplay] = useState("লোড হচ্ছে...");
    const [location, setLocation] = useState(DEFAULT_LOCATION);
    const intervalRef = useRef(null);

    // utility: parse string like "05:15 (BDT)" or "05:15" -> returns "HH:MM"
    const extractHM = (timeStr) => {
        if (!timeStr) return null;
        const match = timeStr.match(/(\d{1,2}:\d{2})/);
        return match ? match[1] : null;
    };

    // utility: format to 12-hour like "5:15 AM"
    const to12Hour = (hhmm) => {
        if (!hhmm) return "--:--";
        const [h, m] = hhmm.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // format Bengali date as before (kept unchanged)
    const formatBengaliDate = (date) => {
        const bengaliMonths = [
            "জানুয়ারি",
            "ফেব্রুয়ারি",
            "মার্চ",
            "এপ্রিল",
            "মে",
            "জুন",
            "জুলাই",
            "আগস্ট",
            "সেপ্টেম্বর",
            "অক্টোবর",
            "নভেম্বর",
            "ডিসেম্বর",
        ];
        const bengaliDays = [
            "রবিবার",
            "সোমবার",
            "মঙ্গলবার",
            "বুধবার",
            "বৃহস্পতিবার",
            "শুক্রবার",
            "শনিবার",
        ];

        const day = bengaliDays[date.getDay()];
        const dateNum = date.getDate();
        const month = bengaliMonths[date.getMonth()];
        const year = date.getFullYear();

        return `${day}, ${dateNum} ${month} ${year}`;
    };

    // Toggle reminder bell
    const toggleReminder = (prayerId) => {
        setReminders((prev) => {
            const updated = { ...prev, [prayerId]: !prev[prayerId] };
            // You could also persist reminders to localStorage here if desired
            return updated;
        });
    };

    // Save location to localStorage helper
    const saveLocationToLS = (loc) => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(loc));
        } catch (e) {
            console.warn("Can't save location to localStorage", e);
        }
    };

    // Try to load saved location on mount, else try geolocation
    useEffect(() => {
        const saved = (() => {
            try {
                const raw = localStorage.getItem(LS_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        })();

        if (saved && saved.lat && saved.lon) {
            setLocation(saved);
            return;
        }

        // try to get geolocation (ask permission). If denied or not available, keep default.
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const loc = {
                        lat: Number(pos.coords.latitude.toFixed(6)),
                        lon: Number(pos.coords.longitude.toFixed(6)),
                        label: `${pos.coords.latitude.toFixed(
                            2
                        )}, ${pos.coords.longitude.toFixed(2)}`,
                    };
                    setLocation(loc);
                    saveLocationToLS(loc);
                },
                (err) => {
                    // permission denied or error -> keep default
                    // do nothing
                    // console.warn("Geolocation error:", err);
                    console.error("Geolocation error:", err);
                },
                { enableHighAccuracy: true, maximumAge: 60 * 60 * 1000 }
            );
        }
    }, []);

    // Fetch prayer times from AlAdhan for the given location
    const fetchPrayerData = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`
            );
            const json = await res.json();
            if (!json || json.code !== 200 || !json.data) {
                console.error("AlAdhan API returned unexpected:", json);
                return;
            }

            const t = json.data.timings || {};
            const date = json.data.date || {};
            const hijri = date.hijri || null;

            // Extract times (strip timezone notes)
            const fajrHM = extractHM(t.Fajr);
            const dhuhrHM = extractHM(t.Dhuhr);
            const asrHM = extractHM(t.Asr);
            const maghribHM = extractHM(t.Maghrib);
            const ishaHM = extractHM(t.Isha);
            const sunriseHM = extractHM(t.Sunrise);
            const sunsetHM = extractHM(t.Sunset);

            // Keep the exact array order and original display style
            const formattedPrayerTimes = [
                {
                    id: "fajr",
                    name: "ফজর",
                    time: fajrHM || "05:15",
                    displayTime: to12Hour(fajrHM || "05:15"),
                    icon: Sunrise,
                    gradient: "from-blue-400 to-indigo-500",
                    bgLight: "from-blue-50 to-indigo-50",
                },
                {
                    id: "dhuhr",
                    name: "যোহর",
                    time: dhuhrHM || "12:15",
                    displayTime: to12Hour(dhuhrHM || "12:15"),
                    icon: Sun,
                    gradient: "from-yellow-400 to-orange-500",
                    bgLight: "from-yellow-50 to-orange-50",
                },
                {
                    id: "asr",
                    name: "আসর",
                    time: asrHM || "16:30",
                    displayTime: to12Hour(asrHM || "16:30"),
                    icon: Sun,
                    gradient: "from-orange-400 to-amber-500",
                    bgLight: "from-orange-50 to-amber-50",
                },
                {
                    id: "maghrib",
                    name: "মাগরিব",
                    time: maghribHM || "18:05",
                    displayTime: to12Hour(maghribHM || "18:05"),
                    icon: Sunset,
                    gradient: "from-pink-400 to-rose-500",
                    bgLight: "from-pink-50 to-rose-50",
                },
                {
                    id: "isha",
                    name: "ইশা",
                    time: ishaHM || "19:30",
                    displayTime: to12Hour(ishaHM || "19:30"),
                    icon: Moon,
                    gradient: "from-indigo-500 to-purple-600",
                    bgLight: "from-indigo-50 to-purple-50",
                },
            ];

            setPrayerTimes(formattedPrayerTimes);

            setSunTimes({
                sunrise: {
                    time: to12Hour(sunriseHM || "06:08"),
                    icon: Sunrise,
                },
                sunset: { time: to12Hour(sunsetHM || "18:00"), icon: Sunset },
            });

            if (hijri) {
                // hijri.month.en is English month name; hijri.month.ar is Arabic. We'll show readable english month here.
                const hijriText = `${hijri.day} ${hijri.month.en}, ${hijri.year}`;
                setHijriDisplay(hijriText);
            } else {
                setHijriDisplay("লোড হচ্ছে...");
            }
        } catch (err) {
            console.error("Error fetching AlAdhan data:", err);
        }
    };

    // fetch data when location changes (initial or after user permission)
    useEffect(() => {
        fetchPrayerData(location.lat, location.lon);
    }, [location]);

    // Countdown & nextPrayer logic — updates every second
    useEffect(() => {
        // clear previous interval if any
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const tick = () => {
            const now = new Date();
            setCurrentTime(now);

            if (!prayerTimes || prayerTimes.length === 0) return;

            // find next prayer by comparing Date objects for today
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
            let found = null;
            for (let i = 0; i < prayerTimes.length; i++) {
                const p = prayerTimes[i];
                const [h, m] = p.time.split(":").map(Number);
                let pDate = new Date(today);
                pDate.setHours(h, m, 0, 0);

                // If this prayer time is earlier than now (passed), skip
                if (pDate.getTime() <= now.getTime()) {
                    continue;
                } else {
                    found = { ...p, index: i, dateObj: pDate };
                    break;
                }
            }

            // if none found (all passed), next is tomorrow fajr
            if (!found) {
                const p = prayerTimes[0];
                const [h, m] = p.time.split(":").map(Number);
                let pDate = new Date(today);
                pDate.setDate(pDate.getDate() + 1); // tomorrow
                pDate.setHours(h, m, 0, 0);
                found = { ...p, index: 0, dateObj: pDate };
            }

            // set next prayer state
            setNextPrayer({
                name: found.name,
                time: found.time,
                index: found.index,
                displayTime: found.displayTime,
            });

            // compute remaining seconds
            let diffSec = Math.max(
                0,
                Math.floor((found.dateObj.getTime() - now.getTime()) / 1000)
            );
            const hours = Math.floor(diffSec / 3600);
            diffSec -= hours * 3600;
            const minutes = Math.floor(diffSec / 60);
            const seconds = diffSec - minutes * 60;

            setTimeRemaining({ hours, minutes, seconds });
        };

        // initial tick
        tick();
        intervalRef.current = setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [prayerTimes]);

    // allow user to trigger location permission again (not shown in UI by default)
    // eslint-disable-next-line no-unused-vars
    const requestLocationManually = () => {
        if (!("geolocation" in navigator)) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = {
                    lat: Number(pos.coords.latitude.toFixed(6)),
                    lon: Number(pos.coords.longitude.toFixed(6)),
                    label: `${pos.coords.latitude.toFixed(
                        2
                    )}, ${pos.coords.longitude.toFixed(2)}`,
                };
                setLocation(loc);
                saveLocationToLS(loc);
            },
            (err) => {
                console.warn("Geolocation error:", err);
            },
            { enableHighAccuracy: true }
        );
    };

    // render unchanged UI, just replace hard-coded bits with dynamic state
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 pb-6">
            {/* Next Prayer Countdown */}
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl border border-purple-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <AlarmClock className="w-6 h-6 text-[#bc31d1]" />
                        <h2 className="text-lg font-bold text-gray-800">
                            পরবর্তী নামাজ
                        </h2>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-[#bc31d1] mb-2">
                            {nextPrayer.name}
                        </div>
                        <div className="text-2xl font-semibold text-gray-700">
                            {nextPrayer.displayTime ||
                                to12Hour(nextPrayer.time)}
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 rounded-2xl p-5 border border-[#bc31d1]/20">
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
                                    <div className="text-3xl font-bold text-[#bc31d1]">
                                        {String(timeRemaining.hours).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        ঘন্টা
                                    </div>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-[#bc31d1]">
                                :
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
                                    <div className="text-3xl font-bold text-[#bc31d1]">
                                        {String(timeRemaining.minutes).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        মিনিট
                                    </div>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-[#bc31d1]">
                                :
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
                                    <div className="text-3xl font-bold text-[#bc31d1]">
                                        {String(timeRemaining.seconds).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        সেকেন্ড
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-4 text-gray-600 font-medium">
                            {timeRemaining.hours > 0 &&
                                `${timeRemaining.hours} ঘন্টা `}
                            {timeRemaining.minutes} মিনিট{" "}
                            {timeRemaining.seconds} সেকেন্ড বাকি
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <img src={logoWhiteTransparent} alt="Logo" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            নামাজের সময়সূচি
                        </h1>
                        <p className="text-white/90 text-sm">
                            পাঁচ ওয়াক্ত নামাজের সঠিক সময়
                        </p>
                    </div>

                    {/* Date & Location */}
                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-white/90">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {formatBengaliDate(currentTime)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {location.label || "ঢাকা, বাংলাদেশ"}
                                </span>
                            </div>
                        </div>
                        <div className="text-white/80 text-sm text-center pt-2 border-t border-white/20">
                            হিজরি: {hijriDisplay}
                        </div>
                    </div>
                </div>
            </div>

            {/* Prayer Times List */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-[#bc31d1]" />
                    আজকের পাঁচ ওয়াক্ত নামাজ
                </h2>

                <div className="space-y-3">
                    {prayerTimes.length > 0 ? (
                        prayerTimes.map((prayer, index) => {
                            const Icon = prayer.icon;
                            const isActive = nextPrayer.index === index;

                            return (
                                <div
                                    key={prayer.id}
                                    className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border ${
                                        isActive
                                            ? "ring-2 ring-[#bc31d1] ring-opacity-50 shadow-[#bc31d1]/20"
                                            : "border-purple-100/50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                                                    isActive
                                                        ? prayer.gradient
                                                        : prayer.bgLight
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-8 h-8 ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-[#bc31d1]"
                                                    }`}
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`text-xl font-bold ${
                                                            isActive
                                                                ? "text-[#bc31d1]"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        {prayer.name}
                                                    </div>
                                                    {isActive && (
                                                        <span className="bg-[#bc31d1] text-white text-xs px-2 py-1 rounded-full font-medium">
                                                            পরবর্তী
                                                        </span>
                                                    )}
                                                </div>
                                                <div
                                                    className={`text-2xl font-bold ${
                                                        isActive
                                                            ? "text-[#bc31d1]"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {prayer.displayTime}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reminder Bell */}
                                        <button
                                            onClick={() =>
                                                toggleReminder(prayer.id)
                                            }
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                reminders[prayer.id]
                                                    ? "bg-gradient-to-br from-[#bc31d1] to-[#d65de6] shadow-lg"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                        >
                                            {reminders[prayer.id] ? (
                                                <Bell
                                                    className="w-5 h-5 text-white"
                                                    fill="white"
                                                />
                                            ) : (
                                                <BellOff className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500">
                            লোড হচ্ছে...
                        </div>
                    )}
                </div>
            </div>

            {/* Sun Times */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100/50">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#bc31d1]" />
                    সূর্যের সময়সূচি
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center">
                                <Sunrise className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 font-medium">
                                    সূর্যোদয়
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                    {sunTimes.sunrise.time}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                                <Sunset className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 font-medium">
                                    সূর্যাস্ত
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                    {sunTimes.sunset.time}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalahTime;
