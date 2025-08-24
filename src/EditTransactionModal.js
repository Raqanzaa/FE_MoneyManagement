// src/EditTransactionModal.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const EditTransactionModal = ({ isOpen, onRequestClose, transaction, onTransactionUpdated }) => {
    const [formData, setFormData] = useState({});

    // When the transaction prop changes, update the form data
    useEffect(() => {
        if (transaction) {
            setFormData({
                ...transaction,
                date: transaction.date || new Date().toISOString().slice(0, 10),
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onTransactionUpdated(formData.id, {
                ...formData,
                amount: parseFloat(formData.amount),
            });
            onRequestClose(); // Close the modal on success
        } catch (err) {
            console.error("Failed to update transaction", err);
            // Optionally, show an error message in the modal
        }
    };

    if (!transaction) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Transaction"
        >
            <h2>Edit Transaction</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                />
                {/* Add more fields like category, is_expense as needed */}
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default EditTransactionModal;