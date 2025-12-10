'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

interface ComputerIssue {
    id: string;
    inventory_id: string;
    unique_id: string;
    serial_number: string;
    employee_section: string;
    location: string;
    issued_to: string;
    issue_date: string;
    remarks: string;
    created_at: string;
}

export default function ViewIssuesPage() {
    const router = useRouter();
    const [issues, setIssues] = useState<ComputerIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const { data, error } = await supabase
                .from('computer_issues')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setIssues(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, uniqueId: string) => {
        if (!confirm(`Are you sure you want to delete issue record for ${uniqueId}?\nThis action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('computer_issues')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Issue record deleted successfully!');
            fetchIssues();
        } catch (error: any) {
            alert('Error deleting issue: ' + error.message);
        }
    };

    const exportToPDF = async () => {
        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;
            
            const doc = new jsPDF('l', 'mm', 'a4');
            
            doc.setFontSize(18);
            doc.text('Issue Records Report', 14, 15);
            
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
            doc.text(`Total Records: ${issues.length}`, 14, 27);

            const tableData = issues.map(issue => [
                issue.unique_id,
                issue.serial_number,
                issue.issued_to,
                issue.employee_section,
                issue.location,
                new Date(issue.issue_date).toLocaleDateString(),
                issue.remarks || '-'
            ]);

            autoTable(doc, {
                head: [['Unique ID', 'Serial Number', 'Issued To', 'Section', 'Location', 'Issue Date', 'Remarks']],
                body: tableData,
                startY: 32,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [234, 88, 12] },
                alternateRowStyles: { fillColor: [245, 247, 250] }
            });

            doc.save(`issue-records-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    return (
        <ProtectedRoute>
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
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
                                Issue Records Database
                            </h1>
                            <p className="text-white/60">All equipment issue records</p>
                        </div>
                        <button
                            onClick={exportToPDF}
                            disabled={issues.length === 0}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF
                        </button>
                    </div>
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
                ) : issues.length === 0 ? (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 text-center">
                        <p className="text-white/60">No issue records found</p>
                    </div>
                ) : (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="border-b border-white/30">
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Unique ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Serial Number</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Issued To</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Section</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Location</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Issue Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Remarks</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue, index) => (
                                    <tr
                                        key={issue.id}
                                        className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                                            index % 2 === 0 ? 'bg-white/5' : ''
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-sm font-semibold text-orange-300">{issue.unique_id}</td>
                                        <td className="py-3 px-4 text-sm">{issue.serial_number}</td>
                                        <td className="py-3 px-4 text-sm">{issue.issued_to}</td>
                                        <td className="py-3 px-4 text-sm">{issue.employee_section}</td>
                                        <td className="py-3 px-4 text-sm">{issue.location}</td>
                                        <td className="py-3 px-4 text-sm">{new Date(issue.issue_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm max-w-xs truncate" title={issue.remarks}>{issue.remarks || '-'}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleDelete(issue.id, issue.unique_id)}
                                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 text-xs rounded-lg transition-all"
                                                title="Delete issue record"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        </ProtectedRoute>
    );
}
