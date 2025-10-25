import React, { useState } from "react";
import {
    Bell,
    Clock,
    AlertCircle,
    Trash2,
    CheckCheck,
    X,
    Calendar,
    Sunrise,
    Moon,
    BookOpen,
    Star,
    Volume2,
} from "lucide-react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "prayer",
            icon: Clock,
            iconBg: "from-blue-400 to-indigo-500",
            title: "ফজরের নামাজ",
            message: "ফজরের নামাজের সময় হয়েছে। এখনই নামাজ আদায় করুন।",
            time: "৫ মিনিট আগে",
            timestamp: new Date(Date.now() - 5 * 60000),
            isRead: false,
        },
        {
            id: 2,
            type: "reminder",
            icon: Bell,
            iconBg: "from-orange-400 to-amber-500",
            title: "যোহরের রিমাইন্ডার",
            message: "যোহরের নামাজ শুরু হবে ১৫ মিনিট পরে। প্রস্তুতি নিন।",
            time: "১০ মিনিট আগে",
            timestamp: new Date(Date.now() - 10 * 60000),
            isRead: false,
        },
        {
            id: 3,
            type: "event",
            icon: Star,
            iconBg: "from-purple-400 to-pink-500",
            title: "জুমার নামাজ",
            message: "আগামীকাল জুমার নামাজ। মসজিদে যাওয়ার প্রস্তুতি নিন।",
            time: "১ ঘন্টা আগে",
            timestamp: new Date(Date.now() - 60 * 60000),
            isRead: true,
        },
        {
            id: 4,
            type: "adhan",
            icon: Volume2,
            iconBg: "from-green-400 to-emerald-500",
            title: "আসরের আজান",
            message: "আসরের আজান হয়েছে। নামাজের জন্য প্রস্তুত হন।",
            time: "২ ঘন্টা আগে",
            timestamp: new Date(Date.now() - 2 * 60 * 60000),
            isRead: true,
        },
        {
            id: 5,
            type: "dua",
            icon: BookOpen,
            iconBg: "from-teal-400 to-cyan-500",
            title: "দৈনিক দোয়া",
            message: "আজকের দোয়া: সকাল-সন্ধ্যার যিকির পড়তে ভুলবেন না।",
            time: "৩ ঘন্টা আগে",
            timestamp: new Date(Date.now() - 3 * 60 * 60000),
            isRead: true,
        },
        {
            id: 6,
            type: "warning",
            icon: AlertCircle,
            iconBg: "from-red-400 to-rose-500",
            title: "গুরুত্বপূর্ণ বার্তা",
            message:
                "মাগরিবের নামাজ মিস করবেন না। সূর্যাস্তের সাথে সাথে পড়ুন।",
            time: "৫ ঘন্টা আগে",
            timestamp: new Date(Date.now() - 5 * 60 * 60000),
            isRead: false,
        },
        {
            id: 7,
            type: "event",
            icon: Calendar,
            iconBg: "from-violet-400 to-purple-500",
            title: "বিশেষ দিন",
            message: "আগামীকাল ১৫ শাবান। বিশেষ ইবাদতের রাত।",
            time: "গতকাল",
            timestamp: new Date(Date.now() - 24 * 60 * 60000),
            isRead: true,
        },
    ]);

    const [showConfirm, setShowConfirm] = useState(false);

    // Mark notification as read
    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    // Delete single notification
    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        setShowConfirm(false);
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
        );
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 pb-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <Bell className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    বিজ্ঞপ্তি
                                </h1>
                                <p className="text-white/90 text-sm">
                                    {unreadCount > 0
                                        ? `${unreadCount} টি নতুন বিজ্ঞপ্তি`
                                        : "সব পড়া হয়েছে"}
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {unreadCount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="flex-1 bg-white text-[#bc31d1] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-all duration-300 border border-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCheck className="w-5 h-5" />
                        <span>সব পড়া হয়েছে</span>
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>ক্লিয়ার করুন</span>
                    </button>
                </div>
            )}

            {/* Notifications List */}
            {notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border ${
                                    notification.isRead
                                        ? "border-gray-100 opacity-75"
                                        : "border-[#bc31d1]/30 ring-1 ring-[#bc31d1]/20"
                                }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${notification.iconBg}`}
                                    >
                                        <Icon
                                            className="w-7 h-7 text-white"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3
                                                className={`text-lg font-bold ${
                                                    notification.isRead
                                                        ? "text-gray-600"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-[#bc31d1] rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>

                                        <p
                                            className={`text-sm mb-3 leading-relaxed ${
                                                notification.isRead
                                                    ? "text-gray-500"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {notification.message}
                                        </p>

                                        {/* Time & Actions */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{notification.time}</span>
                                            </div>

                                            <div className="flex gap-2">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="px-3 py-1.5 bg-gradient-to-r from-[#bc31d1]/10 to-[#d65de6]/10 text-[#bc31d1] rounded-lg text-xs font-medium hover:from-[#bc31d1]/20 hover:to-[#d65de6]/20 transition-all duration-300 flex items-center gap-1"
                                                    >
                                                        <CheckCheck className="w-3.5 h-3.5" />
                                                        <span>পড়া হয়েছে</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        deleteNotification(
                                                            notification.id
                                                        )
                                                    }
                                                    className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Empty State
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        কোন বিজ্ঞপ্তি নেই
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                        আপনার কাছে এই মুহূর্তে কোন নতুন বিজ্ঞপ্তি নেই। নতুন
                        বিজ্ঞপ্তি এলে এখানে দেখা যাবে।
                    </p>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl transform transition-all">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                            নিশ্চিত করুন
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            আপনি কি সমস্ত বিজ্ঞপ্তি মুছে ফেলতে চান? এই কাজটি
                            পূর্বাবস্থায় ফেরানো যাবে না।
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                            >
                                বাতিল
                            </button>
                            <button
                                onClick={clearAllNotifications}
                                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                মুছে ফেলুন
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Card */}
            <div className="mt-8 bg-gradient-to-br from-[#bc31d1]/10 to-[#d65de6]/10 rounded-3xl p-6 border border-[#bc31d1]/20">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#bc31d1] to-[#d65de6] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">
                            বিজ্ঞপ্তি সম্পর্কে
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            নামাজের সময়, আজান, এবং গুরুত্বপূর্ণ ইসলামী ইভেন্ট
                            সম্পর্কে সময়মতো বিজ্ঞপ্তি পান। সেটিংস থেকে আপনি
                            বিজ্ঞপ্তি কাস্টমাইজ করতে পারবেন।
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
