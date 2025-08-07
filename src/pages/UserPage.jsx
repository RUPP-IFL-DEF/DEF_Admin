import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/User.css';

// Helper component to show avatar image or fallback initials circle
const AvatarWithFallback = ({ username, avatarUrl }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className="avatar"
        style={{ width: 40, height: 40, borderRadius: '50%' }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="avatar-fallback"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#fff',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        fontSize: '1rem',
      }}
    >
      {getInitials(username)}
    </div>
  );
};

const API_URL = 'http://localhost:4000/api/users/users';

const initialForm = {
  username: '',
  phoneNumber: '',
  email: '',
  avatarUrl: '',
};

const User = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      alert('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: form.username,
        phoneNumber: form.phoneNumber,
        email: form.email,
        profile: {
          avatarUrl: form.avatarUrl,
        },
      };

      if (editingUserId) {
        await axios.put(`${API_URL}/${editingUserId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      await fetchUsers();
      setForm(initialForm);
      setEditingUserId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      avatarUrl: user.profile?.avatarUrl || '',
    });
    setEditingUserId(user._id);
    setShowModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.profile?.fullName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phoneNumber?.includes(term)
    );
  });

  return (
    <div className="user-page">
      <h2 className="crud-title">User Management</h2>

      <div className="user-actions">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          className="add-user-btn"
          onClick={() => {
            setShowModal(true);
            setForm(initialForm);
            setEditingUserId(null);
          }}
        >
          + Add User
        </button>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Avatar</th>
              <th>Username</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>
                  <AvatarWithFallback
                    username={user.username || 'N/A'}
                    avatarUrl={user.profile?.avatarUrl}
                  />
                </td>
                <td>{user.username || 'N/A'}</td>
                <td>{user.phoneNumber || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400 }}
          >
            <h3>{editingUserId ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Avatar URL"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              />
              <div
                className="modal-buttons"
                style={{ marginTop: 10, display: 'flex', gap: 10 }}
              >
                <button type="submit">{editingUserId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
