import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Book.css';

const API_URL = 'http://localhost:4000/api/books';

const shelves = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12'];

const initialForm = {
    BookID: '',
    name: '',
    shelfLocation: 'A1',
    available: true,
    images: [], // {file: File, url: string}
};

const BookCRUD = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingBookId, setEditingBookId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // images for upload & preview
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(API_URL);
            setBooks(res.data);
        } catch (err) {
            alert('Failed to fetch books');
        }
    };

    // Search filter
    const filteredBooks = books.filter((book) => {
        const term = searchTerm.toLowerCase();
        return (
            (book.BookID || '').toLowerCase().includes(term) ||
            (book.name || '').toLowerCase().includes(term)
        );
    });

    // Handle image selection (multiple allowed)
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
    };

    // Remove image preview by index
    const handleDeleteImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            setBooks((prev) => prev.filter((b) => b._id !== id));
        } catch (err) {
            alert('Failed to delete book');
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.BookID || !form.name) {
            alert('Book ID and Name are required');
            return;
        }

        const formData = new FormData();
        formData.append('BookID', form.BookID);
        formData.append('name', form.name);
        formData.append('shelfLocation', form.shelfLocation);
        formData.append('available', form.available);

        // Append images files
        images.forEach((imgObj) => {
            if (imgObj.file) {
                formData.append('images', imgObj.file);
            } else if (imgObj.url) {
                formData.append('existingImages', imgObj.url); // if backend handles existing URLs
            }
        });

        try {
            if (editingBookId) {
                await axios.put(`${API_URL}/${editingBookId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            fetchBooks();
            setForm(initialForm);
            setImages([]);
            setEditingBookId(null);
            setShowModal(false);
        } catch (err) {
            alert('Failed to save book');
            console.error(err);
        }
    };

    const handleEdit = (book) => {
        setForm({
            BookID: book.BookID || '',
            name: book.name || '',
            shelfLocation: book.shelfLocation || 'A1',
            available: book.available ?? true,
        });

        setImages(book.images?.map((url) => ({ file: null, url })) || []);
        setEditingBookId(book._id);
        setShowModal(true);
    };

    return (
        <div className="user-page">
            <h2 className="crud-title">Book Management</h2>

            <div className="user-actions" style={{ marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder="Search by Book ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button
                    className="add-user-btn"
                    onClick={() => {
                        setShowModal(true);
                        setForm(initialForm);
                        setImages([]);
                        setEditingBookId(null);
                    }}
                >
                    + Add Book
                </button>
            </div>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Image</th>
                            <th>Book ID</th>
                            <th>Name</th>
                            <th>Shelf</th>
                            <th>Availability</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>
                                    No books found.
                                </td>
                            </tr>
                        ) : (
                            filteredBooks.map((book, i) => (
                                <tr key={book._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {book.images?.length > 0 ? (
                                            <img
                                                src={book.images[0]}
                                                alt="Book"
                                                style={{ width: 40, height: 40, borderRadius: '4px', objectFit: 'cover' }}
                                                onError={(e) => (e.target.style.display = 'none')}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '4px',
                                                    backgroundColor: '#888',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td>{book.BookID}</td>
                                    <td>{book.name}</td>
                                    <td>{book.shelfLocation}</td>
                                    <td style={{ fontWeight: 'bold', color: book.available ? 'green' : 'red' }}>
                                        {book.available ? 'Available' : 'Unavailable'}
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(book)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                    onKeyDown={(e) => e.key === 'Escape' && setShowModal(false)}
                    tabIndex={-1}
                >
                    <div
                        className="modal-content book-modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <h3 id="modal-title" className="modal-title">
                            {editingBookId ? 'Edit Book' : 'Add Book'}
                        </h3>

                        <form className="book-form" onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="bookId">
                                    Book ID <span className="required">*</span>
                                </label>
                                <input
                                    id="bookId"
                                    className="form-input"
                                    type="text"
                                    placeholder="Enter Book ID"
                                    value={form.BookID}
                                    onChange={(e) => setForm({ ...form, BookID: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bookName">
                                    Name <span className="required">*</span>
                                </label>
                                <input
                                    id="bookName"
                                    className="form-input"
                                    type="text"
                                    placeholder="Enter Book Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shelfLocation">Shelf Location</label>
                                <select
                                    id="shelfLocation"
                                    className="form-select"
                                    value={form.shelfLocation}
                                    onChange={(e) => setForm({ ...form, shelfLocation: e.target.value })}
                                >
                                    {shelves.map((shelf) => (
                                        <option key={shelf} value={shelf}>
                                            {shelf}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Availability</label>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="available"
                                            checked={form.available === true}
                                            onChange={() => setForm({ ...form, available: true })}
                                        />{' '}
                                        Available
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="unavailable"
                                            checked={form.available === false}
                                            onChange={() => setForm({ ...form, available: false })}
                                        />{' '}
                                        Unavailable
                                    </label>
                                </div>
                            </div>
                            <div className="form-group upload-group">
                                <label className="upload-label" htmlFor="upload-image">
                                    Upload Image(s)
                                </label>
                                <input
                                    id="upload-image"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="upload-input"
                                />
                            </div>

                            {/* Show only 1 image preview below form if exists */}
                            {images.length > 0 && (
                                <div className="images-preview-bottom">
                                    <div className="image-wrapper-small">
                                        <img
                                            src={images[0].url}
                                            alt="preview"
                                            className="preview-image-small"
                                        />
                                        <button
                                            type="button"
                                            className="delete-image-btn"
                                            onClick={() => handleDeleteImage(0)}
                                            title="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            )}


                            <div className="modal-buttons">
                                <button
                                    type="submit"
                                    className={`btn ${editingBookId ? 'btn-primary' : 'btn-success'}`}
                                >
                                    {editingBookId ? 'Update' : 'Add'}
                                </button>
                                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
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

export default BookCRUD;
