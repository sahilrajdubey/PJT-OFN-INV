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
    const [showInventoryTypeDrawer, setShowInventoryTypeDrawer] = useState(false);
    const [formData, setFormData] = useState({
        inventoryType: '',
        serialNumber: '',
        computerType: 'desktop',
        brand: '',
        model: '',
        processor: '',
        ram: '',
        storage: '',
        operatingSystem: '',
        purchaseDate: '',
        remarks: ''
    });

    const inventoryTypes = ['PC', 'CPU', 'Printer', 'UPS'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleInventoryTypeSelect = (type: string) => {
        setFormData({ ...formData, inventoryType: type });
        setShowInventoryTypeDrawer(false);
    };

    const generateUniqueId = async (inventoryType: string): Promise<string> => {
        try {
            // Get the latest entry for this inventory type
            const { data, error } = await supabase
                .from('computer_submissions')
                .select('unique_id')
                .like('unique_id', `OFN/ITC/INV/${inventoryType}-%`)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            let nextNumber = 1;
            if (data && data.length > 0) {
                // Extract the number from the last unique_id
                const lastId = data[0].unique_id;
                const match = lastId.match(/-(\d+)$/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            // Format with leading zeros (001, 002, etc.)
            const formattedNumber = nextNumber.toString().padStart(3, '0');
            return `OFN/ITC/INV/${inventoryType}-${formattedNumber}`;
        } catch (error) {
            console.error('Error generating unique ID:', error);
            // Fallback to timestamp-based ID
            return `OFN/ITC/INV/${inventoryType}-${Date.now()}`;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Generate unique ID
            const uniqueId = await generateUniqueId(formData.inventoryType);

            const { data, error } = await supabase
                .from('computer_submissions')
                .insert([
                    {
                        unique_id: uniqueId,
                        inventory_type: formData.inventoryType,
                        serial_number: formData.serialNumber,
                        computer_type: formData.inventoryType === 'PC' ? formData.computerType : null,
                        brand: formData.brand,
                        model: formData.model,
                        processor: formData.processor,
                        ram: formData.ram,
                        storage: formData.storage,
                        operating_system: formData.operatingSystem,
                        purchase_date: formData.purchaseDate,
                        remarks: formData.remarks
                    }
                ]);

            if (error) throw error;

            router.push(`/success/submission?id=${encodeURIComponent(uniqueId)}`);
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
                            Equipment Submission Form
                    </h1>
                    <p className="text-white/60">Register new equipment into the inventory system</p>
                </div>

                <form onSubmit={handleSubmit} className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Inventory Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80 ml-1">Inventory Type *</label>
                            <button
                                type="button"
                                onClick={() => setShowInventoryTypeDrawer(true)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white text-left focus:outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 transition-all hover:bg-white/15"
                            >
                                {formData.inventoryType || <span className="text-white/50">Click to select type</span>}
                            </button>
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

                        {/* Computer Type - Only for PC */}
                        {formData.inventoryType === 'PC' && (
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
                        )}

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

            {/* Inventory Type Drawer */}
            {showInventoryTypeDrawer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInventoryTypeDrawer(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="relative bg-black/90 backdrop-blur-xl border border-white/40 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/20">
                            <h2 className="text-2xl font-bold text-white">Select Inventory Type</h2>
                            <p className="text-white/60 text-sm mt-1">Choose the type of inventory</p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {inventoryTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleInventoryTypeSelect(type)}
                                        className="p-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </ProtectedRoute>
    );
}
