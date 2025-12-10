'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ComputerExitPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        assetTag: '',
        serialNumber: '',
        actionType: 'transfer',
        fromSection: '',
        toSection: '',
        transferredTo: '',
        reason: '',
        exitDate: '',
        approvedBy: '',
        condition: 'good',
        accessories: '',
        remarks: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const { data, error } = await supabase
                .from('computer_transfers')
                .insert([
                    {
                        asset_tag: formData.assetTag,
                        serial_number: formData.serialNumber,
                        action_type: formData.actionType,
                        from_section: formData.fromSection,
                        to_section: formData.toSection || null,
                        transferred_to: formData.transferredTo || null,
                        reason: formData.reason,
                        exit_date: formData.exitDate,
                        approved_by: formData.approvedBy,
                        condition: formData.condition,
                        accessories: formData.accessories,
                        remarks: formData.remarks
                    }
                ]);

            if (error) throw error;

            alert(`Computer ${formData.actionType} recorded successfully!`);
            router.push('/forms');
        } catch (error: any) {
            alert('Error recording data: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                        Computer Exit/Transfer Form
                    </h1>
                    <p className="text-white/60">Record computer exit or transfer between sections</p>
                </div>

                <form onSubmit={handleSubmit} className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Asset Tag */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Asset Tag *</label>
                            <input
                                type="text"
                                name="assetTag"
                                value={formData.assetTag}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                placeholder="e.g., COMP-2024-001"
                            />
                        </div>

                        {/* Serial Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Serial Number *</label>
                            <input
                                type="text"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                placeholder="Enter serial number"
                            />
                        </div>

                        {/* Action Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Action Type *</label>
                            <select
                                name="actionType"
                                value={formData.actionType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                            >
                                <option value="transfer">Transfer</option>
                                <option value="exit">Exit/Disposal</option>
                                <option value="return">Return</option>
                                <option value="repair">Sent for Repair</option>
                            </select>
                        </div>

                        {/* From Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">From Section *</label>
                            <input
                                type="text"
                                name="fromSection"
                                value={formData.fromSection}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                placeholder="Current section"
                            />
                        </div>

                        {/* To Section */}
                        {formData.actionType === 'transfer' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">To Section *</label>
                                <input
                                    type="text"
                                    name="toSection"
                                    value={formData.toSection}
                                    onChange={handleChange}
                                    required={formData.actionType === 'transfer'}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                    placeholder="Destination section"
                                />
                            </div>
                        )}

                        {/* Transferred To */}
                        {formData.actionType === 'transfer' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">Transferred To *</label>
                                <input
                                    type="text"
                                    name="transferredTo"
                                    value={formData.transferredTo}
                                    onChange={handleChange}
                                    required={formData.actionType === 'transfer'}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                    placeholder="New assignee name"
                                />
                            </div>
                        )}

                        {/* Reason */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Reason for {formData.actionType} *</label>
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                placeholder="Provide reason"
                            />
                        </div>

                        {/* Exit/Transfer Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Date *</label>
                            <input
                                type="date"
                                name="exitDate"
                                value={formData.exitDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                            />
                        </div>

                        {/* Approved By */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Approved By *</label>
                            <input
                                type="text"
                                name="approvedBy"
                                value={formData.approvedBy}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                placeholder="Approver name"
                            />
                        </div>

                        {/* Condition */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Condition *</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                            >
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                                <option value="damaged">Damaged</option>
                            </select>
                        </div>

                        {/* Accessories */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Accessories Included</label>
                            <input
                                type="text"
                                name="accessories"
                                value={formData.accessories}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                                placeholder="e.g., Mouse, Keyboard, Charger"
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2 mt-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all resize-none"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all duration-300 relative overflow-hidden group hover:shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
                        }}
                    >
                        <span className="relative z-10">
                            {isLoading ? 'Recording...' : `Record ${formData.actionType.charAt(0).toUpperCase() + formData.actionType.slice(1)}`}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
