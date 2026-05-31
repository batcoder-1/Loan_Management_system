import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            // Store token and role in localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)

            // Redirect based on role
            if (data.role === 'borrower') {
                navigate('/my-loans')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
return (
    <div className="login-container">
        <div className="login-card">

            <div className="brand-section">
                <div className="brand-icon">💰</div>
                <h1>LoanFlow</h1>
                <p className="subtitle">
                    Securely manage loans, repayments and borrowers
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="login-btn"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
                <p style={{textAlign: 'center', marginTop: '10px'}}>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </form>

            <div className="test-credentials">
                <h4>Demo Accounts</h4>

                <div className="credential-box">
                    <p><strong>Borrower</strong></p>
                    <p>borrower@lms.com</p>
                    <p>borrower123</p>
                </div>

                <div className="credential-box">
                    <p><strong>Admin</strong></p>
                    <p>admin@lms.com</p>
                    <p>admin123</p>
                </div>

                <div className="credential-box">
                    <p><strong>Sales</strong></p>
                    <p>sales@lms.com</p>
                    <p>sales123</p>
                </div>

                <div className="credential-box">
                    <p><strong>Sanction</strong></p>
                    <p>sanction@lms.com</p>
                    <p>sanction123</p>
                </div>

                <div className="credential-box">
                    <p><strong>Disbursement</strong></p>
                    <p>disbursement@lms.com</p>
                    <p>disbursement123</p>
                </div>

                <div className="credential-box">
                    <p><strong>Collection</strong></p>
                    <p>collection@lms.com</p>
                    <p>collection123</p>
                </div>
            </div>

        </div>
    </div>
)
}
export default Login
