// src/Dashboard.js

import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import apiClient from "./apiClient";
import TransactionForm from "./TransactionForm";
import SpendingChart from "./SpendingChart";
import EditTransactionModal from "./EditTransactionModal";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            // Use the apiClient to make a GET request to the /transactions/ endpoint
            const response = await apiClient.get("/transactions/");
            setTransactions(response.data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            setError("Failed to load transactions. You might be logged out.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array to ensure it doesn't change

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleCreateTransaction = async (transactionData) => {
        try {
            await apiClient.post("/transactions/", transactionData);
            fetchTransactions();
        } catch (err) {
            console.error("Failed to create transaction:", err);
            throw err;
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await apiClient.delete(`/transactions/${transactionId}/`);
                fetchTransactions();
            } catch (err) {
                console.error('Failed to delete transaction:', err);
                setError('Could not delete the transaction. Please try again.');
            }
        }
    };

    const handleUpdateTransaction = async (id, updatedData) => {
        try {
            await apiClient.put(`/transactions/${id}/`, updatedData);
            fetchTransactions();
        } catch (err) {
            console.error('Failed to update transaction:', err);
            setError('Could not update the transaction.');
            throw err;
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(false);
    };

    if (loading) {
        return <div>Loading your transactions...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <TransactionForm onTransactionCreated={handleCreateTransaction} />
            <SpendingChart transactions={transactions} />
            <h2>Your Transactions</h2>
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((t) => (
                        <li key={t.id}>
                            {t.date}: {t.description} ({t.category || 'Uncategorized'}) - ${t.amount}
                            <button
                                onClick={() => openEditModal(t)}
                                style={{ marginLeft: '10px' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteTransaction(t.id)}
                                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no transactions yet.</p>
            )}

            <EditTransactionModal
                isOpen={isModalOpen}
                onRequestClose={closeEditModal}
                transaction={editingTransaction}
                onTransactionUpdated={handleUpdateTransaction}
            />
        </div>
    );
};

export default Dashboard;
