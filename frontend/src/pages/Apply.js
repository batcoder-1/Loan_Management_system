import React, { useState } from 'react'
import axios from 'axios'
import './Apply.css'

const Apply = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        pan: '',
        dob: '',
        monthlySalary: '',
        employmentMode: 'salaried',
        loanAmount: 250000,
        tenure: 180,
        salarySlipFile: null
    })

    const token = localStorage.getItem('token')

    // Simple Interest Calculation: SI = (P * R * T) / 100
    // P = Principal, R = Rate (12%), T = Time in years
    const calculateSI = (principal, days) => {
        const rate = 12
        const timeInYears = days / 365
        return Math.round((principal * rate * timeInYears) / 100)
    }

    const si = calculateSI(formData.loanAmount, formData.tenure)
    const totalRepayment = formData.loanAmount + si

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'monthlySalary' || name === 'loanAmount' 
                ? parseInt(value) || 0 
                : value
        }))
    }

    const handleSliderChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value)
        }))
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            salarySlipFile: e.target.files[0]
        }))
    }

    const validateStep1 = () => {
        if (!formData.fullName.trim()) {
            setError('Full name is required')
            return false
        }
        if (!formData.pan.trim()) {
            setError('PAN is required')
            return false
        }
        if (!formData.dob) {
            setError('Date of birth is required')
            return false
        }
        if (!formData.monthlySalary) {
            setError('Monthly salary is required')
            return false
        }
        return true
    }

    const validateStep2 = () => {
        if (!formData.salarySlipFile) {
            setError('Salary slip is required')
            return false
        }
        return true
    }

    const handleNextStep = () => {
        setError('')
        if (currentStep === 1 && !validateStep1()) return
        if (currentStep === 2 && !validateStep2()) return
        setCurrentStep(prev => prev + 1)
    }

    const handlePrevStep = () => {
        setError('')
        setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)

        try {
            console.log('Step 1: Submitting personal details...')
            // Step 1: Submit personal details
            const step1Response = await axios.post(
                'http://localhost:5000/loans/personal-details',
                {
                    fullName: formData.fullName,
                    pan: formData.pan,
                    dob: formData.dob,
                    monthlySalary: formData.monthlySalary,
                    employmentMode: formData.employmentMode
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log('Step 1 Success:', step1Response.data)

            const loanId = step1Response.data.loanId

            console.log('Step 2: Uploading salary slip...')
            // Step 2: Upload salary slip
            const formDataUpload = new FormData()
            formDataUpload.append('salarySlip', formData.salarySlipFile)
            formDataUpload.append('loanId', loanId)

            await axios.post(
                'http://localhost:5000/loans/upload-salary-slip',
                formDataUpload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                        // Don't set Content-Type - axios will set it with correct boundary
                    }
                }
            )
            console.log('Step 2 Success: Salary slip uploaded')

            console.log('Step 3: Configuring loan...')
            // Step 3 & 4: Submit loan configuration (amount, tenure, PI etc)
            await axios.post(
                'http://localhost:5000/loans/configure',
                {
                    loanId: loanId,
                    loanAmount: formData.loanAmount,
                    tenure: formData.tenure,
                    interestAmount: si,
                    totalRepayment: totalRepayment
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log('Step 3 Success: Loan configured')

            setSuccess(true)
            setTimeout(() => {
                window.location.href = '/my-loans'
            }, 2000)
        } catch (err) {
            console.error('Error:', err)
            const errorMsg = err.response?.data?.message || err.message || 'Error submitting application'
            setError(errorMsg)
            console.error('Full error:', errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="apply-container">
            <div className="apply-card">
                <h1>Loan Application</h1>

                {/* Step Indicator */}
                <div className="step-indicator">
                    {[1, 2, 3, 4].map(step => (
                        <div
                            key={step}
                            className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
                        >
                            <span>{step}</span>
                        </div>
                    ))}
                </div>

                {/* Step Labels */}
                <div className="step-labels">
                    <div>Personal</div>
                    <div>Upload</div>
                    <div>Loan Details</div>
                    <div>Review</div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Application submitted successfully! Redirecting...</div>}

                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                    <div className="form-step">
                        <h2>Personal Information</h2>
                        
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pan">PAN (Permanent Account Number)</label>
                            <input
                                type="text"
                                id="pan"
                                name="pan"
                                value={formData.pan}
                                onChange={handleInputChange}
                                placeholder="e.g., ABCDE1234F"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="monthlySalary">Monthly Salary (₹)</label>
                            <input
                                type="number"
                                id="monthlySalary"
                                name="monthlySalary"
                                value={formData.monthlySalary}
                                onChange={handleInputChange}
                                placeholder="Enter monthly salary"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="employmentMode">Employment Mode</label>
                            <select
                                id="employmentMode"
                                name="employmentMode"
                                value={formData.employmentMode}
                                onChange={handleInputChange}
                            >
                                <option value="salaried">Salaried</option>
                                <option value="self-employed">Self-Employed</option>
                                <option value="unemployed">Unemployed</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 2: File Upload */}
                {currentStep === 2 && (
                    <div className="form-step">
                        <h2>Upload Salary Slip</h2>
                        <p className="step-description">Please upload your recent salary slip (PDF, JPG, or PNG)</p>

                        <div className="form-group">
                            <label htmlFor="salarySlip">Salary Slip</label>
                            <div className="file-upload">
                                <input
                                    type="file"
                                    id="salarySlip"
                                    name="salarySlip"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label htmlFor="salarySlip" className="file-label">
                                    <span>📁 Choose File or Drag & Drop</span>
                                    {formData.salarySlipFile && (
                                        <p className="file-name">{formData.salarySlipFile.name}</p>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Loan Details */}
                {currentStep === 3 && (
                    <div className="form-step">
                        <h2>Loan Configuration</h2>

                        <div className="form-group">
                            <label htmlFor="loanAmount">
                                Loan Amount: ₹{formData.loanAmount.toLocaleString()}
                            </label>
                            <input
                                type="range"
                                id="loanAmount"
                                name="loanAmount"
                                min="50000"
                                max="500000"
                                step="10000"
                                value={formData.loanAmount}
                                onChange={handleSliderChange}
                                className="slider"
                            />
                            <div className="slider-labels">
                                <span>₹50,000</span>
                                <span>₹500,000</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tenure">
                                Tenure: {formData.tenure} days
                            </label>
                            <input
                                type="range"
                                id="tenure"
                                name="tenure"
                                min="30"
                                max="365"
                                step="5"
                                value={formData.tenure}
                                onChange={handleSliderChange}
                                className="slider"
                            />
                            <div className="slider-labels">
                                <span>30 days</span>
                                <span>365 days</span>
                            </div>
                        </div>

                        <div className="calculation-summary">
                            <h3>Loan Summary</h3>
                            <div className="summary-item">
                                <span>Principal Amount:</span>
                                <strong>₹{formData.loanAmount.toLocaleString()}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Interest (12% p.a.):</span>
                                <strong>₹{si.toLocaleString()}</strong>
                            </div>
                            <div className="summary-item total">
                                <span>Total Repayment:</span>
                                <strong>₹{totalRepayment.toLocaleString()}</strong>
                            </div>
                            <p className="tenure-info">For {formData.tenure} days</p>
                        </div>
                    </div>
                )}

                {/* Step 4: Review & Confirm */}
                {currentStep === 4 && (
                    <div className="form-step">
                        <h2>Review Your Application</h2>

                        <div className="review-section">
                            <div className="review-item">
                                <span className="label">Full Name:</span>
                                <span className="value">{formData.fullName}</span>
                            </div>
                            <div className="review-item">
                                <span className="label">PAN:</span>
                                <span className="value">{formData.pan}</span>
                            </div>
                            <div className="review-item">
                                <span className="label">Date of Birth:</span>
                                <span className="value">{new Date(formData.dob).toLocaleDateString()}</span>
                            </div>
                            <div className="review-item">
                                <span className="label">Monthly Salary:</span>
                                <span className="value">₹{formData.monthlySalary.toLocaleString()}</span>
                            </div>
                            <div className="review-item">
                                <span className="label">Employment Mode:</span>
                                <span className="value">{formData.employmentMode}</span>
                            </div>
                            <div className="review-item">
                                <span className="label">Salary Slip:</span>
                                <span className="value">{formData.salarySlipFile?.name || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="review-section loan-summary">
                            <h3>Loan Details</h3>
                            <div className="review-item">
                                <span className="label">Loan Amount:</span>
                                <span className="value">₹{formData.loanAmount.toLocaleString()}</span>
                            </div>
                            <div className="review-item">
                                <span className="label">Tenure:</span>
                                <span className="value">{formData.tenure} days</span>
                            </div>
                            <div className="review-item">
                                <span className="label">Interest (12% p.a.):</span>
                                <span className="value">₹{si.toLocaleString()}</span>
                            </div>
                            <div className="review-item total">
                                <span className="label">Total Repayment:</span>
                                <span className="value">₹{totalRepayment.toLocaleString()}</span>
                            </div>
                        </div>

                        <p className="confirmation-text">
                            By clicking Submit, you confirm that all the information provided is accurate and complete.
                        </p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="button-group">
                    {currentStep > 1 && (
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevStep}
                            disabled={loading}
                        >
                            Previous
                        </button>
                    )}

                    {currentStep < 4 ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleNextStep}
                            disabled={loading}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Apply
