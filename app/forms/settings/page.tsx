'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DarkVeil from '@/components/DarkVeil';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SectionsSettingsPage() {
    const router = useRouter();
    const [sections, setSections] = useState<string[]>([
        'ITC',
        'HR',
        'Security',
        'Finance',
        'Operations',
        'Administration',
        'Engineering',
        'Marketing'
    ]);
    const [newSection, setNewSection] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(() => {
        // Load sections from localStorage
        const savedSections = localStorage.getItem('sections');
        if (savedSections) {
            setSections(JSON.parse(savedSections));
        }
    }, []);

    const saveSections = (updatedSections: string[]) => {
        localStorage.setItem('sections', JSON.stringify(updatedSections));
        setSections(updatedSections);
    };

    const handleAddSection = () => {
        if (newSection.trim()) {
            const updatedSections = [...sections, newSection.trim()];
            saveSections(updatedSections);
            setNewSection('');
            setShowAddDialog(false);
        }
    };

    const handleDeleteSection = (index: number) => {
        if (confirm(`Are you sure you want to delete "${sections[index]}"?`)) {
            const updatedSections = sections.filter((_, i) => i !== index);
            saveSections(updatedSections);
        }
    };

    const handleStartEdit = (index: number) => {
        setEditingIndex(index);
        setEditValue(sections[index]);
    };

    const handleSaveEdit = () => {
        if (editingIndex !== null && editValue.trim()) {
            const updatedSections = [...sections];
            updatedSections[editingIndex] = editValue.trim();
            saveSections(updatedSections);
            setEditingIndex(null);
            setEditValue('');
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValue('');
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
                        ← Back to Forms
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
                        Manage Sections
                    </h1>
                    <p className="text-white/60">Add, edit, or remove sections for equipment assignment</p>
                </div>

                <div className="backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-8 shadow-2xl">
                    {/* Add New Section Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => setShowAddDialog(true)}
                            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Section
                        </button>
                    </div>

                    {/* Sections List */}
                    <div className="space-y-3">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-white/5 border border-white/30 rounded-xl hover:bg-white/10 transition-all"
                            >
                                {editingIndex === index ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-indigo-400/70"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200 transition-all"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-1 text-white font-medium">
                                            {section}
                                        </div>
                                        <button
                                            onClick={() => handleStartEdit(index)}
                                            className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSection(index)}
                                            className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {sections.length === 0 && (
                        <div className="text-center py-12 text-white/60">
                            No sections yet. Click "Add New Section" to create one.
                        </div>
                    )}
                </div>

                <div className="mt-6 backdrop-blur-[50px] bg-white/10 border border-white/40 rounded-2xl p-6">
                    <div className="flex items-center gap-3 text-white/70 text-sm">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>
                            <strong>Note:</strong> These sections will be available when issuing equipment. Changes are saved automatically.
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Section Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddDialog(false)}>
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                    <div className="relative bg-black/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-indigo-500/20" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            Add New Section
                        </h2>

                        <input
                            type="text"
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                            placeholder="Enter section name..."
                            className="w-full px-4 py-3 mb-6 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSection}
                                disabled={!newSection.trim()}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Section
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
