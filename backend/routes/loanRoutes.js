const experss=require('express')
const router=experss.Router()
const {protect,authorize}=require('../middleware/authMiddleware')
const {submitPersonalDetails,configuration,getMyloans}=require('../controllers/loanController')
const upload=require('../middleware/upload')
const Loan=require('../models/loan')
router.post('/personal-details',protect,authorize('borrower'),submitPersonalDetails)
router.post('/configure',protect,authorize('borrower'),configuration)
router.get('/my-loans',protect,authorize('borrower'),getMyloans)
router.post('/upload-salary-slip', protect, authorize('borrower'), (req, res, next) => {
    upload.single('salarySlip')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err)
            return res.status(400).json({ message: `File upload error: ${err.message}` })
        }
        next()
    })
}, async (req, res) => {
    try {
        console.log('Upload route called')
        console.log('File:', req.file)
        console.log('Body:', req.body)
        
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
        
        const { loanId } = req.body
        if (!loanId) return res.status(400).json({ message: 'Loan ID is required' })
        
        const loan = await Loan.findById(loanId)
        if (!loan) return res.status(404).json({ message: 'Loan not found' })
        
        loan.salarySlip = req.file.path
        await loan.save()
        
        res.json({ message: 'Salary slip uploaded', path: req.file.path })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ message: error.message })
    }
})
module.exports=router