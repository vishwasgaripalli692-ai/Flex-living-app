'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Star, AlertTriangle, Filter, LayoutDashboard, Settings, ChevronRight, Info, X } from 'lucide-react';
import Link from 'next/link';

// Premium Coming Soon Component
const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>
                <div className="text-center">
                    <div className="inline-flex p-4 rounded-full bg-slate-50 mb-6 text-slate-900">
                        <Settings className="animate-spin-slow" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Refining {featureName}</h3>
                    <p className="text-slate-500 leading-relaxed mb-8">
                        This interface is currently being tailored to meet our premium standards. We are crafting a seamless experience for your portfolio.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sourceFilter, setSourceFilter] = useState('all');
    const [propertyFilter, setPropertyFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        fetch('/api/hostaway')
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setLoading(false);
            });
    }, []);

    const toggleApproval = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: newStatus } : r));
        await fetch('/api/hostaway/update', {
            method: 'POST',
            body: JSON.stringify({ id, isApproved: newStatus })
        });
    };

    const properties = [...new Set(reviews.map(r => r.listingName))];

    const processedReviews = useMemo(() => {
        let result = [...reviews];
        if (sourceFilter !== 'all') result = result.filter(r => r.source === sourceFilter);
        if (propertyFilter !== 'all') result = result.filter(r => r.listingName === propertyFilter);

        result.sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
            if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
            if (sortOrder === 'highest') return b.rating - a.rating;
            if (sortOrder === 'lowest') return a.rating - b.rating;
            return 0;
        });
        return result;
    }, [reviews, sourceFilter, propertyFilter, sortOrder]);

    const cleanlinessAvg = reviews.reduce((acc, r) => acc + (r.categories?.cleanliness || 0), 0) / reviews.length;
    const showWarning = cleanlinessAvg < 8;

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="w-12 h-[1px] bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 animate-loading-bar" />
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Synchronizing Data</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-900 antialiased">
            <ComingSoonModal
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                featureName={activeModal}
            />

            {/* Premium Navigation */}
            <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-12">
                    <span className="text-lg font-black tracking-tighter italic">FLEX LIVING</span>
                    <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="text-slate-900 cursor-pointer border-b border-slate-900 pb-1">Dashboard</span>
                        <span onClick={() => setActiveModal('Property Management')} className="hover:text-slate-900 cursor-pointer transition-colors">Properties</span>
                        <span onClick={() => setActiveModal('Portfolio Analytics')} className="hover:text-slate-900 cursor-pointer transition-colors">Analytics</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setActiveModal('User Profile')} className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <Settings size={16} className="text-slate-400" />
                    </button>
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto px-10 py-12">
                <header className="mb-14 max-w-2xl">
                    <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">Review Intelligence</h1>
                    <p className="text-lg text-slate-500 leading-relaxed font-light">
                        Maintain the excellence of your portfolio through real-time guest feedback and operational insights.
                    </p>
                </header>

                {/* STATS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { label: 'Verified Reviews', value: reviews.length, detail: 'Last 30 days' },
                        { label: 'Global Satisfaction', value: '4.8', detail: 'Portfolio Average', icon: <Star className="fill-slate-900 text-slate-900 inline ml-1" size={18} /> },
                        { label: 'Pending Review', value: reviews.filter(r => !r.isApproved).length, detail: 'Requires attention' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{stat.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-light tracking-tighter text-slate-900 group-hover:tracking-tight transition-all duration-500">{stat.value}</span>
                                {stat.icon}
                            </div>
                            <p className="text-slate-400 text-xs mt-4 font-medium italic">{stat.detail}</p>
                        </div>
                    ))}
                </div>

                {/* OPERATIONAL ALERT */}
                {showWarning && (
                    <div className="bg-slate-900 text-white p-8 mb-12 flex items-center justify-between rounded-[1.5rem] overflow-hidden relative">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                                <AlertTriangle className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-lg mb-1">Operational Priority: Maintenance</p>
                                <p className="text-slate-400 text-sm font-light">Cleanliness trends suggest a deep-clean is required for <span className="text-white font-medium underline underline-offset-4 cursor-pointer">Shoreditch Heights</span>.</p>
                            </div>
                        </div>
                        <button className="relative z-10 bg-white text-slate-900 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                            Assign Task
                        </button>
                    </div>
                )}

                {/* DATA TABLE AREA */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-wrap gap-8 items-center justify-between">
                        <div className="flex gap-4">
                            <select
                                className="appearance-none bg-slate-50 border-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-slate-100 transition-all cursor-pointer"
                                value={propertyFilter}
                                onChange={(e) => setPropertyFilter(e.target.value)}
                            >
                                <option value="all">All Residences</option>
                                {properties.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>

                            <select
                                className="appearance-none bg-slate-50 border-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-slate-100 transition-all cursor-pointer"
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                            >
                                <option value="all">All Channels</option>
                                <option value="hostaway">Direct (Hostaway)</option>
                                <option value="google">Google Travel</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Sort Architecture</span>
                            <select
                                className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-slate-900 focus:ring-0 cursor-pointer"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="newest">Chronological</option>
                                <option value="highest">By Rating</option>
                            </select>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                                <th className="px-8 py-6">Guest Identity</th>
                                <th className="px-8 py-6">Sentiment</th>
                                <th className="px-8 py-6">Feedback Extract</th>
                                <th className="px-8 py-6 text-right">Visibility Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {processedReviews.map(review => (
                                <tr key={review.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="font-bold text-slate-900 mb-1">{review.guestName}</div>
                                        <Link href={`/property/${review.id}`} className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors flex items-center gap-1">
                                            {review.listingName} <ChevronRight size={10} />
                                        </Link>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex gap-0.5 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={i < review.rating ? "fill-slate-900 text-slate-900" : "text-slate-100"} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{review.source}</span>
                                    </td>
                                    <td className="px-8 py-8 max-w-md">
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-light italic">"{review.comment}"</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center justify-end gap-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${review.isApproved ? 'text-slate-900' : 'text-slate-300'}`}>
                                                {review.isApproved ? 'Published' : 'Internal'}
                                            </span>
                                            <button
                                                onClick={() => toggleApproval(review.id, review.isApproved)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 ${review.isApproved ? 'bg-slate-900' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${review.isApproved ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}