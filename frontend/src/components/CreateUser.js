import React, { useState } from 'react';
import axios from 'axios';
import './CreateUser.css';

const CreateUser = () => {
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        
        const { name, email } = newUser;
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:8000/users', newUser);
            console.log('User created:', response.data);
            setSuccess('User created successfully!');
            // Reset form
            setNewUser({ name: '', email: '' });
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.response?.data?.message || 'Error creating user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    return (
        <div className="create-user-container">
            <div className="create-user-card">
                <h2>Create New User</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleCreateUser} className="create-user-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            disabled={loading}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="button-loading">
                                <span className="spinner"></span>
                                Creating...
                            </span>
                        ) : (
                            'Create User'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;