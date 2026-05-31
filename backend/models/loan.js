const mongoose=require('mongoose')

const paymentSchema=new mongoose.Schema({
    utrNumber:{
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})
const loanSchema=new mongoose.Schema({
    borrower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    pan: { type: String, required: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: {
        type: String,
        enum: ['salaried', 'self-employed', 'unemployed'],
        required: true
    },
    amount: { type: Number },
    tenure: { type: Number },
    interestRate: { type: Number, default: 12 },
    totalRepayment: { type: Number },
    salarySlip: { type: String },
     status: {
        type: String,
        enum: ['incomplete', 'applied', 'sanctioned', 'disbursed', 'closed', 'rejected'],
        default: 'incomplete'
    },
     rejectionReason: { type: String },
     payments: [paymentSchema],
    amountPaid: { type: Number, default: 0 }
}, {timestamps:true})

const Loan=mongoose.model('Loan',loanSchema)

// Drop old unique index if it exists (non-sparse version)
Loan.collection.dropIndex('payments.utrNumber_1').catch(() => {
    // Index doesn't exist, which is fine
})

module.exports=Loan 