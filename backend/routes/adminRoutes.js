const express=require('express')
const router=express.Router()
const {protect,authorize}=require('../middleware/authMiddleware')
const {
    getLeads,
    getAppliedLoans, sanctionLoan,
    getSanctionedLoans, disburseLoan,
    getDisbursedLoans, recordPayment
} = require('../controllers/adminController')

router.get('/leads', protect, authorize('admin', 'sales'), getLeads)
router.get('/applied-loans', protect, authorize('admin', 'sanction'), getAppliedLoans)
router.post('/sanction', protect, authorize('admin', 'sanction'), sanctionLoan)
router.get('/sanctioned-loans', protect, authorize('admin', 'disbursement'), getSanctionedLoans)
router.post('/disburse', protect, authorize('admin', 'disbursement'), disburseLoan)
router.get('/disbursed-loans', protect, authorize('admin', 'collection'), getDisbursedLoans)
router.post('/payment', protect, authorize('admin', 'collection'), recordPayment)

module.exports = router