import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

const Dashboard = () => {
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [data, setData] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')

    // Form states for different actions
    const [approvalForm, setApprovalForm] = useState({
        loanId: '',
        action: 'approve',
        rejectionReason: ''
    })

    const [paymentForm, setPaymentForm] = useState({
        loanId: '',
        utrNumber: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            let endpoint = ''

            switch (userRole) {
                case 'admin':
                    endpoint = 'http://localhost:5000/admin/leads'
                    break
                case 'sales':
                    endpoint = 'http://localhost:5000/admin/leads'
                    break
                case 'sanction':
                    endpoint = 'http://localhost:5000/admin/applied-loans'
                    break
                case 'disbursement':
                    endpoint = 'http://localhost:5000/admin/sanctioned-loans'
                    break
                case 'collection':
                    endpoint = 'http://localhost:5000/admin/disbursed-loans'
                    break
                default:
                    throw new Error('Invalid role')
            }

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setData(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data')
        } finally {
            setLoading(false)
        }
    }, [userRole, token])

    useEffect(() => {
        setRole(userRole)
        if (userRole) {
            fetchData()
        }
    }, [userRole, fetchData])

    const handleApprove = (loanId) => {
        setApprovalForm({
            ...approvalForm,
            loanId,
            action: 'approve'
        })
        setSelectedItem({ id: loanId, type: 'approval' })
        setIsModalOpen(true)
    }

    const handleReject = (loanId) => {
        setApprovalForm({
            ...approvalForm,
            loanId,
            action: 'reject'
        })
        setSelectedItem({ id: loanId, type: 'approval' })
        setIsModalOpen(true)
    }

    const submitApproval = async () => {
        if (approvalForm.action === 'reject' && !approvalForm.rejectionReason.trim()) {
            setError('Rejection reason is required')
            return
        }

        setActionLoading(true)

        try {
            await axios.post(
                'http://localhost:5000/admin/sanction',
                {
                    loanId: approvalForm.loanId,
                    action: approvalForm.action,
                    rejectionReason: approvalForm.rejectionReason
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setIsModalOpen(false)
            setApprovalForm({ loanId: '', action: 'approve', rejectionReason: '' })
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing request')
        } finally {
            setActionLoading(false)
        }
    }

    const handleDisburse = async (loanId) => {
        setActionLoading(true)

        try {
            await axios.post(
                'http://localhost:5000/admin/disburse',
                { loanId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Error disbursing loan')
        } finally {
            setActionLoading(false)
        }
    }

    const handleRecordPayment = (loanId) => {
        setPaymentForm({
            ...paymentForm,
            loanId
        })
        setSelectedItem({ id: loanId, type: 'payment' })
        setIsModalOpen(true)
    }

    const submitPayment = async () => {
        if (!paymentForm.utrNumber.trim()) {
            setError('UTR Number is required')
            return
        }
        if (!paymentForm.amount || paymentForm.amount <= 0) {
            setError('Valid amount is required')
            return
        }

        setActionLoading(true)

        try {
            await axios.post(
                'http://localhost:5000/admin/payment',
                {
                    loanId: paymentForm.loanId,
                    utrNumber: paymentForm.utrNumber,
                    amount: parseInt(paymentForm.amount),
                    date: paymentForm.date
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setIsModalOpen(false)
            setPaymentForm({ loanId: '', utrNumber: '', amount: '', date: new Date().toISOString().split('T')[0] })
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Error recording payment')
        } finally {
            setActionLoading(false)
        }
    }

    const getRoleTitle = () => {
        const titles = {
            admin: 'Admin Dashboard - All Leads',
            sales: 'Sales Module - Leads',
            sanction: 'Sanction Module - Approve/Reject Loans',
            disbursement: 'Disbursement Module - Disburse Sanctioned Loans',
            collection: 'Collection Module - Record Payments'
        }
        return titles[role] || 'Dashboard'
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading...</div>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{getRoleTitle()}</h1>
                <div className="header-info">
                    <span className="role-badge">{role?.toUpperCase()}</span>
                    <button
                        className="refresh-btn"
                        onClick={fetchData}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* SALES MODULE - Leads */}
            {(role === 'sales' || role === 'admin') && (
                <div className="module-content">
                    <div className="data-grid">
                        {data.length === 0 ? (
                            <div className="empty-state">No leads available</div>
                        ) : (
                            data.map(lead => (
                                <div key={lead._id} className="card lead-card">
                                    <h3>{lead.name}</h3>
                                    <div className="card-info">
                                        <p><strong>Email:</strong> {lead.email}</p>
                                        <p><strong>Role:</strong> {lead.role}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* SANCTION MODULE - Applied Loans */}
            {role === 'sanction' && (
                <div className="module-content">
                    <div className="data-grid">
                        {data.length === 0 ? (
                            <div className="empty-state">No applied loans</div>
                        ) : (
                            data.map(loan => (
                                <div key={loan._id} className="card loan-card">
                                    <div className="card-header">
                                        <h3>Loan ID: {loan._id.slice(-6).toUpperCase()}</h3>
                                        <span className="status-badge applied">Applied</span>
                                    </div>
                                    <div className="card-info">
                                        <p><strong>Borrower:</strong> {loan.borrower?.name || 'N/A'}</p>
                                        <p><strong>Email:</strong> {loan.borrower?.email || 'N/A'}</p>
                                        <p><strong>Loan Amount:</strong> ₹{loan.loanAmount?.toLocaleString() || 'N/A'}</p>
                                        <p><strong>Monthly Salary:</strong> ₹{loan.monthlySalary?.toLocaleString() || 'N/A'}</p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="btn btn-approve"
                                            onClick={() => handleApprove(loan._id)}
                                            disabled={actionLoading}
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            className="btn btn-reject"
                                            onClick={() => handleReject(loan._id)}
                                            disabled={actionLoading}
                                        >
                                            ✗ Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* DISBURSEMENT MODULE - Sanctioned Loans */}
            {role === 'disbursement' && (
                <div className="module-content">
                    <div className="data-grid">
                        {data.length === 0 ? (
                            <div className="empty-state">No sanctioned loans</div>
                        ) : (
                            data.map(loan => (
                                <div key={loan._id} className="card loan-card">
                                    <div className="card-header">
                                        <h3>Loan ID: {loan._id.slice(-6).toUpperCase()}</h3>
                                        <span className="status-badge sanctioned">Sanctioned</span>
                                    </div>
                                    <div className="card-info">
                                        <p><strong>Borrower:</strong> {loan.borrower?.name || 'N/A'}</p>
                                        <p><strong>Email:</strong> {loan.borrower?.email || 'N/A'}</p>
                                        <p><strong>Loan Amount:</strong> ₹{loan.loanAmount?.toLocaleString() || 'N/A'}</p>
                                        <p><strong>Total Repayment:</strong> ₹{loan.totalRepayment?.toLocaleString() || 'N/A'}</p>
                                        <p><strong>Tenure:</strong> {loan.tenure} days</p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="btn btn-disburse"
                                            onClick={() => handleDisburse(loan._id)}
                                            disabled={actionLoading}
                                        >
                                            💰 Disburse
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* COLLECTION MODULE - Disbursed Loans */}
            {role === 'collection' && (
                <div className="module-content">
                    <div className="data-grid">
                        {data.length === 0 ? (
                            <div className="empty-state">No disbursed loans</div>
                        ) : (
                            data.map(loan => (
                                <div key={loan._id} className="card loan-card">
                                    <div className="card-header">
                                        <h3>Loan ID: {loan._id.slice(-6).toUpperCase()}</h3>
                                        <span className="status-badge disbursed">Disbursed</span>
                                    </div>
                                    <div className="card-info">
                                        <p><strong>Borrower:</strong> {loan.borrower?.name || 'N/A'}</p>
                                        <p><strong>Email:</strong> {loan.borrower?.email || 'N/A'}</p>
                                        <p><strong>Total Repayment:</strong> ₹{loan.totalRepayment?.toLocaleString() || 'N/A'}</p>
                                        <p><strong>Amount Paid:</strong> ₹{loan.amountPaid?.toLocaleString() || '0'}</p>
                                        <p><strong>Outstanding:</strong> ₹{(loan.totalRepayment - loan.amountPaid)?.toLocaleString() || 'N/A'}</p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="btn btn-payment"
                                            onClick={() => handleRecordPayment(loan._id)}
                                            disabled={actionLoading}
                                        >
                                            💳 Record Payment
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Modal for Approval */}
            {isModalOpen && selectedItem?.type === 'approval' && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{approvalForm.action === 'approve' ? 'Approve Loan' : 'Reject Loan'}</h2>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setApprovalForm({ loanId: '', action: 'approve', rejectionReason: '' })
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            {approvalForm.action === 'reject' && (
                                <div className="form-group">
                                    <label htmlFor="rejectionReason">Reason for Rejection</label>
                                    <textarea
                                        id="rejectionReason"
                                        value={approvalForm.rejectionReason}
                                        onChange={(e) => setApprovalForm({
                                            ...approvalForm,
                                            rejectionReason: e.target.value
                                        })}
                                        placeholder="Enter reason for rejection"
                                        rows="4"
                                    />
                                </div>
                            )}

                            {approvalForm.action === 'approve' && (
                                <p className="confirmation-text">
                                    Are you sure you want to approve this loan?
                                </p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setApprovalForm({ loanId: '', action: 'approve', rejectionReason: '' })
                                }}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn ${approvalForm.action === 'approve' ? 'btn-approve' : 'btn-reject'}`}
                                onClick={submitApproval}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : approvalForm.action === 'approve' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Payment */}
            {isModalOpen && selectedItem?.type === 'payment' && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Record Payment</h2>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setPaymentForm({ loanId: '', utrNumber: '', amount: '', date: new Date().toISOString().split('T')[0] })
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="utrNumber">UTR Number</label>
                                <input
                                    type="text"
                                    id="utrNumber"
                                    value={paymentForm.utrNumber}
                                    onChange={(e) => setPaymentForm({
                                        ...paymentForm,
                                        utrNumber: e.target.value
                                    })}
                                    placeholder="Enter UTR number"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount">Amount (₹)</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({
                                        ...paymentForm,
                                        amount: e.target.value
                                    })}
                                    placeholder="Enter payment amount"
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Payment Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={paymentForm.date}
                                    onChange={(e) => setPaymentForm({
                                        ...paymentForm,
                                        date: e.target.value
                                    })}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setPaymentForm({ loanId: '', utrNumber: '', amount: '', date: new Date().toISOString().split('T')[0] })
                                }}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-payment"
                                onClick={submitPayment}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Recording...' : 'Record Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
