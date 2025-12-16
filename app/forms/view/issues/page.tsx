'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

interface ComputerIssue {
    id: string;
    uid: string;
    inventory_id: string;
    unique_id: string;
    serial_number: string;
    issue_type: 'section' | 'employee';
    employee_section: string;
    issued_to: string | null;
    phone_number: string | null;
    email: string | null;
    designation: string | null;
    issue_date: string;
    remarks: string;
    created_at: string;
}

export default function ViewIssuesPage() {
    const router = useRouter();
    const [issues, setIssues] = useState<ComputerIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingIssue, setEditingIssue] = useState<ComputerIssue | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<ComputerIssue>>({});

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

    const handleEdit = (issue: ComputerIssue) => {
        setEditingIssue(issue);
        setEditFormData({
            issued_to: issue.issued_to,
            employee_section: issue.employee_section,
            phone_number: issue.phone_number,
            email: issue.email,
            designation: issue.designation,
            issue_date: issue.issue_date,
            remarks: issue.remarks
        });
    };

    const handleUpdate = async () => {
        if (!editingIssue) return;

        try {
            const { error } = await supabase
                .from('computer_issues')
                .update(editFormData)
                .eq('id', editingIssue.id);

            if (error) throw error;

            alert('Issue record updated successfully!');
            setEditingIssue(null);
            setEditFormData({});
            fetchIssues();
        } catch (error: any) {
            alert('Error updating issue: ' + error.message);
        }
    };

    const handlePrint = async (issue: ComputerIssue) => {
        try {
            // Fetch full inventory details
            const { data: inventoryData, error } = await supabase
                .from('computer_submissions')
                .select('*')
                .eq('id', issue.inventory_id)
                .single();

            if (error) throw error;

            const jsPDF = (await import('jspdf')).default;
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.text('Equipment Issue Record', 105, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });

            // UID Box
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.setDrawColor(255, 127, 0);
            doc.setLineWidth(1);
            doc.rect(15, 35, 180, 15);
            doc.text(`UID: ${issue.uid}`, 105, 45, { align: 'center' });

            let yPos = 60;

            // Equipment Details
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Equipment Details', 15, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.text(`Inventory ID: ${issue.unique_id}`, 20, yPos);
            yPos += 6;
            doc.text(`Serial Number: ${issue.serial_number}`, 20, yPos);
            yPos += 6;
            doc.text(`Brand: ${inventoryData.brand}`, 20, yPos);
            yPos += 6;
            doc.text(`Model: ${inventoryData.model}`, 20, yPos);
            yPos += 6;
            doc.text(`Inventory Type: ${inventoryData.inventory_type}`, 20, yPos);
            yPos += 6;
            doc.text(`Processor: ${inventoryData.processor}`, 20, yPos);
            yPos += 6;
            doc.text(`RAM: ${inventoryData.ram}`, 20, yPos);
            yPos += 6;
            doc.text(`Storage: ${inventoryData.storage}`, 20, yPos);
            yPos += 6;
            doc.text(`Operating System: ${inventoryData.operating_system}`, 20, yPos);
            yPos += 10;

            // Issue Details
            doc.setFontSize(14);
            doc.text('Issue Details', 15, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.text(`Issue Type: ${issue.issue_type === 'employee' ? 'Employee' : 'Section'}`, 20, yPos);
            yPos += 6;
            doc.text(`Section: ${issue.employee_section}`, 20, yPos);
            yPos += 6;

            if (issue.issue_type === 'employee' && issue.issued_to) {
                doc.text(`Issued To: ${issue.issued_to}`, 20, yPos);
                yPos += 6;
                if (issue.phone_number) {
                    doc.text(`Phone: ${issue.phone_number}`, 20, yPos);
                    yPos += 6;
                }
                if (issue.email) {
                    doc.text(`Email: ${issue.email}`, 20, yPos);
                    yPos += 6;
                }
                if (issue.designation) {
                    doc.text(`Designation: ${issue.designation}`, 20, yPos);
                    yPos += 6;
                }
            }

            doc.text(`Issue Date: ${new Date(issue.issue_date).toLocaleDateString()}`, 20, yPos);
            yPos += 6;

            if (issue.remarks) {
                doc.text(`Remarks: ${issue.remarks}`, 20, yPos);
                yPos += 6;
            }

            yPos += 10;
            doc.text(`Created: ${new Date(issue.created_at).toLocaleString()}`, 20, yPos);

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('© OFN Inventory Management System', 105, 280, { align: 'center' });

            doc.save(`Issue-${issue.uid}-${issue.unique_id}.pdf`);
        } catch (error: any) {
            alert('Error printing: ' + error.message);
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
                issue.uid,
                issue.unique_id,
                issue.serial_number,
                issue.issue_type === 'employee' ? issue.issued_to || '-' : issue.employee_section,
                issue.employee_section,
                new Date(issue.issue_date).toLocaleDateString(),
                issue.remarks || '-'
            ]);

            autoTable(doc, {
                head: [['UID', 'Unique ID', 'Serial Number', 'Issued To', 'Section', 'Issue Date', 'Remarks']],
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
                                    <th className="text-left py-3 px-4 text-sm font-semibold">UID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Unique ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Serial Number</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Issue Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Issued To</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Section</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Issue Date</th>
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
                                        <td className="py-3 px-4 text-sm font-semibold text-cyan-300">{issue.uid}</td>
                                        <td className="py-3 px-4 text-sm font-semibold text-orange-300">{issue.unique_id}</td>
                                        <td className="py-3 px-4 text-sm">{issue.serial_number}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                issue.issue_type === 'employee' 
                                                    ? 'bg-blue-500/20 text-blue-200' 
                                                    : 'bg-purple-500/20 text-purple-200'
                                            }`}>
                                                {issue.issue_type === 'employee' ? 'Employee' : 'Section'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {issue.issue_type === 'employee' ? issue.issued_to : issue.employee_section}
                                        </td>
                                        <td className="py-3 px-4 text-sm">{issue.employee_section}</td>
                                        <td className="py-3 px-4 text-sm">{new Date(issue.issue_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => handlePrint(issue)}
                                                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200 text-xs rounded-lg transition-all"
                                                    title="Print issue record"
                                                >
                                                    Print
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(issue)}
                                                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 text-xs rounded-lg transition-all"
                                                    title="Edit issue record"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(issue.id, issue.unique_id)}
                                                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 text-xs rounded-lg transition-all"
                                                    title="Delete issue record"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit Modal */}
                {editingIssue && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Edit Issue Record</h2>
                                <button
                                    onClick={() => setEditingIssue(null)}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white/80 text-sm mb-2">UID (Read-only)</label>
                                    <input
                                        type="text"
                                        value={editingIssue.uid}
                                        disabled
                                        className="w-full px-4 py-2 bg-white/5 border border-white/30 rounded-lg text-white/50 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">Unique ID (Read-only)</label>
                                    <input
                                        type="text"
                                        value={editingIssue.unique_id}
                                        disabled
                                        className="w-full px-4 py-2 bg-white/5 border border-white/30 rounded-lg text-white/50 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">Employee Section</label>
                                    <input
                                        type="text"
                                        value={editFormData.employee_section || ''}
                                        onChange={(e) => setEditFormData({...editFormData, employee_section: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                {editingIssue.issue_type === 'employee' && (
                                    <>
                                        <div>
                                            <label className="block text-white/80 text-sm mb-2">Issued To</label>
                                            <input
                                                type="text"
                                                value={editFormData.issued_to || ''}
                                                onChange={(e) => setEditFormData({...editFormData, issued_to: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={editFormData.phone_number || ''}
                                                onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={editFormData.email || ''}
                                                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white/80 text-sm mb-2">Designation</label>
                                            <input
                                                type="text"
                                                value={editFormData.designation || ''}
                                                onChange={(e) => setEditFormData({...editFormData, designation: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">Issue Date</label>
                                    <input
                                        type="date"
                                        value={editFormData.issue_date || ''}
                                        onChange={(e) => setEditFormData({...editFormData, issue_date: e.target.value})}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">Remarks</label>
                                    <textarea
                                        value={editFormData.remarks || ''}
                                        onChange={(e) => setEditFormData({...editFormData, remarks: e.target.value})}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleUpdate}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditingIssue(null)}
                                        className="flex-1 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </ProtectedRoute>
    );
}
