'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import ProtectedRoute from '@/components/ProtectedRoute';

function SubmissionSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [uniqueId, setUniqueId] = useState('');

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setUniqueId(id);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-2xl px-6">
                <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-12 shadow-2xl text-center">
                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-bounce">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">
                        Submitted Successfully!
                    </h1>
                    <p className="text-white/80 text-lg mb-8">
                        Your inventory has been registered in the system
                    </p>

                    {/* Unique ID Display */}
                    {uniqueId && (
                        <div className="mb-8 p-6 bg-white/5 border border-white/30 rounded-xl">
                            <p className="text-white/60 text-sm mb-2">Generated Unique ID</p>
                            <p className="text-2xl font-bold text-cyan-300 tracking-wider">
                                {uniqueId}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/forms/submission')}
                            className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                        >
                            Submit Another
                        </button>
                        <button
                            onClick={() => router.push('/forms/view/submissions')}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                        >
                            View Database
                        </button>
                        <button
                            onClick={() => router.push('/forms')}
                            className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SubmissionSuccessPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
                <SubmissionSuccessContent />
            </Suspense>
        </ProtectedRoute>
    );
}
