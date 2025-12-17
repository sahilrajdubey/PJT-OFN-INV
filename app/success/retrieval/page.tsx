'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import ProtectedRoute from '@/components/ProtectedRoute';

function RetrievalSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [uid, setUid] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');

    useEffect(() => {
        const uidParam = searchParams.get('uid');
        const idParam = searchParams.get('id');
        const brandParam = searchParams.get('brand');
        const modelParam = searchParams.get('model');
        
        if (uidParam) setUid(uidParam);
        if (idParam) setUniqueId(idParam);
        if (brandParam) setBrand(brandParam);
        if (modelParam) setModel(modelParam);
    }, [searchParams]);

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-xl px-6">
                <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 shadow-2xl text-center">
                    {/* Success Icon */}
                    <div className="mb-4 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center animate-bounce">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-white mb-3 tracking-wider">
                        Retrieved Successfully!
                    </h1>
                    <p className="text-white/80 mb-6">
                        Equipment has been returned and is now available
                    </p>

                    {/* Equipment Details Display */}
                    <div className="mb-6 space-y-3">
                        {uid && (
                            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Issue Record UID</p>
                                <p className="text-xl font-bold text-purple-300 tracking-wider">
                                    {uid}
                                </p>
                            </div>
                        )}
                        
                        {uniqueId && (
                            <div className="p-4 bg-white/5 border border-white/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Inventory ID</p>
                                <p className="text-xl font-bold text-cyan-300 tracking-wider">
                                    {uniqueId}
                                </p>
                            </div>
                        )}

                        {brand && model && (
                            <div className="p-3 bg-white/5 border border-white/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Equipment</p>
                                <p className="text-base font-semibold text-white">
                                    {brand} {model}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Info Message */}
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-green-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs">
                                This equipment is now available for issue
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push('/forms/retrieval')}
                            className="w-full px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                        >
                            Retrieve Another
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/forms/view/submissions')}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20 transition-all duration-300"
                            >
                                View Inventory
                            </button>
                            <button
                                onClick={() => router.push('/forms')}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20 transition-all duration-300"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="absolute bottom-4 w-full text-center text-sm text-white/60">
                © Copyright {new Date().getFullYear()} Sahil Raj Dubey. All rights reserved.
            </footer>
        </div>
    );
}

export default function RetrievalSuccessPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
                <RetrievalSuccessContent />
            </Suspense>
        </ProtectedRoute>
    );
}
