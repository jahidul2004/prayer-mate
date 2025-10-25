import React, { useState, useEffect } from "react";
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

    // Prayer times data
    const prayerTimes = [
        {
            id: "fajr",
            name: "ফজর",
            time: "05:15",
            displayTime: "৫:১৫ AM",
            icon: Sunrise,
            gradient: "from-blue-400 to-indigo-500",
            bgLight: "from-blue-50 to-indigo-50",
        },
        {
            id: "dhuhr",
            name: "যোহর",
            time: "12:15",
            displayTime: "১২:১৫ PM",
            icon: Sun,
            gradient: "from-yellow-400 to-orange-500",
            bgLight: "from-yellow-50 to-orange-50",
        },
        {
            id: "asr",
            name: "আসর",
            time: "16:30",
            displayTime: "৪:৩০ PM",
            icon: Sun,
            gradient: "from-orange-400 to-amber-500",
            bgLight: "from-orange-50 to-amber-50",
        },
        {
            id: "maghrib",
            name: "মাগরিব",
            time: "18:05",
            displayTime: "৬:০৫ PM",
            icon: Sunset,
            gradient: "from-pink-400 to-rose-500",
            bgLight: "from-pink-50 to-rose-50",
        },
        {
            id: "isha",
            name: "ইশা",
            time: "19:30",
            displayTime: "৭:৩০ PM",
            icon: Moon,
            gradient: "from-indigo-500 to-purple-600",
            bgLight: "from-indigo-50 to-purple-50",
        },
    ];

    const sunTimes = {
        sunrise: { time: "৬:০৮ AM", icon: Sunrise },
        sunset: { time: "৫:৪৫ PM", icon: Sunset },
    };

    // Calculate time remaining until next prayer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            // Find next prayer
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            let nextPrayerData = prayerTimes[0];

            for (let i = 0; i < prayerTimes.length; i++) {
                const [hours, minutes] = prayerTimes[i].time
                    .split(":")
                    .map(Number);
                const prayerMinutes = hours * 60 + minutes;

                if (prayerMinutes > currentMinutes) {
                    nextPrayerData = { ...prayerTimes[i], index: i };
                    break;
                }
            }

            setNextPrayer(nextPrayerData);

            // Calculate remaining time
            const [nextHours, nextMinutes] = nextPrayerData.time
                .split(":")
                .map(Number);
            let totalSecondsRemaining =
                nextHours * 3600 +
                nextMinutes * 60 -
                (now.getHours() * 3600 +
                    now.getMinutes() * 60 +
                    now.getSeconds());

            if (totalSecondsRemaining < 0) {
                totalSecondsRemaining += 24 * 3600; // Add 24 hours if next prayer is tomorrow
            }

            const hours = Math.floor(totalSecondsRemaining / 3600);
            const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
            const seconds = totalSecondsRemaining % 60;

            setTimeRemaining({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const toggleReminder = (prayerId) => {
        setReminders((prev) => ({
            ...prev,
            [prayerId]: !prev[prayerId],
        }));
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 pb-6">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">🕋</div>
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
                                    ঢাকা, বাংলাদেশ
                                </span>
                            </div>
                        </div>
                        <div className="text-white/80 text-sm text-center pt-2 border-t border-white/20">
                            হিজরি: ১৮ রবিউল আউয়াল, ১৪৪৭
                        </div>
                    </div>
                </div>
            </div>

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
                            {nextPrayer.displayTime}
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

            {/* Prayer Times List */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-[#bc31d1]" />
                    আজকের পাঁচ ওয়াক্ত নামাজ
                </h2>

                <div className="space-y-3">
                    {prayerTimes.map((prayer, index) => {
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
                    })}
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
