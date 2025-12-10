'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface ComputerSubmission {
    id: string;
    asset_tag: string;
    serial_number: string;
    computer_type: string;
    brand: string;
    model: string;
    processor: string;
    ram: string;
    storage: string;
    operating_system: string;
    assigned_to: string;
    section: string;
    purchase_date: string;
    remarks: string;
    created_at: string;
}

export default function ViewSubmissionsPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<ComputerSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const { data, error } = await supabase
                .from('computer_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black py-12">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/forms/view')}
                        className="text-white/60 hover:text-white transition-colors duration-300 text-sm mb-4"
                    >
                        ← Back to View Data
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
                        Submitted Computers Database
                    </h1>
                    <p className="text-white/60">All registered computer equipment</p>
                </div>

                {loading ? (
                    <div className="text-center text-white/60 py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                        <p className="mt-4">Loading data...</p>
                    </div>
                ) : error ? (
                    <div className="backdrop-blur-[50px] bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center">
                        <p className="text-red-200 mb-4">{error}</p>
                        <p className="text-white/60 text-sm">Please check your Supabase configuration</p>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 text-center">
                        <p className="text-white/60">No submissions found</p>
                    </div>
                ) : (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="border-b border-white/30">
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Asset Tag</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Serial Number</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Brand</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Model</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Processor</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">RAM</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Storage</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">OS</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Assigned To</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Section</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Purchase Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission, index) => (
                                    <tr
                                        key={submission.id}
                                        className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                                            index % 2 === 0 ? 'bg-white/5' : ''
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-sm">{submission.asset_tag}</td>
                                        <td className="py-3 px-4 text-sm">{submission.serial_number}</td>
                                        <td className="py-3 px-4 text-sm capitalize">{submission.computer_type}</td>
                                        <td className="py-3 px-4 text-sm">{submission.brand}</td>
                                        <td className="py-3 px-4 text-sm">{submission.model}</td>
                                        <td className="py-3 px-4 text-sm">{submission.processor}</td>
                                        <td className="py-3 px-4 text-sm">{submission.ram}</td>
                                        <td className="py-3 px-4 text-sm">{submission.storage}</td>
                                        <td className="py-3 px-4 text-sm">{submission.operating_system}</td>
                                        <td className="py-3 px-4 text-sm">{submission.assigned_to}</td>
                                        <td className="py-3 px-4 text-sm">{submission.section}</td>
                                        <td className="py-3 px-4 text-sm">{new Date(submission.purchase_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
