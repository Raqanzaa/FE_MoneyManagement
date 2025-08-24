// src/Dashboard.js

import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import apiClient from "./apiClient";
import TransactionForm from "./TransactionForm";
import SpendingChart from "./SpendingChart";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            // After successfully creating, refresh the list of transactions
            fetchTransactions();
        } catch (err) {
            console.error("Failed to create transaction:", err);
            // Re-throw the error so the form component can display a message
            throw err;
        }
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
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no transactions yet.</p>
            )}
        </div>
    );
};

export default Dashboard;
