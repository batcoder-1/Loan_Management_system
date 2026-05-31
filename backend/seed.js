const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/users')
require('dotenv').config()

const users = [
    { name: 'Admin User', email: 'admin@lms.com', password: 'admin123', role: 'admin' },
    { name: 'Sales User', email: 'sales@lms.com', password: 'sales123', role: 'sales' },
    { name: 'Sanction User', email: 'sanction@lms.com', password: 'sanction123', role: 'sanction' },
    { name: 'Disbursement User', email: 'disbursement@lms.com', password: 'disbursement123', role: 'disbursement' },
    { name: 'Collection User', email: 'collection@lms.com', password: 'collection123', role: 'collection' },
    { name: 'Borrower User', email: 'borrower@lms.com', password: 'borrower123', role: 'borrower' },
]

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    await User.deleteMany({})
    console.log('Cleared existing users')

    for (const user of users) {
        const hashed = await bcrypt.hash(user.password, 10)
        await User.create({ ...user, password: hashed })
        console.log(`Created ${user.role}: ${user.email}`)
    }

    console.log('Seed complete')
    process.exit()
}

seed().catch(err => {
    console.log(err)
    process.exit(1)
})