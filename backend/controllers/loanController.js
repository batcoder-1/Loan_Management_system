const Loan=require('../models/loan')
const runBRE=require('../middleware/bre')
const submitPersonalDetails=async (req,res)=>{
    try{
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
    }
    else{
          loan.fullname = fullName
            loan.pan = pan
            loan.dob = dob
            loan.monthlySalary = monthlySalary
            loan.employmentMode = employmentMode.toLowerCase()
            await loan.save()
    }
    res.json({message:'Personal details saved',loanId:loan._id})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
    const configuration=async(req,res)=>{
        try{
            const {loanId,amount,tenure}=req.body
            const loan=await Loan.findById(loanId)
            if(!loan){
                res.status(404).json({message:'Loan not found'})
            }
            const SI = (amount * 12 * tenure) / (365 * 100)
            const totalRepayment = amount + SI
             loan.amount = amount
            loan.tenure = tenure
            loan.totalRepayment = totalRepayment
            loan.status = 'applied'
            await loan.save()
             res.json({ message: 'Loan applied', totalRepayment, SI })
        }
        catch(err){
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