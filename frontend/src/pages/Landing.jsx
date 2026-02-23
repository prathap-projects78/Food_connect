import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, UtensilsCrossed, ShieldCheck } from 'lucide-react';

export default function Landing() {
    return (
        <div className="page-wrapper" style={{ padding: 0 }}>
            {/* Navbar */}
            <nav className="app-header">
                <div className="container header-content">
                    <div className="logo">
                        <HeartHandshake size={28} color="var(--primary)" />
                        FoodConnect
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn-primary">Join Now</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container animate-fade-in" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', borderRadius: '999px', marginBottom: '2rem', fontWeight: 600 }}>
                    Bridge the Gap Between Surplus and Need
                </div>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem' }}>
                    Don't Waste It, <br />
                    <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        Donate It.
                    </span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    FoodConnect is a platform linking generous restaurants with trusted organizations to end food waste and feed those in need. Let's make a difference, one meal at a time.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Get Started
                    </Link>
                    <Link to="/login" className="btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Login
                    </Link>
                </div>
            </main>

            {/* Features Grid */}
            <section className="container delay-200 animate-fade-in" style={{ paddingBottom: '6rem' }}>
                <div className="dashboard-grid">
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <UtensilsCrossed size={32} color="var(--primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Restaurants</h3>
                        <p style={{ color: 'var(--text-muted)' }}>List your surplus food easily and quickly. Monitor requests from trusted organizations and approve pickups instantly.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(236, 72, 153, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <ShieldCheck size={32} color="var(--secondary)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Trusts</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Browse available food listings in your area. Request food from multiple sources and feed your community reliably.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <HeartHandshake size={32} color="var(--success)" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Impact Tracking</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Watch the magic happen. Every successful transaction is recorded, ensuring transparency and measuring your real-world impact.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
