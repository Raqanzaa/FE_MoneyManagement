// src/TransactionForm.js

import React, { useState } from 'react';

// The `onTransactionCreated` prop is a function passed down from the Dashboard
// to notify it when a new transaction is successfully created.
const TransactionForm = ({ onTransactionCreated }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Defaults to today
  const [isExpense, setIsExpense] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission which reloads the page
    setError('');

    if (!description || !amount || !date) {
      setError('Please fill out all fields.');
      return;
    }

    // The `onTransactionCreated` function will handle the actual API call
    try {
      await onTransactionCreated({
        description,
        amount: parseFloat(amount),
        date,
        is_expense: isExpense,
      });
      // Reset form fields on successful submission
      setDescription('');
      setAmount('');
    } catch (err) {
      setError('Failed to create transaction. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Add New Transaction</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select value={isExpense} onChange={(e) => setIsExpense(e.target.value === 'true')}>
        <option value="true">Expense</option>
        <option value="false">Income</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
};

export default TransactionForm;