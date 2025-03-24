import { useRef, useState, useEffect, forwardRef } from "react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    X,
    Video as VideoIcon
} from "lucide-react";
import "./data/main.css";
import { motion, AnimatePresence } from "framer-motion";
import { FixedSizeList as List } from 'react-window';
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// القيم الافتراضية
const DefaultAttributes = {
    QLStyle: false,
};
// أنواع الإدخال المتاحة
const InputModes = [
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
];

const View = forwardRef(({ QLStyle = DefaultAttributes.QLStyle, children }) => {
    return (
        <div data-qlstyle={QLStyle} QLStyleClass={QLStyle ? "View" : ""}>
            {children}
        </div>
    );
});


const TextInput = forwardRef(({
    QLStyle = DefaultAttributes.QLStyle,
    Mode = "text",
    ...props
}) => {
    return (
        <input
            type={InputModes.includes(Mode) ? Mode : "text"}
            data-qlstyle={QLStyle}
            QLStyleClass={QLStyle ? "Input" : ""}
            {...props}
        />
    );
});

const Button = forwardRef(({
    QLStyle = DefaultAttributes.QLStyle,
    Mode = "button",
    onPress,
    children,
    ...props
}) => {
    return (
        <button
            type={InputModes.includes(Mode) ? Mode : "text"}
            data-qlstyle={QLStyle}
            QLStyleClass={QLStyle ? "Button" : ""}
            onClick={onPress}
            {...props}
        >
            {children}
        </button>
    );
});

const Link = forwardRef(({
    QLStyle = DefaultAttributes.QLStyle,
    event = "new_tab", // القيم الممكنة: "new_tab", "parent", "self", "top"
    to = "javascript:void(0);",
    children,
    ...props
}) => {
    let targetValue = "_self"; // القيمة الافتراضية
    switch (event) {
        case "new_tab":
            targetValue = "_blank";
            break;
        case "parent":
            targetValue = "_parent";
            break;
        case "self":
            targetValue = "_self";
            break;
        case "top":
            targetValue = "_top";
            break;
        default:
            targetValue = "_self";
    }

    return (
        <a
            href={to}
            target={targetValue}
            data-qlstyle={QLStyle}
            QLStyleClass={QLStyle ? "Link" : ""}
            {...props}
        >
            {children}
        </a>
    );
});

const Text = forwardRef(({ children, style, ...props }) => {
    return <span style={{
        fontSize: 16,
        color: "#000", ...style
    }} {...props}>{children}</span>;
});

const Image = forwardRef(({ source, style, ...props }) => {
    return <img src={source} style={{ ...style }} {...props} />;
});

const ScrollView = forwardRef(({ children, style, ...props }) => (
    <div style={{ overflow: "auto", maxHeight: "300px", ...style }} {...props}>
        {children}
    </div>
));

const FlatList = forwardRef(({ items }) => {
    return (
        <List height={400} itemCount={items.length} itemSize={50} width="100%">
            {({ index, style }) => (
                <div
                    style={{
                        ...style,
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    }}
                >
                    {items[index].name}
                </div>
            )}
        </List>
    );
});

const SafeAreaView = forwardRef(({ data }) => (
    <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {data}
    </div>
));

const Switch = forwardRef(({ Theme = "light", Textable, className = "", ...props }) => {
    // تحديد الألوان بناءً على الـ Theme
    const themeClasses = {
        light: {
            bg: "bg-gray-200 dark:bg-gray-700",
            ring: "peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800",
            checkedBg: "peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600",
            text: "text-gray-900 dark:text-gray-300",
        },
        dark: {
            bg: "bg-gray-700",
            ring: "peer-focus:ring-gray-500",
            checkedBg: "peer-checked:bg-gray-500",
            text: "text-gray-200",
        },
    };

    const selectedTheme = themeClasses[Theme] || themeClasses.light;

    return (
        <label className={`inline-flex items-center cursor-pointer ${className}`}>
            <input type="checkbox" className="sr-only peer" {...props} />
            <div
                className={`relative w-11 h-6 ${selectedTheme.bg} peer-focus:outline-none ${selectedTheme.ring} rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                dark:border-gray-600 ${selectedTheme.checkedBg}`}
            ></div>
            {Textable && (
                <span className={`ms-3 text-sm font-medium ${selectedTheme.text}`}>
                    {Textable}
                </span>
            )}
        </label>
    );
});

