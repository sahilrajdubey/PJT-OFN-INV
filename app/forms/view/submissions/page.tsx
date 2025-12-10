'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface ComputerSubmission {
    id: string;
    unique_id: string;
    inventory_type: string;
    serial_number: string;
    computer_type: string | null;
    brand: string;
    model: string;
    processor: string;
    ram: string;
    storage: string;
    operating_system: string;
    purchase_date: string;
    remarks: string;
    created_at: string;
    is_issued?: boolean;
    issue_details?: {
        issued_to: string;
        employee_section: string;
        location: string;
        issue_date: string;
    };
}

export default function ViewSubmissionsPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<ComputerSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'issued'>('all');
    const [filterInventoryType, setFilterInventoryType] = useState<'all' | 'PC' | 'CPU' | 'Printer' | 'UPS'>('all');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            // Fetch all submissions
            const { data: submissionsData, error: submissionError } = await supabase
                .from('computer_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (submissionError) throw submissionError;

            // Fetch all issues with details
            const { data: issuesData, error: issueError } = await supabase
                .from('computer_issues')
                .select('inventory_id, issued_to, employee_section, location, issue_date');

            if (issueError) throw issueError;

            // Create a map of issued inventory with details
            const issuesMap = new Map(
                issuesData?.map(issue => [
                    issue.inventory_id,
                    {
                        issued_to: issue.issued_to,
                        employee_section: issue.employee_section,
                        location: issue.location,
                        issue_date: issue.issue_date
                    }
                ]) || []
            );

            // Merge submission data with issue status
            const enrichedSubmissions = submissionsData?.map(submission => ({
                ...submission,
                is_issued: issuesMap.has(submission.id),
                issue_details: issuesMap.get(submission.id)
            })) || [];

            setSubmissions(enrichedSubmissions);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubmissions = submissions.filter(submission => {
        // Filter by status
        if (filterStatus === 'available' && submission.is_issued) return false;
        if (filterStatus === 'issued' && !submission.is_issued) return false;
        
        // Filter by inventory type
        if (filterInventoryType !== 'all' && submission.inventory_type !== filterInventoryType) return false;
        
        return true;
    });

    const handleDelete = async (id: string, uniqueId: string) => {
        if (!confirm(`Are you sure you want to delete inventory ${uniqueId}?\nThis action cannot be undone.`)) {
            return;
        }

        try {
            // Check if inventory is issued
            const { data: issueCheck } = await supabase
                .from('computer_issues')
                .select('id')
                .eq('inventory_id', id)
                .single();

            if (issueCheck) {
                alert('Cannot delete! This inventory is currently issued. Please remove the issue record first.');
                return;
            }

            // Delete from submissions
            const { error } = await supabase
                .from('computer_submissions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Inventory deleted successfully!');
            fetchSubmissions();
        } catch (error: any) {
            alert('Error deleting inventory: ' + error.message);
        }
    };

    const exportToPDF = async () => {
        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;
            
            const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
            
            // Add title
            doc.setFontSize(18);
            doc.text('Inventory Database Report', 14, 15);
            
            // Add filters info
            doc.setFontSize(10);
            doc.text(`Status: ${filterStatus.toUpperCase()} | Type: ${filterInventoryType}`, 14, 22);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);
            doc.text(`Total Records: ${filteredSubmissions.length}`, 14, 32);

            // Prepare table data
            const tableData = filteredSubmissions.map(submission => [
                submission.is_issued ? 'Issued' : 'Available',
                submission.unique_id,
                submission.inventory_type,
                submission.serial_number,
                submission.computer_type || '-',
                submission.brand,
                submission.model,
                submission.issue_details?.issued_to || '-',
                submission.issue_details?.location || '-',
                new Date(submission.purchase_date).toLocaleDateString()
            ]);

            // Add table
            autoTable(doc, {
                head: [['Status', 'Unique ID', 'Type', 'Serial', 'PC Type', 'Brand', 'Model', 'Issued To', 'Location', 'Purchase Date']],
                body: tableData,
                startY: 37,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [59, 130, 246] },
                alternateRowStyles: { fillColor: [245, 247, 250] }
            });

            // Save PDF
            doc.save(`inventory-report-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black py-6 md:py-12">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
                <div className="mb-6 md:mb-8">
                    <button
                        onClick={() => router.push('/forms/view')}
                        className="text-white/60 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-4"
                    >
                        ← Back to View Data
                    </button>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider">
                                Submitted Equipment Database
                            </h1>
                            <p className="text-white/60 text-sm md:text-base">All registered equipment</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={exportToPDF}
                                disabled={filteredSubmissions.length === 0}
                                className="px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs md:text-sm"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="hidden md:inline">Export PDF</span>
                                <span className="md:hidden">PDF</span>
                            </button>
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 md:px-4 py-2 rounded-lg transition-all text-xs md:text-sm ${
                                    filterStatus === 'all'
                                        ? 'bg-white/20 text-white border border-white/40'
                                        : 'bg-white/5 text-white/60 border border-white/20 hover:bg-white/10'
                                }`}
                            >
                                All ({submissions.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('available')}
                                className={`px-4 py-2 rounded-lg transition-all ${
                                    filterStatus === 'available'
                                        ? 'bg-green-500/20 text-green-200 border border-green-500/40'
                                        : 'bg-white/5 text-white/60 border border-white/20 hover:bg-white/10'
                                }`}
                            >
                                Available ({submissions.filter(s => !s.is_issued).length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('issued')}
                                className={`px-4 py-2 rounded-lg transition-all ${
                                    filterStatus === 'issued'
                                        ? 'bg-orange-500/20 text-orange-200 border border-orange-500/40'
                                        : 'bg-white/5 text-white/60 border border-white/20 hover:bg-white/10'
                                }`}
                            >
                                Issued ({submissions.filter(s => s.is_issued).length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inventory Type Filter Tabs */}
                <div className="mb-6 flex justify-center overflow-x-auto">
                    <div className="inline-flex gap-2 backdrop-blur-[50px] bg-white/5 border border-white/30 rounded-xl p-2 min-w-max">
                        <button
                            onClick={() => setFilterInventoryType('all')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                                filterInventoryType === 'all'
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            All Types
                        </button>
                        <button
                            onClick={() => setFilterInventoryType('PC')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                                filterInventoryType === 'PC'
                                    ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            PC ({submissions.filter(s => s.inventory_type === 'PC').length})
                        </button>
                        <button
                            onClick={() => setFilterInventoryType('CPU')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                                filterInventoryType === 'CPU'
                                    ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            CPU ({submissions.filter(s => s.inventory_type === 'CPU').length})
                        </button>
                        <button
                            onClick={() => setFilterInventoryType('Printer')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                                filterInventoryType === 'Printer'
                                    ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            Printer ({submissions.filter(s => s.inventory_type === 'Printer').length})
                        </button>
                        <button
                            onClick={() => setFilterInventoryType('UPS')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                                filterInventoryType === 'UPS'
                                    ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            UPS ({submissions.filter(s => s.inventory_type === 'UPS').length})
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
                ) : filteredSubmissions.length === 0 ? (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 text-center">
                        <p className="text-white/60">
                            {filterStatus === 'available' && 'No available inventory found'}
                            {filterStatus === 'issued' && 'No issued inventory found'}
                            {filterStatus === 'all' && 'No submissions found'}
                        </p>
                    </div>
                ) : (
                    <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-4 md:p-6 shadow-2xl overflow-x-auto">
                        <table className="w-full text-white min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/30">
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Status</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Unique ID</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Inventory Type</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Serial Number</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">PC Type</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Brand</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Model</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Issued To</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Location</th>
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Purchase Date</th>
                                    <th className="text-center py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.map((submission, index) => (
                                    <tr
                                        key={submission.id}
                                        className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                                            index % 2 === 0 ? 'bg-white/5' : ''
                                        }`}
                                    >
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                                            {submission.is_issued ? (
                                                <span className="px-2 py-1 bg-orange-500/20 text-orange-200 text-xs rounded-full">
                                                    Issued
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">
                                                    Available
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-cyan-300">{submission.unique_id}</td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
                                                {submission.inventory_type}
                                            </span>
                                        </td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{submission.serial_number}</td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                                            {submission.computer_type ? (
                                                <span className="capitalize">{submission.computer_type}</span>
                                            ) : (
                                                <span className="text-white/40">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{submission.brand}</td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{submission.model}</td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                                            {submission.issue_details?.issued_to || (
                                                <span className="text-white/40">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                                            {submission.issue_details?.location || (
                                                <span className="text-white/40">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{new Date(submission.purchase_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleDelete(submission.id, submission.unique_id)}
                                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 text-xs rounded-lg transition-all"
                                                title="Delete inventory"
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
    );
}
