// 'use client'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [newFund, setNewFund] = useState('')
    const [expense, setExpense] = useState({ title: '', category: '', amount: '' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useNavigate()

    useEffect(() => {
        console.log("dahsboard")
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }
            const data = await response.json()
            setUser(data.user)
        } catch (err) {
            router('/login')
            setError('Failed to fetch user data')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateFund = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8000/api/v1/user/fund', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`
                },
                body: JSON.stringify({ fund: parseFloat(newFund) })
            })
            if (!response.ok) {
                throw new Error('Failed to update fund')
            }
            await fetchUserData()
            setNewFund('')
        } catch (err) {
            setError('Failed to update fund')
            console.error(err)
        }
    }

    const addExpense = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8000/api/v1/expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`
                },
                body: JSON.stringify(expense)
            })
            if (!response.ok) {
                throw new Error('Failed to add expense')
            }
            await fetchUserData()
            setExpense({ title: '', category: '', amount: '' })
        } catch (err) {
            setError('Failed to add expense')
            console.error(err)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    }

    if (!user) {
        router.push('/login')
        return null
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Update Fund</h2>
                    <form onSubmit={updateFund} className="space-y-4">
                        <div>
                            <label htmlFor="current-fund" className="block text-sm font-medium text-gray-700">Current Fund</label>
                            <input id="current-fund" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value={user.fund} disabled />
                        </div>
                        <div>
                            <label htmlFor="new-fund" className="block text-sm font-medium text-gray-700">New Fund</label>
                            <input
                                id="new-fund"
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={newFund}
                                onChange={(e) => setNewFund(e.target.value)}
                                placeholder="Enter new fund amount"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Fund</button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
                    <form onSubmit={addExpense} className="space-y-4">
                        <div>
                            <label htmlFor="expense-title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                id="expense-title"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={expense.title}
                                onChange={(e) => setExpense({ ...expense, title: e.target.value })}
                                placeholder="Enter expense title"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                id="expense-category"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={expense.category}
                                onChange={(e) => setExpense({ ...expense, category: e.target.value })}
                                placeholder="Enter expense category"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                id="expense-amount"
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={expense.amount}
                                onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                                placeholder="Enter expense amount"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Expense</button>
                    </form>
                </div>
            </div>
            <div className="mt-4">
                <Link to="/expenses" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    View Expenses
                </Link>
            </div>
        </div>
    )
}

