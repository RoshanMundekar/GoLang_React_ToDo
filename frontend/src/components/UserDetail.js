import React, { useState } from 'react';
import axios from 'axios';
import './UserDetail.css';

const UserDetail = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fetchUserById = (e) => {
        e.preventDefault();
        
        if (!userId.trim()) {
            setError('Please enter a User ID');
            return;
        }
        
        setLoading(true);
        setError('');
        setUser(null);
        
        axios.get(`http://localhost:8000/users/${userId}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(`Error fetching user ${userId}:`, error);
                setError('User not found. Please check the ID and try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleReset = () => {
        setUserId('');
        setUser(null);
        setError('');
    };

    return (
        <div className='user-detail-container'>
            <div className="user-detail-card">
                <h2>User Details</h2>
                
                <form onSubmit={fetchUserById} className="user-search-form">
                    <div className="form-group">
                        <label htmlFor="userId">Enter User ID</label>
                        <div className="input-with-button">
                            <input
                                id="userId"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter user ID"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="search-button"
                                disabled={loading || !userId.trim()}
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </form>
                
                {error && <div className="error-message">{error}</div>}
                
                {user && (
                    <div className="user-details-display">
                        <div className="user-detail-row">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{user.id}</span>
                        </div>
                        <div className="user-detail-row">
                            <span className="detail-label">Name:</span>
                            <span className="detail-value">{user.name}</span>
                        </div>
                        <div className="user-detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                        <button 
                            onClick={handleReset} 
                            className="reset-button"
                        >
                            Search Another User
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;