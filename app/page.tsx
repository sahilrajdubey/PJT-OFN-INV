'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Beams from '@/components/Beams';
import TiltedCard from '@/components/TiltedCard';
import DarkVeil from '@/components/DarkVeil';
import { setAuthToken } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const VALID_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const VALID_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                setAuthToken('authenticated');
                setIsLoading(false);
                router.push('/forms');
            } else {
                setIsLoading(false);
                setError('Invalid username or password');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black px-4 py-8">
            {/* Beams Background - Fullscreen */}
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            {/* Tilted Card Login Box */}
            <div className="relative z-10 flex items-center justify-center w-full h-full pb-8 md:pb-16">
                <div className="w-full max-w-md px-4">
                <TiltedCard
                    imageSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='450' height='550'%3E%3Crect width='450' height='550' fill='transparent'/%3E%3C/svg%3E"
                    altText="Login Card"
                    captionText=""
                    containerHeight="auto"
                    containerWidth="100%"
                    imageHeight="auto"
                    imageWidth="100%"
                    scaleOnHover={1.02}
                    rotateAmplitude={8}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                >
                    <div
                        className="w-full p-5 md:p-10 rounded-xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15"
                        style={{
                            backdropFilter: 'blur(50px)',
                            WebkitBackdropFilter: 'blur(50px)',
                        }}
                    >
                        {/* Logo and Title */}
                        <div className="flex flex-col items-center mb-5 md:mb-8">
                            <img 
                                src="/favicon.ico" 
                                alt="OFN Logo" 
                                className="w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-4"
                            />
                            <h1 className="text-lg md:text-2xl font-bold text-white text-center tracking-wider">
                                OFN-INV-MGMT
                            </h1>
                            <p className="text-white/60 text-xs md:text-sm mt-1 md:mt-2">Admin Portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
                            {/* Error Message */}
                            {error && (
                                <div className="p-2.5 md:p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs md:text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-xs md:text-sm font-medium text-white/80 ml-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    disabled={isLoading}
                                    autoFocus
                                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-white/10 border border-white/30 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 focus:bg-white/15 transition-all duration-300 hover:border-white/40"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-xs md:text-sm font-medium text-white/80 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                        className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 text-sm md:text-base bg-white/10 border border-white/30 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 focus:bg-white/15 transition-all duration-300 hover:border-white/40"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-3 md:mt-4 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-white text-sm md:text-lg tracking-wide transition-colors duration-200 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </TiltedCard>
                </div>
            </div>
            <footer className="absolute bottom-4 w-full text-center text-sm text-white/60">
                © Copyright {new Date().getFullYear()} by Sahil Raj Dubey. All rights reserved.
            </footer>
        </div>
    );
}
