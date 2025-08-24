// src/Dashboard.js

import React, { useState, useEffect } from "react";
import apiClient from "./apiClient"; // Import our new API client

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
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
    };

    fetchTransactions();
  }, []); // The empty array [] means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading your transactions...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <h2>Your Transactions</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              {t.date}: {t.description} - ${t.amount}
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
