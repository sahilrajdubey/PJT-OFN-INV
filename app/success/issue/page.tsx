'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import ProtectedRoute from '@/components/ProtectedRoute';

function IssueSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [issueData, setIssueData] = useState({
        uniqueId: '',
        issuedTo: '',
        location: '',
        section: ''
    });

    useEffect(() => {
        const uniqueId = searchParams.get('id');
        const issuedTo = searchParams.get('to');
        const location = searchParams.get('location');
        const section = searchParams.get('section');

        if (uniqueId) {
            setIssueData({
                uniqueId: uniqueId || '',
                issuedTo: issuedTo || '',
                location: location || '',
                section: section || ''
            });
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
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center animate-bounce">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">
                        Issued Successfully!
                    </h1>
                    <p className="text-white/80 text-lg mb-8">
                        Inventory has been successfully issued to the employee
                    </p>

                    {/* Issue Details */}
                    {issueData.uniqueId && (
                        <div className="mb-8 space-y-4">
                            {/* Unique ID */}
                            <div className="p-4 bg-white/5 border border-white/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Inventory ID</p>
                                <p className="text-xl font-bold text-orange-300 tracking-wider">
                                    {issueData.uniqueId}
                                </p>
                            </div>

                            {/* Issue Information Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-white/5 border border-white/30 rounded-xl">
                                    <p className="text-white/60 text-xs mb-1">Issued To</p>
                                    <p className="text-white font-semibold">
                                        {issueData.issuedTo}
                                    </p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/30 rounded-xl">
                                    <p className="text-white/60 text-xs mb-1">Section</p>
                                    <p className="text-white font-semibold">
                                        {issueData.section}
                                    </p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/30 rounded-xl">
                                    <p className="text-white/60 text-xs mb-1">Location</p>
                                    <p className="text-white font-semibold">
                                        {issueData.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/forms/issue')}
                            className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                        >
                            Issue Another
                        </button>
                        <button
                            onClick={() => router.push('/forms/view/issues')}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
                        >
                            View Issues
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

export default function IssueSuccessPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
                <IssueSuccessContent />
            </Suspense>
        </ProtectedRoute>
    );
}
