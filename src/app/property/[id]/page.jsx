'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ChevronLeft, MapPin, Home, Users, ShieldCheck, Calendar, Info, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetails() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showComingSoon, setShowComingSoon] = useState(false);

    const propertyImages = [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1600"
    ];

    useEffect(() => {
        fetch(`/api/property/${id}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="w-16 h-[1px] bg-slate-100 overflow-hidden">
                <div className="w-1/2 h-full bg-slate-900 animate-loading-bar" />
            </div>
        </div>
    );

    const propertyName = reviews[0]?.listingName || "Premium Residence";

    return (
        <div className="min-h-screen bg-white pb-32 font-sans antialiased text-slate-900">
            {/* Modal - Feature refinement */}
            {showComingSoon && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/60 backdrop-blur-xl">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 max-w-lg w-full shadow-2xl text-center">
                        <div className="flex justify-center mb-6"><div className="w-12 h-[1px] bg-slate-900" /></div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">Experience in Design</h2>
                        <p className="text-slate-500 font-light leading-relaxed mb-10">We are currently perfecting the booking flow for this specific residence to ensure a seamless guest transition.</p>
                        <button onClick={() => setShowComingSoon(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em]">Return to Overview</button>
                    </div>
                </div>
            )}

            <nav className="h-20 px-10 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-50">
                <Link href="/dashboard" className="group flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Portfolio Manager
                </Link>
                <div className="text-lg font-black tracking-tighter italic">FLEX LIVING</div>
                <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <button className="text-slate-900 border-b border-slate-900 pb-1">Review Suite</button>
                    <button onClick={() => setShowComingSoon(true)} className="hover:text-slate-900 transition-colors">Digital Concierge</button>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-10 mt-12">
                {/* Visual Showcase */}
                <section className="relative group mb-20 overflow-hidden rounded-[2.5rem] aspect-[21/9] bg-slate-50 shadow-sm">
                    <div className="absolute inset-0 flex transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                        {propertyImages.map((src, i) => (
                            <img key={i} src={src} className="min-w-full h-full object-cover" alt="Property" />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + propertyImages.length) % propertyImages.length)} className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % propertyImages.length)} className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                        <ChevronRight size={24} />
                    </button>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                    <div className="lg:col-span-8">
                        <div className="mb-16">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Residency Elite</span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><MapPin size={14} /> Shoreditch, London</span>
                            </div>
                            <h1 className="text-6xl font-bold tracking-tighter text-slate-900 mb-8 leading-[1.1]">{propertyName}</h1>
                            <div className="flex gap-12 py-10 border-y border-slate-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900"><Home size={20} /></div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-slate-900">The Space</p>
                                        <p className="text-xs text-slate-400 font-medium">Entire Loft Residence</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900"><Users size={20} /></div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-slate-900">Capacity</p>
                                        <p className="text-xs text-slate-400 font-medium">Up to 4 Guests</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* REVIEWS GRID */}
                        <section>
                            <div className="flex items-center justify-between mb-16">
                                <h3 className="text-4xl font-bold tracking-tight">Guest Narratives</h3>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Verified Stays Only</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                                {reviews.map(r => (
                                    <div key={r.id} className="group">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold uppercase">{r.guestName.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest text-slate-900">{r.guestName}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">{new Date(r.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-slate-900 mb-4">{[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}</div>
                                        <p className="text-slate-500 font-light leading-relaxed italic group-hover:text-slate-900 transition-colors duration-500">"{r.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR WIDGET */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-32 bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                            <div className="mb-10">
                                <p className="text-[10px] text-slate-300 uppercase font-black tracking-[0.3em] mb-4 text-center">Standard Rate</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-5xl font-light tracking-tighter text-slate-900">£150</span>
                                    <span className="text-sm text-slate-300 italic">/ night</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-10">
                                <button onClick={() => setShowComingSoon(true)} className="w-full flex justify-between p-5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                                    <span>Check Availability</span>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </button>
                                <button onClick={() => setShowComingSoon(true)} className="w-full flex justify-between p-5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                                    <span>Guest Count</span>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </button>
                            </div>

                            <button onClick={() => setShowComingSoon(true)} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                                Initialize Reservation
                            </button>

                            <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Includes curated maintenance</p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}