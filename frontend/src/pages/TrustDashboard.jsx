import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableFood, getTrustRequests, acceptFood } from '../api';
import { ShieldCheck, LogOut, CheckCircle, Clock } from 'lucide-react';

export default function TrustDashboard() {
    const [user, setUser] = useState(null);
    const [availableFoods, setAvailableFoods] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser || loggedInUser.role !== 'TRUST') {
            navigate('/login');
        } else {
            setUser(loggedInUser);
            loadData(loggedInUser.id);
        }
    }, [navigate]);

    const loadData = async (trustId) => {
        setLoading(true);
        try {
            const foodsData = await getAvailableFood();
            const requestsData = await getTrustRequests(trustId);
            setAvailableFoods(foodsData);
            setMyRequests(requestsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestFood = async (foodId) => {
        try {
            await acceptFood(foodId, user.id);
            loadData(user.id);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user || loading) return <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

    return (
        <div className="page-wrapper">
            <nav className="app-header">
                <div className="container header-content">
                    <div className="logo">
                        <ShieldCheck size={28} color="var(--secondary)" />
                        Trust Portal
                    </div>
                    <div className="nav-links">
                        <span style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}</span>
                        <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container animate-fade-in" style={{ marginTop: '2rem' }}>
                <h1 className="page-title">Available Donations</h1>
                <p className="page-subtitle">Browse surplus food available for collection today.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem', marginTop: '2rem' }}>

                    {/* Main Feed: Available Food */}
                    <div className="dashboard-grid" style={{ marginTop: 0 }}>
                        {availableFoods.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No food is currently available for pickup.</p>
                            </div>
                        ) : (
                            availableFoods.map((food, idx) => (
                                <div key={food.id} className={`glass-panel hover-lift animate-slide-up stagger-${(idx % 5) + 1}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ background: 'rgba(132, 204, 22, 0.15)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                        <span className="animate-float" style={{ fontSize: '3rem', display: 'inline-block' }}>🥗</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{food.foodName}</h3>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem', flexGrow: 1 }}>
                                        <p><strong>Quantity:</strong> {food.quantity} servings</p>
                                        <p><strong>Donor:</strong> {food.restaurant?.name}</p>
                                        <p><strong>Expires:</strong> {new Date(food.expiryTime).toLocaleString()}</p>
                                    </div>
                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%' }}
                                        onClick={() => handleRequestFood(food.id)}
                                    >
                                        Request Pickup
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />

                    {/* My Requests Tracker */}
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Requests Tracker</h2>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            {myRequests.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>You haven't requested any food yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                    {myRequests.map((req, idx) => (
                                        <div key={req.id} className={`hover-scale animate-slide-up stagger-${(idx % 5) + 1}`} style={{ background: 'rgba(15,23,42,0.5)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: `4px solid ${req.status === 'APPROVED' ? '#34d399' : req.status === 'PENDING' ? '#fbbf24' : '#f87171'}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 600 }}>{req.food?.foodName}</span>
                                                <span className={`badge badge-${req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}`}>
                                                    {req.status === 'PENDING' ? <Clock size={12} style={{ marginRight: 4 }} /> : <CheckCircle size={12} style={{ marginRight: 4 }} />} {req.status}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Donor: {req.food?.restaurant?.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
