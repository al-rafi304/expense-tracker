import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard"
import Expenses from "./pages/expenses";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/expenses" element={<Expenses />} />
            </Routes>
        </Router>
    )
}

export default App
