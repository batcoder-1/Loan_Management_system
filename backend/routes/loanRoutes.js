const experss=require('express')
const router=experss.Router()
const {protect,authorize}=require('../middleware/authMiddleware')
const {submitPersonalDetails,configuration,getMyloans}=require('../controllers/loanController')

router.post('/personal-details',protect,authorize('borrower'),submitPersonalDetails)
router.post('/configure',protect,authorize('borrower'),configuration)
router.get('/my-loans',protect,authorize('borrower'),getMyloans)

module.exports=router