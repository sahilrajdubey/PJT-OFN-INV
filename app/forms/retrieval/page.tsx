'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

interface IssuedEquipment {
    issue_id: string;
    uid: string;
    inventory_id: string;
    unique_id: string;
    serial_number: string;
    inventory_type: string;
    brand: string;
    model: string;
    issue_type: string;
    issued_to: string | null;
    employee_section: string;
    issue_date: string;
}

export default function RetrievalPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [issuedEquipment, setIssuedEquipment] = useState<IssuedEquipment[]>([]);
    const [showEquipmentDrawer, setShowEquipmentDrawer] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<IssuedEquipment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    const [formData, setFormData] = useState({
        retrievalDate: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    useEffect(() => {
        fetchIssuedEquipment();
    }, []);

    const fetchIssuedEquipment = async () => {
        try {
            // Fetch all issued equipment with full details
            const { data: issues, error: issueError } = await supabase
                .from('computer_issues')
                .select('id, uid, inventory_id, unique_id, serial_number, issue_type, issued_to, employee_section, issue_date');

            if (issueError) throw issueError;

            // Fetch inventory details for each issue
            const enrichedData = await Promise.all(
                (issues || []).map(async (issue) => {
                    const { data: inventory, error: invError } = await supabase
                        .from('computer_submissions')
                        .select('inventory_type, brand, model')
                        .eq('id', issue.inventory_id)
                        .single();

                    if (invError) {
                        console.error('Error fetching inventory:', invError);
                        return null;
                    }

                    return {
                        issue_id: issue.id,
                        uid: issue.uid,
                        inventory_id: issue.inventory_id,
                        unique_id: issue.unique_id,
                        serial_number: issue.serial_number,
                        inventory_type: inventory.inventory_type,
                        brand: inventory.brand,
                        model: inventory.model,
                        issue_type: issue.issue_type,
                        issued_to: issue.issued_to,
                        employee_section: issue.employee_section,
                        issue_date: issue.issue_date
                    };
                })
            );

            setIssuedEquipment(enrichedData.filter(item => item !== null) as IssuedEquipment[]);
        } catch (err: any) {
            console.error('Error fetching issued equipment:', err.message);
            alert('Error loading issued equipment: ' + err.message);
        }
    };

    const handleEquipmentSelect = (equipment: IssuedEquipment) => {
        setSelectedEquipment(equipment);
        setShowEquipmentDrawer(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!selectedEquipment) {
            alert('Please select an equipment to retrieve');
            return;
        }

        setShowConfirmDialog(true);
    };

    const handleConfirmRetrieval = async () => {
        if (!selectedEquipment) return;

        setShowConfirmDialog(false);
        setIsLoading(true);
        
        try {
            // Delete the issue record
            const { error } = await supabase
                .from('computer_issues')
                .delete()
                .eq('id', selectedEquipment.issue_id);

            if (error) throw error;

            // Navigate to success page
            const queryParams = new URLSearchParams({
                uid: selectedEquipment.uid,
                id: selectedEquipment.unique_id,
                brand: selectedEquipment.brand,
                model: selectedEquipment.model
            });

            router.push(`/success/retrieval?${queryParams.toString()}`);
        } catch (error: any) {
            alert('Error retrieving equipment: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEquipment = issuedEquipment.filter(equipment =>
        equipment.unique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (equipment.issued_to && equipment.issued_to.toLowerCase().includes(searchTerm.toLowerCase())) ||
        equipment.employee_section.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
        <div className="min-h-screen w-full relative overflow-hidden bg-black py-12">
            <div className="absolute inset-0 w-full h-full">
                <DarkVeil />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/forms')}
                        className="text-white/60 hover:text-white transition-colors duration-300 text-sm mb-4"
                    >
                        ← Back to Form Selection
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
                        Retrieve Equipment Form
                    </h1>
                    <p className="text-white/60">Return issued equipment back to available inventory</p>
                </div>

                <form onSubmit={handleSubmit} className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 shadow-2xl">
                    {/* Select Equipment */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Select Equipment to Retrieve *</label>
                        <button
                            type="button"
                            onClick={() => setShowEquipmentDrawer(true)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white text-left focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/30 transition-all hover:bg-white/15"
                        >
                            {selectedEquipment ? (
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-lg text-purple-300">UID: {selectedEquipment.uid}</p>
                                            <p className="text-sm text-white/80 mt-1">
                                                <strong>Inventory ID:</strong> {selectedEquipment.unique_id}
                                            </p>
                                            <p className="text-sm text-white/70">
                                                {selectedEquipment.brand} {selectedEquipment.model} ({selectedEquipment.inventory_type})
                                            </p>
                                            <p className="text-sm text-white/70">
                                                Serial: {selectedEquipment.serial_number}
                                            </p>
                                            <p className="text-sm text-white/60 mt-1">
                                                Issued to: {selectedEquipment.issued_to || selectedEquipment.employee_section} • Section: {selectedEquipment.employee_section}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                                            {selectedEquipment.inventory_type}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-white/50">Click to select equipment to retrieve</span>
                            )}
                        </button>
                    </div>

                    {/* Retrieval Date */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Retrieval Date *</label>
                        <input
                            type="date"
                            name="retrievalDate"
                            value={formData.retrievalDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/30 transition-all"
                        />
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/30 transition-all resize-none"
                            placeholder="Reason for retrieval, condition of equipment, etc..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !selectedEquipment}
                        className="w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all duration-300 relative overflow-hidden group hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
                        }}
                    >
                        <span className="relative z-10">
                            {isLoading ? 'Retrieving...' : 'Retrieve Equipment'}
                        </span>
                    </button>
                </form>

                <div className="mt-6 backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-6">
                    <div className="flex items-center gap-3 text-white/70 text-sm">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>
                            <strong>Note:</strong> Retrieving equipment will delete the issue record and mark the equipment as available for issue again.
                        </p>
                    </div>
                </div>
            </div>

            {/* Equipment Drawer */}
            {showEquipmentDrawer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowEquipmentDrawer(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="relative bg-black/90 backdrop-blur-xl border border-white/40 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/20">
                            <h2 className="text-2xl font-bold text-white mb-4">Select Equipment to Retrieve</h2>
                            <input
                                type="text"
                                placeholder="Search by UID, Inventory ID, Brand, Model, Serial, or Issued To..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/30"
                            />
                            <p className="text-white/60 text-sm mt-2">
                                {filteredEquipment.length} issued equipment found
                            </p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-180px)] p-6">
                            {filteredEquipment.length === 0 ? (
                                <p className="text-white/60 text-center py-8">No issued equipment found</p>
                            ) : (
                                <div className="space-y-3">
                                    {filteredEquipment.map((equipment) => (
                                        <button
                                            key={equipment.issue_id}
                                            onClick={() => handleEquipmentSelect(equipment)}
                                            className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-left transition-all"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <p className="text-purple-300 font-bold">UID: {equipment.uid}</p>
                                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                                                            {equipment.inventory_type}
                                                        </span>
                                                    </div>
                                                    <p className="text-white font-semibold">{equipment.unique_id}</p>
                                                    <p className="text-white/70 text-sm mt-1">
                                                        {equipment.brand} {equipment.model}
                                                    </p>
                                                    <p className="text-white/50 text-xs mt-1">
                                                        Serial: {equipment.serial_number}
                                                    </p>
                                                    <div className="mt-2 pt-2 border-t border-white/10">
                                                        <p className="text-white/60 text-xs">
                                                            <span className="text-white/80 font-medium">Issued to:</span> {equipment.issued_to || equipment.employee_section}
                                                        </p>
                                                        <p className="text-white/60 text-xs">
                                                            <span className="text-white/80 font-medium">Section:</span> {equipment.employee_section}
                                                        </p>
                                                        <p className="text-white/60 text-xs">
                                                            <span className="text-white/80 font-medium">Issue Date:</span> {new Date(equipment.issue_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && selectedEquipment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmDialog(false)}>
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                    <div className="relative bg-black/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-purple-500/20" onClick={(e) => e.stopPropagation()}>
                        {/* Warning Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">
                            Confirm Retrieval
                        </h2>

                        {/* Equipment Details */}
                        <div className="mb-6 space-y-3">
                            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">UID</p>
                                <p className="text-base font-bold text-purple-300">{selectedEquipment.uid}</p>
                            </div>
                            
                            <div className="p-4 bg-white/5 border border-white/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Inventory ID</p>
                                <p className="text-base font-bold text-cyan-300">{selectedEquipment.unique_id}</p>
                            </div>

                            <div className="p-3 bg-white/5 border border-white/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Equipment</p>
                                <p className="text-sm font-semibold text-white">
                                    {selectedEquipment.brand} {selectedEquipment.model}
                                </p>
                            </div>

                            <div className="p-3 bg-white/5 border border-white/30 rounded-xl">
                                <p className="text-white/60 text-xs mb-1">Issued To</p>
                                <p className="text-sm text-white">
                                    {selectedEquipment.issued_to || selectedEquipment.employee_section}
                                </p>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                            <p className="text-yellow-200 text-sm text-center">
                                This will mark the equipment as available in inventory
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRetrieval}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                            >
                                Confirm Retrieve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-8 pb-4 text-center text-sm text-white/60">
                © Copyright {new Date().getFullYear()} Sahil Raj Dubey. All rights reserved.
            </footer>
        </div>
        </ProtectedRoute>
    );
}
