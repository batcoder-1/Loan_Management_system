const Loan=require('../models/loan')
const User=require('../models/users')

const getLeads=async (req,res)=>{
    try{
        const borrowers=await User.find({role:'borrower'})
        const borrowerId=borrowers.map(b=>b._id)
        const appliedIds=await Loan.distinct('borrower')
        const leads = borrowers.filter(b => 
            !appliedIds.some(id => id.toString() === b._id.toString())
        )
        res.json(leads)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
const getAppliedLoans=async (req,res)=>{
    try{
        const loans=await Loan.find({status:'applied'}).populate('borrower','name email')
        res.json(loans)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
const sanctionLoan = async (req, res) => {
    try {
        const { loanId, action, rejectionReason } = req.body
        
        const loan = await Loan.findById(loanId)
        if (!loan) return res.status(404).json({ message: 'Loan not found' })
        if (loan.status !== 'applied') return res.status(400).json({ message: 'Loan is not in applied state' })

        if (action === 'approve') {
            loan.status = 'sanctioned'
        } else {
            loan.status = 'rejected'
            loan.rejectionReason = rejectionReason
        }
        
        await loan.save()
        res.json({ message: `Loan ${action}d`, loan })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getSanctionedLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'sanctioned' }).populate('borrower', 'name email')
        res.json(loans)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const disburseLoan = async (req, res) => {
    try {
        const { loanId } = req.body
        
        const loan = await Loan.findById(loanId)
        if (!loan) return res.status(404).json({ message: 'Loan not found' })
        if (loan.status !== 'sanctioned') return res.status(400).json({ message: 'Loan is not sanctioned' })

        loan.status = 'disbursed'
        await loan.save()
        res.json({ message: 'Loan disbursed', loan })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getDisbursedLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'disbursed' }).populate('borrower', 'name email')
        res.json(loans)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const recordPayment = async (req, res) => {
    try {
        const { loanId, utrNumber, amount, date } = req.body

        // check UTR uniqueness across all loans
        const existingPayment = await Loan.findOne({ 'payments.utrNumber': utrNumber })
        if (existingPayment) {
            return res.status(400).json({ message: 'UTR number already exists' })
        }

        const loan = await Loan.findById(loanId)
        if (!loan) return res.status(404).json({ message: 'Loan not found' })
        if (loan.status !== 'disbursed') return res.status(400).json({ message: 'Loan is not disbursed' })

        loan.payments.push({ utrNumber, amount, date })
        loan.amountPaid += amount

        // auto close
        if (loan.amountPaid >= loan.totalRepayment) {
            loan.status = 'closed'
        }
         await loan.save()
        res.json({ 
            message: loan.status === 'closed' ? 'Loan closed' : 'Payment recorded',
            amountPaid: loan.amountPaid,
            outstanding: loan.totalRepayment - loan.amountPaid
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = { 
    getLeads, 
    getAppliedLoans, sanctionLoan,
    getSanctionedLoans, disburseLoan,
    getDisbursedLoans, recordPayment
}