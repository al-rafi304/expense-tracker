'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Expenses() {
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [groupBy, setGroupBy] = useState('date');
    const router = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, [groupBy]);

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/expense/filter?groupBy=${groupBy}&sortBy=des`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }

            const data = await response.json();
            setFilteredExpenses(data.filteredExpenses);
        } catch (err) {
            setError('Failed to fetch expenses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateExpense = async (id, updatedExpense) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/expense/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                },
                body: JSON.stringify(updatedExpense),
            });

            if (!response.ok) {
                throw new Error('Failed to update expense');
            }

            await fetchExpenses();
        } catch (err) {
            setError('Failed to update expense');
            console.error(err);
        }
    };

    const removeExpense = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/expense/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove expense');
            }

            await fetchExpenses();
        } catch (err) {
            setError('Failed to remove expense');
            console.error(err);
        }
    };

    const toggleExpand = (date) => {
        setFilteredExpenses((prevExpenses) =>
            prevExpenses.map((group) =>
                group._id === date ? { ...group, expanded: !group.expanded } : group
            )
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Expenses</h1>
            {/* GroupBy Switch */}
            <div className="mb-4">
                <button
                    onClick={() => setGroupBy('date')}
                    className={`px-4 py-2 rounded ${groupBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Group by Date
                </button>
                <button
                    onClick={() => setGroupBy('category')}
                    className={`ml-2 px-4 py-2 rounded ${groupBy === 'category' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Group by Category
                </button>
            </div>
            {filteredExpenses.map(({ _id: date, totalAmount, expenses, expanded }) => (
                <div key={date} className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
                    <div
                        className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                        onClick={() => toggleExpand(date)}
                    >
                        <h2 className="text-lg font-semibold">{date}</h2>
                        <div>
                            <span className="font-bold">Total: ${totalAmount.toFixed(2)}</span>
                            <span className="ml-2">{expanded ? '▲' : '▼'}</span>
                        </div>
                    </div>
                    {expanded && (
                        <div className="p-4">
                            {expenses.map((expense) => (
                                <div key={expense._id} className="mb-2 p-2 border-b">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold">{expense.title}</span> -
                                            <span className="text-gray-600"> {expense.category}</span>
                                        </div>
                                        <span className="font-bold">${expense.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-2 flex justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                const updatedTitle = prompt('Enter new title', expense.title);
                                                const updatedCategory = prompt('Enter new category', expense.category);
                                                const updatedAmount = prompt('Enter new amount', expense.amount);
                                                if (updatedTitle && updatedCategory && updatedAmount) {
                                                    updateExpense(expense._id, {
                                                        title: updatedTitle,
                                                        category: updatedCategory,
                                                        amount: parseFloat(updatedAmount),
                                                    });
                                                }
                                            }}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to remove this expense?')) {
                                                    removeExpense(expense._id);
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <div className="mt-4">
                <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
