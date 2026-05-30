const runBRE=(data)=>{
    const {dob,monthlySalary,pan,employmentMode}=data
    const errors=[]
     const age = Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
    if (age < 23 || age > 50) {
        errors.push('Age must be between 23 and 50')
    }

    // Salary check
    if (monthlySalary < 25000) {
        errors.push('Monthly salary must be at least ₹25,000')
    }

    // PAN check
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(pan)) {
        errors.push('Invalid PAN format')
    }
    // Employment check
    if (employmentMode === 'unemployed') {
        errors.push('Unemployed applicants are not eligible')
    }

    return errors
}
module.exports=runBRE