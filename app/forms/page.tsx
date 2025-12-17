'use client';

import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearAuthToken } from '@/lib/auth';

export default function FormSelectionPage() {
    const router = useRouter();

    const handleLogout = () => {
        clearAuthToken();
        router.push('/');
    };

    return (
        <ProtectedRoute>
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black px-4 py-8">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-5xl px-4 md:px-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4 tracking-wider">
                    Inventory Management
                </h1>
                <p className="text-white/60 text-center mb-8 md:mb-16 text-sm md:text-lg">
                    Select the form you want to fill
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {/* Computer Submission Form Card */}
                    <button
                        onClick={() => router.push('/forms/submission')}
                        className="group relative p-8 rounded-2xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15 hover:scale-[1.02] hover:shadow-cyan-500/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Equipment Submission</h2>
                            <p className="text-white/70 text-sm">
                                Register new equipment into the inventory system
                            </p>
                        </div>
                    </button>

                    {/* Computer Issue Form Card */}
                    <button
                        onClick={() => router.push('/forms/issue')}
                        className="group relative p-8 rounded-2xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15 hover:scale-[1.02] hover:shadow-orange-500/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Issue Equipment</h2>
                            <p className="text-white/70 text-sm">
                                Issue equipment to employee or section
                            </p>
                        </div>
                    </button>

                    {/* Retrieval Form Card */}
                    <button
                        onClick={() => router.push('/forms/retrieval')}
                        className="group relative p-8 rounded-2xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15 hover:scale-[1.02] hover:shadow-purple-500/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Retrieve Equipment</h2>
                            <p className="text-white/70 text-sm">
                                Return issued equipment back to inventory
                            </p>
                        </div>
                    </button>

                    {/* View Data Card */}
                    <button
                        onClick={() => router.push('/forms/view')}
                        className="group relative p-8 rounded-2xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15 hover:scale-[1.02] hover:shadow-indigo-500/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">View Data</h2>
                            <p className="text-white/70 text-sm">
                                View all submitted and transfer records from database
                            </p>
                        </div>
                    </button>
                </div>

                <div className="mt-8 md:mt-12 text-center flex flex-col items-center gap-3">
                    <button
                        onClick={() => router.push('/forms/settings')}
                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 text-xs md:text-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manage Sections
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-white/60 hover:text-white transition-colors duration-300 text-xs md:text-sm"
                    >
                        ← Logout
                    </button>
                </div>
                <footer className="mt-8 pb-4 text-center text-sm text-white/60">
                    © Copyright {new Date().getFullYear()} Sahil Raj Dubey. All rights reserved.
                </footer>
            </div>
        </div>
        </ProtectedRoute>
    );
}
