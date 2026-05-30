const jwt=require('jsonwebtoken')

const protect=(req,res,next)=>{
    try{
        const token=req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({message:'No token,unautorized'})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        res.status(401).json    ({message:'Invalid token'})
    }

const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(401).json({message:'Access denied'})
        }
        next()
    }
}
}
module.exports={protect,authorize}