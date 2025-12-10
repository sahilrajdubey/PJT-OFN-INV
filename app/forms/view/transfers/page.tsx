'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface ComputerTransfer {
    id: string;
    asset_tag: string;
    serial_number: string;
    action_type: string;
    from_section: string;
    to_section: string;
    transferred_to: string;
    reason: string;
    exit_date: string;
    approved_by: string;
    condition: string;
    accessories: string;
    remarks: string;
    created_at: string;
}

export default function ViewTransfersPage() {
    const router = useRouter();
    const [transfers, setTransfers] = useState<ComputerTransfer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const { data, error } = await supabase
                .from('computer_transfers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransfers(data || []);
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
                        Transfer Records Database
                    </h1>
                    <p className="text-white/60">All computer transfer and exit records</p>
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
                ) : transfers.length === 0 ? (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 text-center">
                        <p className="text-white/60">No transfer records found</p>
                    </div>
                ) : (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="border-b border-white/30">
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Asset Tag</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Serial Number</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Action Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">From Section</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">To Section</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Transferred To</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Reason</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Approved By</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.map((transfer, index) => (
                                    <tr
                                        key={transfer.id}
                                        className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                                            index % 2 === 0 ? 'bg-white/5' : ''
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-sm">{transfer.asset_tag}</td>
                                        <td className="py-3 px-4 text-sm">{transfer.serial_number}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                transfer.action_type === 'transfer' ? 'bg-blue-500/20 text-blue-200' :
                                                transfer.action_type === 'exit' ? 'bg-red-500/20 text-red-200' :
                                                transfer.action_type === 'return' ? 'bg-green-500/20 text-green-200' :
                                                'bg-yellow-500/20 text-yellow-200'
                                            }`}>
                                                {transfer.action_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{transfer.from_section}</td>
                                        <td className="py-3 px-4 text-sm">{transfer.to_section || '-'}</td>
                                        <td className="py-3 px-4 text-sm">{transfer.transferred_to || '-'}</td>
                                        <td className="py-3 px-4 text-sm max-w-xs truncate" title={transfer.reason}>{transfer.reason}</td>
                                        <td className="py-3 px-4 text-sm">{new Date(transfer.exit_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm">{transfer.approved_by}</td>
                                        <td className="py-3 px-4 text-sm capitalize">{transfer.condition}</td>
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
