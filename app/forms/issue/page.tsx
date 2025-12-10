'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

interface InventoryItem {
    id: string;
    unique_id: string;
    inventory_type: string;
    serial_number: string;
    computer_type: string | null;
    brand: string;
    model: string;
}

export default function ComputerIssuePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [showInventoryDrawer, setShowInventoryDrawer] = useState(false);
    const [showSectionDrawer, setShowSectionDrawer] = useState(false);
    const [showLocationDrawer, setShowLocationDrawer] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
    
    const [formData, setFormData] = useState({
        inventoryId: '',
        uniqueId: '',
        serialNumber: '',
        employeeSection: '',
        location: '',
        issuedTo: '',
        issueDate: '',
        remarks: ''
    });

    const sections = [
        'Security Section',
        'IT Department',
        'HR Department',
        'Finance Department',
        'Operations',
        'Administration',
        'Engineering',
        'Marketing'
    ];

    const locations = [
        'ITC Building',
        'Security Office',
        'Admin Block',
        'Main Building',
        'Warehouse',
        'Guest House',
        'Training Center'
    ];

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            // Fetch all submissions
            const { data: submissions, error: submissionError } = await supabase
                .from('computer_submissions')
                .select('id, unique_id, inventory_type, serial_number, computer_type, brand, model')
                .order('created_at', { ascending: false });

            if (submissionError) throw submissionError;

            // Fetch all issued inventory IDs
            const { data: issues, error: issueError } = await supabase
                .from('computer_issues')
                .select('inventory_id');

            if (issueError) throw issueError;

            // Create a Set of issued inventory IDs for quick lookup
            const issuedIds = new Set(issues?.map(issue => issue.inventory_id) || []);

            // Filter out already issued items
            const availableInventory = submissions?.filter(item => !issuedIds.has(item.id)) || [];
            
            setInventoryItems(availableInventory);
        } catch (err: any) {
            console.error('Error fetching inventory:', err.message);
        }
    };

    const handleInventorySelect = (item: InventoryItem) => {
        setSelectedInventory(item);
        setFormData({
            ...formData,
            inventoryId: item.id,
            uniqueId: item.unique_id,
            serialNumber: item.serial_number
        });
        setShowInventoryDrawer(false);
    };

    const handleSectionSelect = (section: string) => {
        setFormData({ ...formData, employeeSection: section });
        setShowSectionDrawer(false);
    };

    const handleLocationSelect = (location: string) => {
        setFormData({ ...formData, location });
        setShowLocationDrawer(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                .from('computer_issues')
                .insert([
                    {
                        inventory_id: formData.inventoryId,
                        unique_id: formData.uniqueId,
                        serial_number: formData.serialNumber,
                        employee_section: formData.employeeSection,
                        location: formData.location,
                        issued_to: formData.issuedTo,
                        issue_date: formData.issueDate,
                        remarks: formData.remarks
                    }
                ]);

            if (error) throw error;

            const queryParams = new URLSearchParams({
                id: formData.uniqueId,
                to: formData.issuedTo,
                section: formData.employeeSection,
                location: formData.location
            });

            router.push(`/success/issue?${queryParams.toString()}`);
        } catch (error: any) {
            alert('Error issuing computer: ' + error.message);
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
                        Issue Computer Form
                    </h1>
                    <p className="text-white/60">Issue computer to employee or section</p>
                </div>

                <form onSubmit={handleSubmit} className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 shadow-2xl">
                    {/* Select Inventory ID */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Select Inventory *</label>
                        <button
                            type="button"
                            onClick={() => setShowInventoryDrawer(true)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white text-left focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all hover:bg-white/15"
                        >
                            {selectedInventory ? (
                                <span>
                                    <strong>{selectedInventory.unique_id}</strong> - {selectedInventory.brand} {selectedInventory.model} 
                                    <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-200 text-xs rounded-full">
                                        {selectedInventory.inventory_type}
                                    </span>
                                </span>
                            ) : (
                                <span className="text-white/50">Click to select inventory item</span>
                            )}
                        </button>
                    </div>

                    {/* Select Employee/Section */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Employee Section *</label>
                        <button
                            type="button"
                            onClick={() => setShowSectionDrawer(true)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white text-left focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all hover:bg-white/15"
                        >
                            {formData.employeeSection || <span className="text-white/50">Click to select section</span>}
                        </button>
                    </div>

                    {/* Select Location */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Location *</label>
                        <button
                            type="button"
                            onClick={() => setShowLocationDrawer(true)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white text-left focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all hover:bg-white/15"
                        >
                            {formData.location || <span className="text-white/50">Click to select location</span>}
                        </button>
                    </div>

                    {/* Issued To */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Issued To (Employee Name) *</label>
                        <input
                            type="text"
                            name="issuedTo"
                            value={formData.issuedTo}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
                            placeholder="Enter employee name"
                        />
                    </div>

                    {/* Issue Date */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-white/80 ml-1">Issue Date *</label>
                        <input
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all"
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
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/30 transition-all resize-none"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !formData.inventoryId || !formData.employeeSection || !formData.location}
                        className="w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all duration-300 relative overflow-hidden group hover:shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
                        }}
                    >
                        <span className="relative z-10">
                            {isLoading ? 'Issuing...' : 'Issue Computer'}
                        </span>
                    </button>
                </form>
            </div>

            {/* Inventory Drawer */}
            {showInventoryDrawer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInventoryDrawer(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="relative bg-black/90 backdrop-blur-xl border border-white/40 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/20">
                            <h2 className="text-2xl font-bold text-white">Select Inventory</h2>
                            <p className="text-white/60 text-sm mt-1">Choose a computer from available inventory</p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                            {inventoryItems.length === 0 ? (
                                <p className="text-white/60 text-center py-8">No inventory items found</p>
                            ) : (
                                <div className="space-y-3">
                                    {inventoryItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleInventorySelect(item)}
                                            className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-left transition-all"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-white font-semibold text-lg">{item.unique_id}</p>
                                                    <p className="text-white/70 text-sm">{item.brand} {item.model}</p>
                                                    <p className="text-white/50 text-xs mt-1">Serial: {item.serial_number}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
                                                        {item.inventory_type}
                                                    </span>
                                                    {item.computer_type && (
                                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full capitalize">
                                                            {item.computer_type}
                                                        </span>
                                                    )}
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

            {/* Section Drawer */}
            {showSectionDrawer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowSectionDrawer(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="relative bg-black/90 backdrop-blur-xl border border-white/40 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/20">
                            <h2 className="text-2xl font-bold text-white">Select Section</h2>
                            <p className="text-white/60 text-sm mt-1">Choose employee section</p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {sections.map((section) => (
                                    <button
                                        key={section}
                                        onClick={() => handleSectionSelect(section)}
                                        className="p-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all"
                                    >
                                        {section}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Drawer */}
            {showLocationDrawer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLocationDrawer(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                    <div className="relative bg-black/90 backdrop-blur-xl border border-white/40 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/20">
                            <h2 className="text-2xl font-bold text-white">Select Location</h2>
                            <p className="text-white/60 text-sm mt-1">Choose building/location</p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {locations.map((location) => (
                                    <button
                                        key={location}
                                        onClick={() => handleLocationSelect(location)}
                                        className="p-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all"
                                    >
                                        {location}
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
