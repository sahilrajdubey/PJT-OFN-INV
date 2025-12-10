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
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black">
            {/* Beams Background - Fullscreen */}
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            {/* Tilted Card Login Box */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                <TiltedCard
                    imageSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='450' height='550'%3E%3Crect width='450' height='550' fill='transparent'/%3E%3C/svg%3E"
                    altText="Login Card"
                    captionText=""
                    containerHeight="450px"
                    containerWidth="450px"
                    imageHeight="450px"
                    imageWidth="450px"
                    scaleOnHover={1.02}
                    rotateAmplitude={8}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                >
                    <div
                        className="w-full  p-10 rounded-xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15"
                        style={{
                            backdropFilter: 'blur(50px)',
                            WebkitBackdropFilter: 'blur(50px)',
                        }}
                    >
                        <h1 className="text-3xl font-bold text-white text-center mb-8 tracking-wider">
                            Admin Login
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    disabled={isLoading}
                                    autoFocus
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 focus:bg-white/15 transition-all duration-300 hover:border-white/40"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 focus:bg-white/15 transition-all duration-300 hover:border-white/40"
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 py-3 rounded-xl font-semibold text-white text-lg tracking-wide transition-colors duration-200 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </TiltedCard>
            </div>
        </div>
    );
}
