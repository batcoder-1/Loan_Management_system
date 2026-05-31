import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Signup.css'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'borrower'
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        if (!formData.name.trim()) {
            setError('Name is required')
            setLoading(false)
            return
        }

        if (!formData.email.trim()) {
            setError('Email is required')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const response = await fetch(
                'http://localhost:5000/auth/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Signup failed'
                )
            }

            navigate('/login', {
                state: {
                    message:
                        'Account created successfully. Please login.'
                }
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">

                <div className="brand-section">
                    <div className="brand-icon">💳</div>

                    <h1>LoanFlow</h1>

                    <p className="subtitle">
                        Create your borrower account and start managing loans efficiently
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            Account Type
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="borrower">
                                Borrower
                            </option>
                        </select>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="signup-btn"
                    >
                        {loading
                            ? 'Creating Account...'
                            : 'Create Account'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account?

                    <Link to="/login">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Signup