const Slider = forwardRef(({ min = 0, max = 100, step = 1, defaultValue = 50 }) => {
    const [value, setValue] = useState(defaultValue);

    return (
        <div className="flex flex-col items-center w-full max-w-md">
            {/* القيمة المعروضة */}
            <span className="text-lg font-semibold text-gray-700 mb-2">
                {value}
            </span>

            {/* السلايدر */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer 
            accent-blue-500 hover:accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* مقياس القيم */}
            <div className="flex justify-between w-full text-sm text-gray-500 mt-2">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
});

const Modal = forwardRef(({ isOpen, onClose, children, theme = "light", ...props }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    // تحديد فئات الـ Modal بناءً على الثيم
    const baseModalClass =
        "relative mx-4 max-w-sm w-full rounded-3xl shadow-xl border backdrop-blur-md";
    const modalThemeClass =
        theme === "dark" ? "bg-black/80 border-gray-700" : "bg-white border-gray-200";
    const modalClass = `${baseModalClass} ${modalThemeClass}`;

    // زر الإغلاق
    const closeBtnClass =
        theme === "dark"
            ? "text-gray-300 hover:text-gray-100 transition"
            : "text-gray-600 hover:text-gray-800 transition";

    // محتوى النص
    const contentTextClass = theme === "dark" ? "text-white" : "text-black-900";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    {...props}
                >
                    {/* خلفية معتمة مع تأثير Blur */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    {/* صندوق المودال */}
                    <motion.div
                        className={modalClass}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* زر الإغلاق */}
                        <button
                            onClick={onClose}
                            className={`absolute top-4 right-4 ${closeBtnClass}`}
                        >
                            ✕
                        </button>
                        {/* المحتوى */}
                        <div className={`p-6 text-center ${contentTextClass}`}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

const ActivityIndicator = forwardRef(({
    size = "4rem", // الحجم الافتراضي (يمكن تخصيصه بأي قيمة CSS مثل "64px" أو "4rem")
    theme = "light", // "light" أو "dark"
    spinnerColor, // لون الجزء الدوار (border-top)
    borderColor,  // لون الإطار العام
    className = "",
}) => {
    // تحديد الألوان الافتراضية بناءً على الثيم
    const defaultSpinnerColor =
        theme === "dark" ? "border-t-blue-300" : "border-t-blue-500";
    const defaultBorderColor =
        theme === "dark" ? "border-gray-700" : "border-gray-300";

    return (
        <div
            className={`rounded-full border-8 animate-spin ${borderColor || defaultBorderColor} ${spinnerColor || defaultSpinnerColor
                } ${className}`}
            style={{ width: size, height: size }}
        ></div>
    );
});

const ProgressBar = forwardRef(({
    value = 0,         // القيمة الحالية للتقدم
    max = 100,         // القيمة القصوى
    theme = "light",   // الثيم: "light" أو "dark"
    className = "",    // فئات إضافية للتخصيص
    children,
}) => {
    // حساب النسبة المئوية للتقدم
    const progressPercent = Math.min((value / max) * 100, 100);

    // تحديد ألوان الخلفية بناءً على الثيم
    const trackColor = theme === "dark" ? "bg-gray-800" : "bg-gray-300";
    const fillColor = theme === "dark" ? "bg-blue-400" : "bg-blue-600";

    return (
        <div className={`w-full h-4 rounded-full overflow-hidden ${trackColor} ${className}`}>
            <div
                className={`h-full rounded-full ${fillColor} transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
            >{children}</div>
        </div>
    );
});

// {[{ value: "T1", label: "T1" }, { value: "T2", label: "T2" }]}
const Picker = forwardRef(({
    options = [],       // مصفوفة من الخيارات [{ value, label }]
    value,              // القيمة المُختارة حاليًا
    onChange,           // دالة التعامل مع تغيير القيمة
    className = "",     // فئات Tailwind إضافية لتخصيص المكون
    QLStyle = "default",// خيار أو نمط إذا كنت تستخدم أنماط QL
    ...props
}) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`appearance-none border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            data-qlstyle={QLStyle}
            {...props}
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});

const RadioButton = forwardRef(({
    theme = "light",
    name,
    value,
    checked,
    onChange,
    label,
    className = "",
    ...props
}) => {
    // تحديد فئات Tailwind بناءً على الثيم
    const baseInputClass = "form-radio h-5 w-5 focus:ring-2 focus:ring-offset-2";
    const inputThemeClass =
        theme === "dark"
            ? "text-blue-400 focus:ring-blue-600"
            : "text-blue-600 focus:ring-blue-300";
    const baseLabelClass = "inline-flex items-center cursor-pointer";
    const labelTextClass =
        theme === "dark" ? "ml-2 text-sm font-medium text-gray-200" : "ml-2 text-sm font-medium text-gray-800";

    return (
        <label className={`${baseLabelClass} ${className}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className={`${baseInputClass} ${inputThemeClass}`}
                {...props}
            />
            {label && <span className={labelTextClass}>{label}</span>}
        </label>
    );
});

const Video = forwardRef(({
    QLStyle = "",
    src,
    type = "video/mp4",
    qualityOptions = {
        "1080": src.replace("480", "1080"),
        "720": src, // الافتراضي
        "480": src.replace("720", "480")
    },
    subtitles, // URL لملف الترجمة (VTT)
    ...props
}) => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [duration, setDuration] = useState("00:00");
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [progressTooltip, setProgressTooltip] = useState("00:00");
    const [currentQuality, setCurrentQuality] = useState("720");
    const [error, setError] = useState(false);

    // Bookmarking: استعادة آخر وقت تشغيل محفوظ (مثال بسيط)
    useEffect(() => {
        const savedTime = localStorage.getItem("video-bookmark");
        if (savedTime && videoRef.current) {
            videoRef.current.currentTime = parseFloat(savedTime);
        }
    }, []);

    // حفظ موقع التشغيل عند التوقف
    useEffect(() => {
        const saveBookmark = () => {
            if (videoRef.current) {
                localStorage.setItem("video-bookmark", videoRef.current.currentTime);
            }
        };
        window.addEventListener("beforeunload", saveBookmark);
        return () => window.removeEventListener("beforeunload", saveBookmark);
    }, []);

    // تحديث حالة fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            setFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // إخفاء/إظهار عناصر التحكم تلقائيًا عند حركة الماوس
    useEffect(() => {
        let timeout;
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeout);
            // إذا كان الفيديو قيد التشغيل، أخفي عناصر التحكم بعد 3 ثوانٍ
            if (isPlaying) {
                timeout = setTimeout(() => {
                    setShowControls(false);
                }, 3000);
            }
        };
        const container = containerRef.current;
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [isPlaying]);

    // دعم اختصارات لوحة المفاتيح
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "ArrowRight":
                    videoRef.current.currentTime += 5;
                    break;
                case "ArrowLeft":
                    videoRef.current.currentTime -= 5;
                    break;
                case "ArrowUp":
                    changeVolume({ target: { value: Math.min(volume + 0.1, 1) } });
                    break;
                case "ArrowDown":
                    changeVolume({ target: { value: Math.max(volume - 0.1, 0) } });
                    break;
                default:
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [volume]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play().catch(() => { }); // تجاهل الأخطاء البسيطة
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setVolume(videoRef.current.muted ? 0 : videoRef.current.volume);
    };

    const changeVolume = (e) => {
        const newVol = parseFloat(e.target.value);
        videoRef.current.volume = newVol;
        setVolume(newVol);
    };

    const updateProgress = () => {
        if (!videoRef.current.duration) return;
        const current = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        setProgress((current / dur) * 100);
        setCurrentTime(formatTime(current));
        setDuration(formatTime(dur));
    };

    const setVideoProgress = (e) => {
        const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
    };

    // تحديث tooltip لشريط التقدم
    const handleProgressHover = (e) => {
        const rect = e.target.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = videoRef.current.duration * percent;
        setProgressTooltip(formatTime(time));
    };

    // دخول/خروج وضع fullscreen باستخدام الحاوية
    const toggleFullscreen = () => {
        if (!fullscreen) {
            containerRef.current.requestFullscreen().catch((err) => console.error(err));
        } else {
            document.exitFullscreen().catch((err) => console.error(err));
        }
    };

    // دعم Picture-in-Picture
    const togglePIP = async () => {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else if (videoRef.current) {
                await videoRef.current.requestPictureInPicture();
            }
        } catch (error) {
            console.error("Picture-in-Picture Error:", error);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    const changeSpeed = (e) => {
        const newSpeed = parseFloat(e.target.value);
        videoRef.current.playbackRate = newSpeed;
        setPlaybackRate(newSpeed);
    };

    // تغيير جودة الفيديو (يعمل بتغيير src)
    const handleQualityChange = (e) => {
        const selectedQuality = e.target.value;
        setCurrentQuality(selectedQuality);
        if (qualityOptions[selectedQuality]) {
            videoRef.current.src = qualityOptions[selectedQuality];
            videoRef.current.load();
            if (isPlaying) videoRef.current.play();
        }
    };

    // نمط المودال الخاص بالإعدادات (يختلف بناءً على fullscreen)
    const modalStyle = fullscreen
        ? "fixed bottom-20 right-4 bg-gray-900 text-white rounded-lg p-4 shadow-lg z-50"
        : "absolute bottom-10 right-0 bg-gray-900 text-white rounded-lg p-4 shadow-lg z-50";

    // معالجة أخطاء تحميل الفيديو
    const handleError = () => {
        setError(true);
    };

    return (
        <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto ${QLStyle}`}>
            <video
                ref={videoRef}
                src={src}
                className="w-full rounded-lg"
                onTimeUpdate={updateProgress}
                onLoadedMetadata={updateProgress}
                onError={handleError}
                {...props}
            >
                {subtitles && <track kind="subtitles" label="Subtitles" srcLang="en" src={subtitles} default />}
            </video>

            {/* إذا حدث خطأ في تحميل الفيديو، عرض overlay خطأ */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-lg">
                    حدث خطأ في تحميل الفيديو.
                </div>
            )}

            {/* عناصر التحكم الأساسية */}
            {showControls && (
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 px-4 py-2 flex flex-col transition-opacity duration-300">
                    <div className="relative">
                        <input
                            type="range"
                            value={progress}
                            onChange={setVideoProgress}
                            onMouseMove={handleProgressHover}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-2"
                        />
                        <div
                            className="absolute top-[-24px] left-0 text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded whitespace-nowrap"
                            style={{ transform: `translateX(${progress}%)` }}
                        >
                            {progressTooltip}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={togglePlay} className="text-white">
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            <span className="text-white text-sm">
                                {currentTime} / {duration}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 relative">
                            <button onClick={() => setShowSettings(!showSettings)} className="text-white">
                                <Settings size={24} />
                            </button>
                            <button onClick={toggleMute} className="text-white">
                                {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={changeVolume}
                                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <button onClick={togglePIP} className="text-white" title="Picture-in-Picture">
                                <VideoIcon size={24} />
                            </button>
                            <button onClick={toggleFullscreen} className="text-white">
                                {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                            </button>

                            {showSettings && (
                                <div id="pxka042551maxx" className={modalStyle}>
                                    <div className="flex justify-end">
                                        <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-sm mb-1">سرعة التشغيل:</label>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2.0"
                                            step="0.1"
                                            value={playbackRate}
                                            onChange={changeSpeed}
                                            className="w-full cursor-pointer"
                                        />
                                        <div className="text-sm mt-1">{playbackRate.toFixed(1)}x</div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm mb-1">جودة الفيديو:</label>
                                        <select
                                            className="w-full p-1 rounded bg-gray-800 text-white"
                                            value={currentQuality}
                                            onChange={handleQualityChange}
                                        >
                                            {Object.keys(qualityOptions).map((quality) => (
                                                <option key={quality} value={quality}>
                                                    {quality}p
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

const Row = forwardRef(({ children, style }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                ...style,
            }}
        >
            {children}
        </div>
    );
});

const Column = forwardRef(({ children, style }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                ...style,
            }}
        >
            {children}
        </div>
    );
});

const Draggable = forwardRef(({ style }) => {
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

    const bind = useDrag(({ offset: [ox, oy] }) => {
        api.start({ x: ox, y: oy });
    });

    return (
        <animated.div
            {...bind()}
            style={{
                width: 100,
                height: 100,
                ...style,
                position: "absolute",
                x,
                y, // استخدم `x` و `y` هنا مباشرة بدلاً من `transform`
            }}
        />
    );
});

const ItemType = "ITEM";

const DraggableItem = forwardRef(({ item, index, moveItem }) => {
    const [, ref] = useDrag({
        type: ItemType,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} style={{ padding: 10, border: "1px solid #ddd", marginBottom: 5, background: "#f9f9f9" }}>
            {item.name}
        </div>
    );
});

const DraggableFlatList = forwardRef(({ items }) => {
    const [list, setList] = useState(items);

    const moveItem = (from, to) => {
        const updatedList = [...list];
        const [movedItem] = updatedList.splice(from, 1);
        updatedList.splice(to, 0, movedItem);
        setList(updatedList);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            {list.map((item, index) => (
                <DraggableItem key={item.id} item={item} index={index} moveItem={moveItem} />
            ))}
        </DndProvider>
    );
});

const Tabs = forwardRef(({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            {/* شريط التابز */}
            <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        style={{
                            flex: 1,
                            padding: 10,
                            border: "none",
                            background: activeTab === index ? "#007bff" : "#f9f9f9",
                            color: activeTab === index ? "white" : "black",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* المحتوى المتغير */}
            <div style={{ padding: 20 }}>{tabs[activeTab].content}</div>
        </div>
    );
});

const Toast = forwardRef(({ message, onClose }) => {
    return (
        <div style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#333",
            color: "white",
            padding: "10px 20px",
            borderRadius: 5
        }}>
            {message}
            <button onClick={onClose} style={{ marginLeft: 10, background: "red", color: "white", border: "none", padding: "5px 10px" }}>X</button>
        </div>
    );
});

// كائن المكونات
const Components = {
    View: View,
    TextInput: TextInput,
    Button: Button,
    Link: Link,
    Video: Video,
    Text: Text,
    Image: Image,
    ScrollView: ScrollView,
    SafeAreaView: SafeAreaView,
    Slider: Slider,
    Switch: Switch,
    Modal: Modal,
    ActivityIndicator: ActivityIndicator,
    ProgressBar: ProgressBar,
    Picker: Picker,
    RadioButton: RadioButton,
    FlatList: FlatList,
    Row: Row,
    Column: Column,
    Draggable: Draggable,
    DraggableFlatList: DraggableFlatList,
    Tabs: Tabs,
    Toast: Toast,
};

// qDJs.js

class qDJsClass {
    constructor(selector) {
        if (typeof selector === "string") {
            this.elements = document.querySelectorAll(selector);
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
            this.elements = selector;
        } else {
            this.elements = [selector];
        }
        this.perfData = {
            layoutShifts: 0,
            longTasks: 0,
            elementsOptimized: 0,
            startTime: performance.now(),
        };
    }

    each(callback) {
        this.elements.forEach((el, index) => callback(el, index));
        return this;
    }

    css(property, value) {
        return this.each((el) => (el.style[property] = value));
    }

    openExternal(lvl) {
        return this.each((el) => {
            el.onclick = () => {
                window.location.href = lvl;
            };
        });
    }

    on(event, callback) {
        this.each((el) => el.addEventListener(event, callback));
        return this;
    }
    off(event, callback) {
        this.each((el) => el.removeEventListener(event, callback));
        return this;
    }

    ajax({ url, method = "GET", data = null, headers = {} }) {
        return fetch(url, {
            method,
            headers: { "Content-Type": "application/json", ...headers },
            body: data ? JSON.stringify(data) : null,
        }).then((res) => res.json());
    }

    addClass(className) {
        return this.each((el) => el.classList.add(className));
    }
    removeClass(className) {
        return this.each((el) => el.classList.remove(className));
    }
    toggleClass(className) {
        return this.each((el) => el.classList.toggle(className));
    }

    fadeIn(duration = 300) {
        return this.each((el) => {
            el.style.opacity = 0;
            el.style.display = "block";
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                let progress = (timestamp - start) / duration;
                el.style.opacity = Math.min(progress, 1);
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    fadeOut(duration = 300) {
        return this.each((el) => {
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                let progress = (timestamp - start) / duration;
                el.style.opacity = Math.max(1 - progress, 0);
                if (progress < 1) requestAnimationFrame(step);
                else el.style.display = "none";
            }
            requestAnimationFrame(step);
        });
    }

    find(subSelector) {
        let found = [];
        this.each((el) => found.push(...el.querySelectorAll(subSelector)));
        return new qDJsClass(found);
    }

    ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    append(content) {
        return this.each((el) => el.insertAdjacentHTML("beforeend", content));
    }

    prepend(content) {
        return this.each((el) => el.insertAdjacentHTML("afterbegin", content));
    }

    html(content) {
        return content === undefined
            ? this.elements[0]?.innerHTML
            : this.each((el) => (el.innerHTML = content));
    }

    text(content) {
        return content === undefined
            ? this.elements[0]?.textContent
            : this.each((el) => (el.textContent = content));
    }

    remove() {
        return this.each((el) => el.remove());
    }

    data(key, value) {
        if (value === undefined) {
            return this.elements[0]?.dataset[key];
        }
        return this.each((el) => (el.dataset[key] = value));
    }

    animate(styles, duration = 400) {
        return this.each((el) => {
            Object.keys(styles).forEach((prop) => {
                let start = parseFloat(getComputedStyle(el)[prop]) || 0;
                let end = parseFloat(styles[prop]);
                let unit = styles[prop].replace(/[0-9.]/g, "");
                let startTime = performance.now();

                function step(timestamp) {
                    let progress = Math.min((timestamp - startTime) / duration, 1);
                    el.style[prop] = start + (end - start) * progress + unit;
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        });
    }

    show() {
        return this.each((el) => (el.style.display = ""));
    }

    hide() {
        return this.each((el) => (el.style.display = "none"));
    }

    toggle() {
        return this.each((el) => {
            el.style.display = el.style.display === "none" ? "" : "none";
        });
    }

    width(value) {
        return value === undefined
            ? this.elements[0]?.offsetWidth
            : this.each((el) => (el.style.width = `${value}px`));
    }

    height(value) {
        return value === undefined
            ? this.elements[0]?.offsetHeight
            : this.each((el) => (el.style.height = `${value}px`));
    }

    offset() {
        let rect = this.elements[0]?.getBoundingClientRect();
        return rect
            ? { top: rect.top + window.scrollY, left: rect.left + window.scrollX }
            : null;
    }

    position() {
        let el = this.elements[0];
        return el ? { top: el.offsetTop, left: el.offsetLeft } : null;
    }

    create(tag, attributes = {}) {
        let el = document.createElement(tag);
        Object.keys(attributes).forEach((attr) =>
            el.setAttribute(attr, attributes[attr])
        );
        return new qDJsClass(el);
    }

    storage(type = "local") {
        return {
            set(key, value) {
                window[`${type}Storage`].setItem(key, JSON.stringify(value));
            },
            get(key) {
                return JSON.parse(window[`${type}Storage`].getItem(key));
            },
            remove(key) {
                window[`${type}Storage`].removeItem(key);
            },
            clear() {
                window[`${type}Storage`].clear();
            },
        };
    }

    draggable() {
        return this.each((el) => {
            el.style.position = "absolute";
            el.onmousedown = function (e) {
                let shiftX = e.clientX - el.getBoundingClientRect().left;
                let shiftY = e.clientY - el.getBoundingClientRect().top;

                function moveAt(x, y) {
                    el.style.left = x - shiftX + "px";
                    el.style.top = y - shiftY + "px";
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener("mousemove", onMouseMove);
                el.onmouseup = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    el.onmouseup = null;
                };
            };
        });
    }

    eventBus = {};

    emit(event, data) {
        if (this.eventBus[event]) {
            this.eventBus[event].forEach((callback) => callback(data));
        }
    }

    onEvent(event, callback) {
        if (!this.eventBus[event]) this.eventBus[event] = [];
        this.eventBus[event].push(callback);
    }

    cache = {};

    setCache(key, value) {
        this.cache[key] = value;
    }

    getCache(key) {
        return this.cache[key];
    }

    clearCache() {
        this.cache = {};
    }

    lazyLoad() {
        return this.each((el) => {
            if (el.tagName === "IMG" && el.dataset.src) {
                let observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            el.src = el.dataset.src;
                            observer.unobserve(el);
                        }
                    });
                });
                observer.observe(el);
            }
        });
    }

    connectWebSocket(url, callback) {
        let socket = new WebSocket(url);
        socket.onmessage = (event) => callback(JSON.parse(event.data));
        return socket;
    }

    trackSession(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    getSession(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    /*
        test
        */
    xNavigator = {
        CopyClipboard: async (mode, text) => {
            try {
                if (mode === "CopyText") {
                    await navigator.clipboard.writeText(text);
                    return true;
                } else if (mode === "ViewClipboard") {
                    let clipboardText = await navigator.clipboard.readText();
                    return clipboardText;
                } else {
                    throw new Error("وضع غير معروف:", mode);
                }
            } catch (err) {
                console.error("خطأ:", err);
                return null;
            }
        },
    };
    shortenNumber(number) {
        const units = [
            "",
            "K",
            "M",
            "B",
            "T",
            "Qa",
            "Qi",
            "Sx",
            "Sp",
            "Oc",
            "No",
            "Dc",
            "UDc",
            "DDc",
            "TDc",
            "QaDc",
            "QiDc",
            "SxDc",
            "SpDc",
            "OcDc",
            "NoDc",
            "Vg",
            "UVg",
            "DVg",
            "TVg",
            "QaVg",
            "QiVg",
            "SxVg",
            "SpVg",
            "OcVg",
            "NoVg",
            "Tg",
            "UTg",
            "DTg",
            "TTg",
            "QaTg",
            "QiTg",
            "SxTg",
            "SpTg",
            "OcTg",
            "NoTg",
            "Qd",
            "UQd",
            "DQd",
            "TQd",
            "QaQd",
            "QiQd",
            "SxQd",
            "SpQd",
            "OcQd",
            "NoQd",
            "Qn",
            "UQn",
            "DQn",
            "TQn",
            "QaQn",
            "QiQn",
            "SxQn",
            "SpQn",
            "OcQn",
            "NoQn",
            "Se",
            "USe",
            "DSe",
            "TSe",
            "QaSe",
            "QiSe",
            "SxSe",
            "SpSe",
            "OcSe",
            "NoSe",
            "O",
            "UO",
            "DO",
            "TO",
            "QaO",
            "QiO",
            "SxO",
            "SpO",
            "OcO",
            "NoO",
            "N",
            "UN",
            "DN",
            "TN",
            "QaN",
            "QiN",
            "SxN",
            "SpN",
            "OcN",
            "NoN",
            "Ce",
        ]; // 1e299 = Centillion (Ce)

        let tier = Math.floor(Math.log10(number) / 3); // تحديد المستوى بناءً على اللوغاريتم العشري
        if (tier >= units.length) tier = units.length - 1; // تجنب تجاوز الحد الأقصى

        const scaledNumber = number / Math.pow(10, tier * 3);

        return `${scaledNumber.toFixed(3).replace(/\.?0+$/, "")}${units[tier]}`;
    }

    textTo = {
        JSON: (data, replace = null, space = 2) => {
            return JSON.stringify(data, replace, space);
        },
        Slug: (value) => {
            String(value).replaceAll(/[!$%^&*()_@#]/g, "");
            return String(value).toLowerCase().replace(" ", "-");
        },
        URL: (value) => {
            return encodeURIComponent(value);
        },
        Base64: (input) => {
            const encode = () => btoa(input);
            const decode = () => atob(input);
            return {
                encode,
                decode,
            };
        },
    };

    random = {
        number: (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        string: (length) => {
            let result = "";
            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
                counter += 1;
            }
            return result;
        },
        uuid: () => {
            const bytes = crypto.getRandomValues(new Uint8Array(16));

            // تعديل بعض البتات لضمان التوافق مع UUID v4
            bytes[6] = (bytes[6] & 0x0f) | 0x40; // تعيين الإصدار إلى 4
            bytes[8] = (bytes[8] & 0x3f) | 0x80; // تعيين الـ variant إلى 10x

            return [...bytes]
                .map(
                    (b, i) =>
                        (i === 4 || i === 6 || i === 8 || i === 10 ? "-" : "") +
                        b.toString(16).padStart(2, "0")
                )
                .join("");
        },
    };

    Date = {
        // تحويل التاريخ إلى Unix Timestamp
        toUnix: (date = new Date()) => {
            return Math.floor(new Date(date).getTime() / 1000);
        },

        // تحويل التاريخ إلى ISO 8601
        toISO: (date = new Date()) => {
            return new Date(date).toISOString();
        },

        // حساب الفرق بين تاريخين (يتم إرجاع الفرق بالأيام والساعات والدقائق والثواني)
        difference: (date1, date2) => {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            const diffMs = Math.abs(d1 - d2); // الفرق بالمللي ثانية

            return {
                millennia: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25 * 1000)), // الألفيات
                centuries: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25 * 100)), // القرون
                decades: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25 * 10)), // العقود
                years: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25)), // السنين
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)) % 365, // الأيام المتبقية بعد السنين
                hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diffMs / (1000 * 60)) % 60),
                seconds: Math.floor((diffMs / 1000) % 60),
            };
        },
    };

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
    mergeObjects(obj1, obj2, strategy = "override") {
        if (strategy === "override") return { ...obj1, ...obj2 };
        if (strategy === "merge") return Object.assign({}, obj1, obj2);
    }
    getType(value) {
        return Object.prototype.toString.call(value).slice(8, -1)
    }

    formatCurrency(num, locale = window.navigator.language, currency = "USD") {
        if (currency !== "SDG") {
            return new Intl.NumberFormat(locale, { style: "currency", currency }).format(num);
        } else {
            return NaN + 0;
        }
    }

    WebOptimizer = {
        perfData: {
            layoutShifts: 0,
            longTasks: 0,
            elementsOptimized: 0,
            startTime: performance.now(),
        },

        start() {
            // console.log("🚀 WebOptimizer started at:", this.perfData.startTime);

            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === "layout-shift" && entry.value > 0.1) {
                        this.perfData.layoutShifts++;
                    }
                    if (entry.entryType === "longtask") {
                        this.perfData.longTasks++;
                    }
                });
            });

            observer.observe({ type: ["layout-shift", "longtask"], buffered: true });

            document.querySelectorAll("img").forEach((img) => {
                if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
                img.style.willChange = "opacity, transform";
                this.perfData.elementsOptimized++;
            });

            document.documentElement.style.textRendering = "optimizeLegibility";
            document.documentElement.style.fontSmoothing = "antialiased";

            document.querySelectorAll("*").forEach((el) => {
                let style = getComputedStyle(el);
                if (style.boxShadow !== "none" || style.filter !== "none") {
                    el.style.willChange = "opacity, transform";
                    el.style.backfaceVisibility = "hidden";
                    this.perfData.elementsOptimized++;
                }
            });

            setTimeout(() => {
                // console.log("📊 AI Performance Analysis:", this.perfData);
            }, 3000);

            return this;
        },

        getStats() {
            return {
                executionTime: (performance.now() - this.perfData.startTime).toFixed(2) + "ms",
                ...this.perfData,
            };
        },
    };


}


// Config
window.QuickLazer = window.QuickLazer || {
    version: "1.0.0",
    description: "A modern library for ReactJS & Vanilla JS by Quickdigi ° QuickLazer"
};

const QdJs = (selector) => new qDJsClass(selector);

export { Components, QdJs };