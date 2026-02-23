import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantFood, createFood, getRestaurantRequests, approveRequest, rejectRequest } from '../api';
import { UtensilsCrossed, PlusCircle, Check, X, LogOut, Package } from 'lucide-react';

export default function RestaurantDashboard() {
    const [user, setUser] = useState(null);
    const [foods, setFoods] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ foodName: '', quantity: 1, expiryTime: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser || loggedInUser.role !== 'RESTAURANT') {
            navigate('/login');
        } else {
            setUser(loggedInUser);
            loadData(loggedInUser.id);
        }
    }, [navigate]);

    const loadData = async (restaurantId) => {
        setLoading(true);
        try {
            const foodsData = await getRestaurantFood(restaurantId);
            const requestsData = await getRestaurantRequests(restaurantId);
            setFoods(foodsData);
            setRequests(requestsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFood = async (e) => {
        e.preventDefault();
        if (!formData.foodName || !formData.expiryTime) return;

        try {
            await createFood(user.id, {
                ...formData,
                expiryTime: formData.expiryTime + ':00' // append seconds for LocalDateTime
            });
            setFormData({ foodName: '', quantity: 1, expiryTime: '' });
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
                        <UtensilsCrossed size={28} color="var(--primary)" />
                        Restaurant Portal
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
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Manage your surplus food listings and incoming requests.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>

                    {/* Create Listing Section */}
                    <div className="glass-panel animate-slide-up stagger-1" style={{ padding: '2rem', alignSelf: 'start' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                            <PlusCircle color="var(--primary)" /> Add New Listing
                        </h3>
                        <form onSubmit={handleCreateFood}>
                            <div className="form-group">
                                <label>Food Item</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.foodName}
                                    onChange={e => setFormData({ ...formData, foodName: e.target.value })}
                                    placeholder="e.g. 50 packs of rice"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity (Servings/Packs)</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiry Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={formData.expiryTime}
                                    onChange={e => setFormData({ ...formData, expiryTime: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn-primary" type="submit" style={{ width: '100%' }}>Publish Listing</button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Active Listings */}
                        <div className="glass-panel animate-slide-up stagger-2" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Your Listings</h3>
                            {foods.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>You have not posted any food yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {foods.map((food, idx) => (
                                        <div key={food.id} className="hover-scale" style={{ background: 'rgba(15,23,42,0.5)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{food.foodName}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>x {food.quantity}</span>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expires: {new Date(food.expiryTime).toLocaleString()}</div>
                                            </div>
                                            <span className={`badge badge-${food.status === 'AVAILABLE' ? 'success' :
                                                food.status === 'ACCEPTED' ? 'warning' : 'primary'
                                                }`}>
                                                {food.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Incoming Requests */}
                        <div className="glass-panel animate-slide-up stagger-3" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Incoming Requests</h3>
                            {requests.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No requests pending for your food.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {requests.map((req, idx) => (
                                        <div key={req.id} className="hover-scale" style={{ background: 'rgba(15,23,42,0.5)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                                    <Package size={24} color="var(--primary)" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{req.trust?.name} requested {req.food?.foodName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status: <span style={{ color: req.status === 'PENDING' ? '#fbbf24' : req.status === 'APPROVED' ? '#34d399' : '#f87171' }}>{req.status}</span></div>
                                                </div>
                                            </div>

                                            {req.status === 'PENDING' && (
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button
                                                        className="btn-primary"
                                                        style={{ padding: '0.5rem 1rem', background: 'var(--success)', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                                                        onClick={async () => {
                                                            await approveRequest(req.id);
                                                            loadData(user.id);
                                                        }}
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                    <button
                                                        className="btn-outline"
                                                        style={{ padding: '0.5rem 1rem', borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                                                        onClick={async () => {
                                                            await rejectRequest(req.id);
                                                            loadData(user.id);
                                                        }}
                                                    >
                                                        <X size={16} /> Reject
                                                    </button>
                                                </div>
                                            )}
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
