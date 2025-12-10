'use client';

import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ViewDataPage() {
    const router = useRouter();

    return (
        <ProtectedRoute>
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-5xl px-6">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/forms')}
                        className="text-white/60 hover:text-white transition-colors duration-300 text-sm mb-4"
                    >
                        ← Back to Form Selection
                    </button>
                </div>

                <h1 className="text-5xl font-bold text-white text-center mb-4 tracking-wider">
                    View Database
                </h1>
                <p className="text-white/60 text-center mb-16 text-lg">
                    Select the data you want to view
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* View Submitted Computers */}
                    <button
                        onClick={() => router.push('/forms/view/submissions')}
                        className="group relative p-8 rounded-2xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15 hover:scale-[1.02] hover:shadow-blue-500/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Submitted Computers</h2>
                            <p className="text-white/70 text-sm">
                                View all registered computer equipment in the inventory
                            </p>
                        </div>
                    </button>

                    {/* View Issue Records */}
                    <button
                        onClick={() => router.push('/forms/view/issues')}
                        className="group relative p-8 rounded-2xl backdrop-blur-[50px] bg-white/10 border border-white/40 shadow-2xl transition-all duration-500 hover:backdrop-blur-[60px] hover:bg-white/15 hover:scale-[1.02] hover:shadow-purple-500/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Issue Records</h2>
                            <p className="text-white/70 text-sm">
                                View all computer issue records
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}
