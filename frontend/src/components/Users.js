import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = () => {
        setIsLoading(true);
        axios.get('http://localhost:8000/users')
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users. Please try again later.');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:8000/users/${id}`)
                .then(response => {
                    console.log(response.data);
                    fetchUsers();
                })
                .catch(error => {
                    console.error(`Error deleting user ${id}:`, error);
                    setError('Failed to delete user. Please try again.');
                });
        }
    };

    return (
        <div className='user-container'>
            <h2>Users</h2>
            
            {isLoading ? (
                <div className="loading">Loading users...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : users.length === 0 ? (
                <div className="empty-state">No users found</div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="desktop-view">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                className='delete-button'
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mobile Cards */}
                    <div className="mobile-view">
                        {users.map(user => (
                            <div key={user.id} className="user-card">
                                <div className="card-row">
                                    <span className="card-label">ID:</span>
                                    <span>{user.id}</span>
                                </div>
                                <div className="card-row">
                                    <span className="card-label">Name:</span>
                                    <span>{user.name}</span>
                                </div>
                                <div className="card-row">
                                    <span className="card-label">Email:</span>
                                    <span className="card-email">{user.email}</span>
                                </div>
                                <button 
                                    onClick={() => handleDelete(user.id)} 
                                    className='delete-button'
                                >
                                    Delete User
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Users;