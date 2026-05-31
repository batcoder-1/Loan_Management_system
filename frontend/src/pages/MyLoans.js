import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './MyLoans.css'

const MyLoans = () => {
    const [loans, setLoans] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchMyLoans()
    }, [])

    const fetchMyLoans = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await axios.get(
                'http://localhost:5000/loans/my-loans',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setLoans(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching loans')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'applied':
                return 'badge-applied'
            case 'sanctioned':
                return 'badge-sanctioned'
            case 'rejected':
                return 'badge-rejected'
            case 'disbursed':
                return 'badge-disbursed'
            case 'closed':
                return 'badge-closed'
            default:
                return 'badge-default'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'applied':
                return '📋'
            case 'sanctioned':
                return '✓'
            case 'rejected':
                return '✗'
            case 'disbursed':
                return '💰'
            case 'closed':
                return '🎉'
            default:
                return '•'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="myloans-container">
                <div className="loading">Loading your loans...</div>
            </div>
        )
    }

    return (
        <div className="myloans-container">
            <div className="myloans-header">
                <h1>My Loans</h1>
                <button
                    className="apply-btn"
                    onClick={() => navigate('/apply')}
                >
                    + New Loan Application
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loans.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h2>No Loans Yet</h2>
                    <p>You haven't applied for any loans yet. Start by creating a new application.</p>
                    <button
                        className="apply-btn"
                        onClick={() => navigate('/apply')}
                    >
                        Apply for a Loan
                    </button>
                </div>
            ) : (
                <div className="loans-grid">
                    {loans.map(loan => (
                        <div key={loan._id} className="loan-card">
                            <div className="card-header">
                                <div className="loan-id">
                                    <span className="label">Loan ID</span>
                                    <span className="value">{loan._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <span className={`status-badge ${getStatusBadgeClass(loan.status)}`}>
                                    {getStatusIcon(loan.status)} {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                </span>
                            </div>

                            <div className="card-body">
                                <div className="info-row">
                                    <span className="label">Loan Amount</span>
                                    <span className="value amount">₹{loan.loanAmount?.toLocaleString() || 'N/A'}</span>
                                </div>

                                <div className="info-row">
                                    <span className="label">Total Repayment</span>
                                    <span className="value">₹{loan.totalRepayment?.toLocaleString() || 'N/A'}</span>
                                </div>

                                {loan.interestAmount && (
                                    <div className="info-row">
                                        <span className="label">Interest (12% p.a.)</span>
                                        <span className="value">₹{loan.interestAmount?.toLocaleString() || 'N/A'}</span>
                                    </div>
                                )}

                                {loan.tenure && (
                                    <div className="info-row">
                                        <span className="label">Tenure</span>
                                        <span className="value">{loan.tenure} days</span>
                                    </div>
                                )}

                                {loan.status === 'disbursed' && (
                                    <>
                                        <div className="info-row">
                                            <span className="label">Amount Paid</span>
                                            <span className="value paid">₹{loan.amountPaid?.toLocaleString() || '0'}</span>
                                        </div>

                                        <div className="info-row">
                                            <span className="label">Outstanding</span>
                                            <span className="value outstanding">₹{(loan.totalRepayment - loan.amountPaid)?.toLocaleString() || 'N/A'}</span>
                                        </div>

                                        {loan.payments && loan.payments.length > 0 && (
                                            <div className="payments-section">
                                                <h4>Payment History</h4>
                                                <div className="payments-list">
                                                    {loan.payments.map((payment, idx) => (
                                                        <div key={idx} className="payment-item">
                                                            <div className="payment-info">
                                                                <span className="payment-utr">UTR: {payment.utrNumber}</span>
                                                                <span className="payment-date">{formatDate(payment.date)}</span>
                                                            </div>
                                                            <span className="payment-amount">₹{payment.amount?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {loan.status === 'rejected' && loan.rejectionReason && (
                                    <div className="rejection-reason">
                                        <span className="label">Rejection Reason</span>
                                        <p className="reason-text">{loan.rejectionReason}</p>
                                    </div>
                                )}

                                {loan.createdAt && (
                                    <div className="apply-date">
                                        <span className="label">Applied on</span>
                                        <span className="value">{formatDate(loan.createdAt)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                <div className={`status-summary ${loan.status}`}>
                                    {loan.status === 'applied' && '⏳ Your application is under review'}
                                    {loan.status === 'sanctioned' && '✓ Your loan has been approved'}
                                    {loan.status === 'rejected' && '✗ Your application was rejected'}
                                    {loan.status === 'disbursed' && '💰 Your loan has been disbursed'}
                                    {loan.status === 'closed' && '🎉 Your loan has been fully repaid'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="footer-actions">
                <button
                    className="refresh-btn"
                    onClick={fetchMyLoans}
                >
                    🔄 Refresh
                </button>
                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('role')
                        navigate('/login')
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default MyLoans
