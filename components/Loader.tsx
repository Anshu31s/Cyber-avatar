"use client";
import { useEffect, useRef, useState } from "react";

type Message = {
    text: string;
    delay: number;
};

export default function Loader({ onFinish }: { onFinish?: () => void }) {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [lines, setLines] = useState<string[]>([
        "Initializing secure connection..."
    ]);

    const closed = useRef(false);

    const messages: Message[] = [
        { text: "Establishing secure tunnel...", delay: 150 },
        { text: "Loading biometric scanner...", delay: 150 },
        { text: "Connecting to database...", delay: 150 },
        { text: "Decrypting payload...", delay: 150 },
        { text: "System ready. Access granted.", delay: 200 }
    ];

    function hideLoader() {
        if (closed.current) return;
        closed.current = true;
        setVisible(false);
        onFinish?.();
    }

    useEffect(() => {
        let index = 0;

        function nextMessage() {
            if (index >= messages.length) {
                setTimeout(hideLoader, 400);
                return;
            }

            const msg = messages[index];

            setLines((prev) => [...prev, msg.text]);

            setProgress(
                Math.min(
                    100,
                    ((index + 1) / messages.length) * 100 +
                    Math.random() * 8
                )
            );

            index++;
            setTimeout(nextMessage, msg.delay);
        }

        const start = setTimeout(nextMessage, 400);
        const safety = setTimeout(hideLoader, 3500);

        return () => {
            clearTimeout(start);
            clearTimeout(safety);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black text-cyan-400 overflow-hidden">

            {/* Content */}
            <div className="relative w-[90%] max-w-[640px] p-8">

                {/* Logo */}
                <div className="text-center mb-8 relative">
                    <img
                        src="/logo.png"
                        alt="CYBERAVATAR"
                        className="mx-auto w-24 h-24 object-contain drop-shadow-[0_0_30px_cyan] animate-pulse"
                    />
                </div>

                {/* Terminal */}
                <div className="bg-black/70 border border-cyan-500 rounded-lg shadow-[0_0_25px_rgba(0,255,255,0.3)] mb-6">

                   <div className="flex items-center justify-between border-b border-cyan-500 px-3 py-1">
                        <span className="text-[10px] text-cyan-400">/bin/bash --root</span>
                        <div className="flex gap-1">
                             <div className="w-2 h-2 rounded-full bg-red-500/50" />
                             <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        </div>
                    </div>

                    <div className="p-4 h-[200px] overflow-y-auto text-green-400 font-mono text-sm space-y-2">
                        {lines.map((line, i) => (
                            <div key={i} className="animate-[fadeIn_0.3s_ease]">
                                <span className="text-cyan-400 font-semibold">
                                    root@CYBERAVATAR:~$
                                </span>{" "}
                                <span className="border-r-2 border-green-400 animate-pulse">
                                    {line}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    {/* Glitch Header */}
                    <div className="flex justify-between items-end mb-2 font-mono text-cyan-400 text-xs">
                        <span className="animate-pulse">Attempting Connection...</span>
                        <span className="text-cyan-600">PORT: 8080</span>
                    </div>

                    {/* Main Container */}
                    <div className="relative h-6 bg-black/90 border border-cyan-500/50 rounded-sm overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.15)]">

                        {/* Background "Noise" */}
                        <div className="absolute inset-0 z-0 opacity-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                        />

                        {/* The Progress Bar */}
                        <div
                            className="relative h-full bg-cyan-900/40 transition-all duration-75 border-r-2 border-cyan-400"
                            style={{ width: `${progress}%` }}
                        >
                            {/* Animated Gradient Fill */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-400/80" />

                            {/* "Scanline" Animation */}
                            <div className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite] opacity-30"
                                style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #06b6d4 2px, #06b6d4 4px)' }}
                            />
                        </div>

                        {/* Centered Percentage with "Cutout" effect */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className="font-mono font-black text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-[0_0_2px_rgba(6,182,212,0.8)]">
                                {Math.floor(progress).toString().padStart(3, '0')}%
                            </span>
                        </div>
                    </div>

                    {/* Decorative lines underneath */}
                    <div className="flex space-x-1 mt-1">
                        <div className="h-1 w-full bg-cyan-900/30 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/50 w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
                        </div>
                        <div className="h-1 w-4 bg-cyan-500/50" />
                        <div className="h-1 w-2 bg-cyan-500/20" />
                    </div>
                </div>
                <h1 style={{ fontFamily: 'var(--font-blanka)' }} className="text-center text-4xl font-extrabold tracking-[6px]">
                    CYBER-AVATAR
                </h1>

            </div>

            {/* Tailwind Custom Animations */}
            <style>{`
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
        @keyframes fall {
          from { transform: translateY(-100%); }
          to { transform: translateY(120vh); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

        </div>
    );
}
