const User=require('../models/users')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const signup=async (req,res) => {
    try{
        const {name,email,password,role}=req.body
        const existingUser=await User.findOne({email})
        if (existingUser){
            return res.status(400).json({message:'User already exists'})
        }
        const hashPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            name,
            email,
            password:hashPassword,
            role:role||'borrower'
        })
        res.status(201).json({message:'User created successfully',userID:user._id})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const login=async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            res.status(404).json({message:'user not found'})
        }

        const ismatch=await bcrypt.compare(password,user.password)
        if(!ismatch){
            res.status(400).json({message:'wrong password'})
        }
        const token=jwt.sign(
            { userID:user._id,role:user.role  },
            process.env.JWT_SECRET ,
            {expiresIn:'7d'}
    )
    res.json({token,role:user.role,name:user.name})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

module.exports = { signup, login }