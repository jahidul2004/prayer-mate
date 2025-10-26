import { useState, useEffect } from "react";
import {
    AlarmClock,
    MapPin,
    Calendar,
    Sunrise,
    Sun,
    Sunset,
    Moon,
    Clock,
    BookOpen,
    ChevronRight,
    Compass,
    Bell,
    BellOff,
    Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState([]);
    const [nextPrayer, setNextPrayer] = useState("");
    const [nextPrayerTime, setNextPrayerTime] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");
    const [hijriDate, setHijriDate] = useState("");

    const latitude = 23.8103;
    const longitude = 90.4125;

    // format date in Bengali
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
        const day = date.getDate();
        const month = bengaliMonths[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    // format 12-hour time
    const format12Hour = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // fetch data from Aladhan API
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const res = await fetch(
                    `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
                );
                const data = await res.json();
                const timings = data.data.timings;
                const hijri = data.data.date.hijri;

                setHijriDate(`${hijri.day} ${hijri.month.en}, ${hijri.year}`);

                const formatted = [
                    { name: "ফজর", time: timings.Fajr, icon: Sunrise },
                    { name: "যোহর", time: timings.Dhuhr, icon: Sun },
                    { name: "আসর", time: timings.Asr, icon: Sun },
                    { name: "মাগরিব", time: timings.Maghrib, icon: Sunset },
                    { name: "ইশা", time: timings.Isha, icon: Moon },
                ];
                setPrayerTimes(formatted);
            } catch (error) {
                console.error("Error fetching prayer times:", error);
            }
        };
        fetchPrayerTimes();
    }, []);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // calculate next prayer
    useEffect(() => {
        if (prayerTimes.length === 0) return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let next = null;
        for (const prayer of prayerTimes) {
            const [hour, minute] = prayer.time.split(":").map(Number);
            const prayerMinutes = hour * 60 + minute;
            if (prayerMinutes > currentMinutes) {
                next = prayer;
                break;
            }
        }

        if (!next) {
            next = prayerTimes[0]; // next day Fajr
        }

        setNextPrayer(next.name);
        setNextPrayerTime(format12Hour(next.time));

        const [h, m] = next.time.split(":").map(Number);
        const nextPrayerDate = new Date();
        nextPrayerDate.setHours(h, m, 0);

        let diff = (nextPrayerDate - now) / 1000; // seconds
        if (diff < 0) diff += 24 * 3600; // next day fallback

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);

        setTimeRemaining(`${hours} ঘন্টা ${minutes} মিনিট`);
    }, [prayerTimes, currentTime]);

    const [notificationEnabled, setNotificationEnabled] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 pb-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-3xl p-6 mb-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10">
                    {/* Date & Location */}
                    <div className="flex items-center justify-between mb-6">
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

                    {/* Next Prayer */}
                    <div className="text-center bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <div className="text-white/90 text-sm mb-2 flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>পরবর্তী নামাজ</span>
                        </div>
                        <div className="text-white text-4xl font-bold mb-2">
                            {nextPrayer || "লোড হচ্ছে..."}
                        </div>
                        <div className="text-white/90 text-2xl font-semibold mb-3">
                            {nextPrayerTime || "--:--"}
                        </div>
                        <div className="text-white/80 text-sm">
                            আর {timeRemaining || "..."} বাকি
                        </div>
                    </div>

                    {/* Hijri Date */}
                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 mt-6 border border-white/20 text-center">
                        <div className="text-white/80 text-sm mb-1">
                            হিজরি তারিখ
                        </div>
                        <div className="text-white text-lg font-semibold">
                            {hijriDate || "লোড হচ্ছে..."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Prayer Times List */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <AlarmClock className="w-6 h-6 text-[#bc31d1]" />
                        আজকের নামাজের সময়
                    </h2>
                </div>

                <div className="space-y-3">
                    {prayerTimes.map((prayer, index) => {
                        const Icon = prayer.icon;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100/50 ${
                                    prayer.name === nextPrayer
                                        ? "ring-2 ring-[#bc31d1] ring-opacity-50"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                                prayer.name === nextPrayer
                                                    ? "bg-gradient-to-br from-[#bc31d1] to-[#d65de6]"
                                                    : "bg-gradient-to-br from-purple-100 to-pink-100"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-7 h-7 ${
                                                    prayer.name === nextPrayer
                                                        ? "text-white"
                                                        : "text-[#bc31d1]"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <div
                                                className={`text-lg font-bold ${
                                                    prayer.name === nextPrayer
                                                        ? "text-[#bc31d1]"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {prayer.name}
                                            </div>
                                            {prayer.name === nextPrayer && (
                                                <div className="text-xs text-[#bc31d1] font-medium">
                                                    পরবর্তী নামাজ
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={`text-2xl font-bold ${
                                            prayer.name === nextPrayer
                                                ? "text-[#bc31d1]"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {format12Hour(prayer.time)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Daily Dua / Amol */}
            <div className="mb-6 bg-gradient-to-br from-white to-purple-50/50 rounded-3xl p-6 shadow-lg border border-purple-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        আজকের দোয়া
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-purple-50">
                    <div className="text-2xl text-right mb-3 text-[#bc31d1] font-arabic leading-loose">
                        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </div>
                    <div className="text-gray-700 leading-relaxed mb-2">
                        "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে"
                    </div>
                    <div className="text-sm text-gray-500 italic">
                        প্রতিটি কাজ শুরুর দোয়া
                    </div>
                </div>

                <button className="w-full bg-gradient-to-r from-[#bc31d1] to-[#d65de6] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <span>আরও দোয়া দেখুন</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Mini Qibla Preview */}
            <div className="mb-6 bg-white rounded-3xl p-6 shadow-lg border border-purple-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-xl flex items-center justify-center">
                        <Compass className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        কিবলা নির্দেশনা
                    </h2>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-4 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-full animate-pulse opacity-20"></div>
                        <div className="absolute inset-2 bg-white rounded-full shadow-xl flex items-center justify-center">
                            <Compass
                                className="w-16 h-16 text-[#bc31d1]"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#bc31d1] mb-1">
                            ২৮৫°
                        </div>
                        <div className="text-sm text-gray-600">
                            উত্তর-পশ্চিম দিক
                        </div>
                    </div>
                </div>

                <Link
                    to="/qibla"
                    className="w-full bg-gradient-to-r from-[#bc31d1] to-[#d65de6] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                    <span>সম্পূর্ণ কিবলা দেখুন</span>
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Daily Islamic Quote */}
            <div className="bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-6 h-6 text-white" fill="white" />
                        <h2 className="text-xl font-bold text-white">
                            আজকের অনুপ্রেরণা
                        </h2>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                        <div className="text-white leading-relaxed mb-3 text-lg">
                            "যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য নামাজ আদায় করে,
                            আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করেন।"
                        </div>
                        <div className="text-white/80 text-sm">
                            — সহীহ মুসলিম
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
