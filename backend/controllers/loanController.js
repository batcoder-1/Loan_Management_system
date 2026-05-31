const Loan=require('../models/loan')
const runBRE=require('../middleware/bre')
const submitPersonalDetails=async (req,res)=>{
    try{
        console.log('Personal details endpoint called with:', req.body)
        const {fullName,pan,dob,monthlySalary, employmentMode}=req.body
        const errors=runBRE({dob, monthlySalary, pan, employmentMode})
        if(errors.length>0){
            return res.status(400).json({message:'BRE failed',errors})
        }
    let loan=await Loan.findOne({
         borrower: req.user.userID, 
            status: 'incomplete' 
    })
    if(!loan){
        loan=await Loan.create({
            borrower: req.user.userID,
            fullname: fullName,
            pan, dob, 
            monthlySalary, 
            employmentMode: employmentMode.toLowerCase()
        })
        console.log('New loan created:', loan._id)
    }
    else{
          loan.fullname = fullName
            loan.pan = pan
            loan.dob = dob
            loan.monthlySalary = monthlySalary
            loan.employmentMode = employmentMode.toLowerCase()
            await loan.save()
            console.log('Existing loan updated:', loan._id)
    }
    res.json({message:'Personal details saved',loanId:loan._id})
    }
    catch(err){
        console.error('Personal details error:', err)
        res.status(500).json({message:err.message})
    }
}
    const configuration=async(req,res)=>{
        try{
            console.log('Configuration endpoint called with:', req.body)
            const {loanId,loanAmount,tenure}=req.body
            
            if (!loanId || !loanAmount || !tenure) {
                return res.status(400).json({message:'LoanId, loanAmount, and tenure are required'})
            }
            
            const loan=await Loan.findById(loanId)
            if(!loan){
                return res.status(404).json({message:'Loan not found'})
            }
            const SI = (loanAmount * 12 * tenure) / (365 * 100)
            const totalRepayment = loanAmount + SI
             loan.amount = loanAmount
            loan.tenure = tenure
            loan.totalRepayment = totalRepayment
            loan.status = 'applied'
            await loan.save()
            console.log('Loan configured:', loan._id)
             res.json({ message: 'Loan applied', totalRepayment, SI })
        }
        catch(err){
            console.error('Configuration error:', err)
            res.status(500).json({message:err.message})
        }
    }
    const getMyloans=async (req,res)=>{
        try{
            const loans=await Loan.find({borrower:req.user.userID})
            res.json(loans)
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }
    module.exports={submitPersonalDetails,configuration,getMyloans}