import { useState } from "react";
import {
    Heart,
    Sparkles,
    BookOpen,
    Star,
    Copy,
    Check,
    Search,
    X,
    Moon,
    Sun,
    Sunrise,
    Sunset,
} from "lucide-react";

const Amal = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");

    // Dua and Dhikr data
    const amalList = [
        {
            id: 1,
            category: "morning",
            title: "সকালের দোয়া",
            arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
            transliteration: "Asbahna wa asbahal mulku lillah",
            bengali: "আমরা সকালে উপনীত হয়েছি এবং সমস্ত রাজত্ব আল্লাহর জন্য।",
            icon: Sunrise,
        },
        {
            id: 2,
            category: "evening",
            title: "সন্ধ্যার দোয়া",
            arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
            transliteration: "Amsayna wa amsal mulku lillah",
            bengali:
                "আমরা সন্ধ্যায় উপনীত হয়েছি এবং সমস্ত রাজত্ব আল্লাহর জন্য।",
            icon: Sunset,
        },
        {
            id: 3,
            category: "general",
            title: "সুবহানাল্লাহ",
            arabic: "سُبْحَانَ اللَّهِ",
            transliteration: "Subhanallah",
            bengali: "আল্লাহ পবিত্র, মহান এবং সকল দোষ-ত্রুটি থেকে মুক্ত।",
            icon: Sparkles,
        },
        {
            id: 4,
            category: "general",
            title: "আলহামদুলিল্লাহ",
            arabic: "الْحَمْدُ لِلَّهِ",
            transliteration: "Alhamdulillah",
            bengali: "সকল প্রশংসা আল্লাহর জন্য।",
            icon: Heart,
        },
        {
            id: 5,
            category: "general",
            title: "আল্লাহু আকবার",
            arabic: "اللَّهُ أَكْبَرُ",
            transliteration: "Allahu Akbar",
            bengali: "আল্লাহ সবচেয়ে মহান।",
            icon: Star,
        },
        {
            id: 6,
            category: "protection",
            title: "আয়াতুল কুরসি",
            arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
            transliteration: "Allahu la ilaha illa huwal hayyul qayyum",
            bengali:
                "আল্লাহ, তিনি ছাড়া কোন উপাস্য নেই। তিনি চিরঞ্জীব, সর্বদা রক্ষণাবেক্ষণকারী।",
            icon: BookOpen,
        },
        {
            id: 7,
            category: "sleep",
            title: "ঘুমানোর দোয়া",
            arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
            transliteration: "Bismika Allahumma amutu wa ahya",
            bengali: "হে আল্লাহ! তোমার নামে আমি মৃত্যুবরণ করি এবং জীবিত হই।",
            icon: Moon,
        },
        {
            id: 8,
            category: "general",
            title: "দরুদ শরীফ",
            arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
            transliteration:
                "Allahumma salli ala Muhammadin wa ala ali Muhammad",
            bengali:
                "হে আল্লাহ! মুহাম্মদ (সা.) এবং তাঁর পরিবারের উপর রহমত বর্ষণ করুন।",
            icon: Moon,
        },
        {
            id: 9,
            category: "morning",
            title: "সকালের যিকির",
            arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
            transliteration: "La ilaha illallahu wahdahu la sharika lah",
            bengali:
                "আল্লাহ ছাড়া কোন উপাস্য নেই, তিনি একক, তাঁর কোন শরীক নেই।",
            icon: Sun,
        },
        {
            id: 10,
            category: "protection",
            title: "বিপদ থেকে রক্ষার দোয়া",
            arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
            transliteration: "Hasbunallahu wa ni'mal wakeel",
            bengali:
                "আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনি কতই না উত্তম কর্মবিধায়ক।",
            icon: Heart,
        },
    ];

    const categories = [
        { id: "all", name: "সব", icon: BookOpen },
        { id: "morning", name: "সকাল", icon: Sunrise },
        { id: "evening", name: "সন্ধ্যা", icon: Sunset },
        { id: "general", name: "সাধারণ", icon: Sparkles },
        { id: "protection", name: "সুরক্ষা", icon: Heart },
        { id: "sleep", name: "ঘুম", icon: Moon },
    ];

    // Filter amal list
    const filteredAmalList = amalList.filter((amal) => {
        const matchesSearch =
            amal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            amal.bengali.toLowerCase().includes(searchQuery.toLowerCase()) ||
            amal.transliteration
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesCategory =
            filterCategory === "all" || amal.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Copy to clipboard
    const handleCopy = (amal) => {
        const textToCopy = `${amal.title}\n\n${amal.arabic}\n\n${amal.transliteration}\n\n${amal.bengali}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(amal.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 pb-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <Moon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            দোয়া ও যিকির
                        </h1>
                    </div>
                    <p className="text-white/90 text-sm">
                        প্রতিদিনের আমল ও দোয়া সমূহ
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="দোয়া অথবা যিকির খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-lg border border-purple-100/50 focus:outline-none focus:ring-2 focus:ring-[#bc31d1] focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6 overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setFilterCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                    filterCategory === category.id
                                        ? "bg-gradient-to-r from-[#bc31d1] to-[#d65de6] text-white shadow-lg"
                                        : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-100/50"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Results Count */}
            {searchQuery && (
                <div className="mb-4 text-center">
                    <span className="text-sm text-gray-600">
                        {filteredAmalList.length} টি ফলাফল পাওয়া গেছে
                    </span>
                </div>
            )}

            {/* Amal List */}
            <div className="space-y-4">
                {filteredAmalList.length > 0 ? (
                    filteredAmalList.map((amal) => {
                        const Icon = amal.icon;
                        return (
                            <div
                                key={amal.id}
                                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100/50 group hover:scale-[1.01]"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6 text-[#bc31d1]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {amal.title}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {
                                                    categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            amal.category
                                                    )?.name
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => handleCopy(amal)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            copiedId === amal.id
                                                ? "bg-green-500 scale-110"
                                                : "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-[#bc31d1]/10 hover:to-[#d65de6]/10"
                                        }`}
                                    >
                                        {copiedId === amal.id ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-[#bc31d1]" />
                                        )}
                                    </button>
                                </div>

                                {/* Arabic Text */}
                                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl p-5 mb-4 border border-purple-100/30">
                                    <p className="text-2xl text-right leading-loose text-[#bc31d1] font-arabic mb-3">
                                        {amal.arabic}
                                    </p>
                                    <p className="text-sm text-gray-600 italic text-center border-t border-purple-100 pt-3">
                                        {amal.transliteration}
                                    </p>
                                </div>

                                {/* Bengali Translation */}
                                <div className="bg-white rounded-2xl p-4 border-l-4 border-[#bc31d1]">
                                    <p className="text-gray-700 leading-relaxed">
                                        {amal.bengali}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            কোন ফলাফল পাওয়া যায়নি
                        </h3>
                        <p className="text-gray-600">
                            অনুগ্রহ করে অন্য কীওয়ার্ড দিয়ে খুঁজে দেখুন
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-8 bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 rounded-3xl p-6 border border-[#bc31d1]/20">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                            আমলের ফজিলত
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            নিয়মিত দোয়া ও যিকির আমাদের আল্লাহর নিকটবর্তী করে
                            এবং জীবনে বরকত নিয়ে আসে। প্রতিদিন সকাল-সন্ধ্যায় এই
                            দোয়াগুলো পড়ার চেষ্টা করুন।
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Amal;
