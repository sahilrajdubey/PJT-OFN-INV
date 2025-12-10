'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function ComputerSubmissionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        assetTag: '',
        serialNumber: '',
        computerType: 'desktop',
        brand: '',
        model: '',
        processor: '',
        ram: '',
        storage: '',
        operatingSystem: '',
        assignedTo: '',
        section: '',
        purchaseDate: '',
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
                .from('computer_submissions')
                .insert([
                    {
                        asset_tag: formData.assetTag,
                        serial_number: formData.serialNumber,
                        computer_type: formData.computerType,
                        brand: formData.brand,
                        model: formData.model,
                        processor: formData.processor,
                        ram: formData.ram,
                        storage: formData.storage,
                        operating_system: formData.operatingSystem,
                        assigned_to: formData.assignedTo,
                        section: formData.section,
                        purchase_date: formData.purchaseDate,
                        remarks: formData.remarks
                    }
                ]);

            if (error) throw error;

            alert('Computer submitted successfully!');
            router.push('/forms');
        } catch (error: any) {
            alert('Error submitting data: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

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
                        Computer Submission Form
                    </h1>
                    <p className="text-white/60">Register new computer equipment</p>
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
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
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
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="Enter serial number"
                            />
                        </div>

                        {/* Computer Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Computer Type *</label>
                            <select
                                name="computerType"
                                value={formData.computerType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                            >
                                <option value="desktop">Desktop</option>
                                <option value="laptop">Laptop</option>
                                <option value="workstation">Workstation</option>
                                <option value="server">Server</option>
                            </select>
                        </div>

                        {/* Brand */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Brand *</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="e.g., Dell, HP, Lenovo"
                            />
                        </div>

                        {/* Model */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Model *</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="Enter model number"
                            />
                        </div>

                        {/* Processor */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Processor *</label>
                            <input
                                type="text"
                                name="processor"
                                value={formData.processor}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="e.g., Intel Core i7"
                            />
                        </div>

                        {/* RAM */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">RAM *</label>
                            <input
                                type="text"
                                name="ram"
                                value={formData.ram}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="e.g., 16GB"
                            />
                        </div>

                        {/* Storage */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Storage *</label>
                            <input
                                type="text"
                                name="storage"
                                value={formData.storage}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="e.g., 512GB SSD"
                            />
                        </div>

                        {/* Operating System */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Operating System *</label>
                            <input
                                type="text"
                                name="operatingSystem"
                                value={formData.operatingSystem}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="e.g., Windows 11 Pro"
                            />
                        </div>

                        {/* Assigned To */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Assigned To *</label>
                            <input
                                type="text"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="Employee name"
                            />
                        </div>

                        {/* Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Section *</label>
                            <input
                                type="text"
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                placeholder="e.g., IT Department"
                            />
                        </div>

                        {/* Purchase Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Purchase Date *</label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all"
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
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all resize-none"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all duration-300 relative overflow-hidden group hover:shadow-lg hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        }}
                    >
                        <span className="relative z-10">
                            {isLoading ? 'Submitting...' : 'Submit Computer'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
        </ProtectedRoute>
    );
}
