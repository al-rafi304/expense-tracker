import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            console.log('Trying to fetch')
            const response = await axios.post(
                'http://localhost:8000/api/v1/auth/login',
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const token = response.headers.get('Authorization').split(' ')[1]
            // Store the token securely (e.g., in localStorage or httpOnly cookies)
            console.log(token)
            localStorage.setItem('JWT', token);

            alert('Login successful!');
            // Redirect or update the UI
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Login failed. Please try again.';
            console.log(error)
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                        {errorMessage}
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
