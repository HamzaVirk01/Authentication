const AsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET, 
        {
            expiresIn: '7d'
        }
    )
}
 
const registerUser = AsyncHandler( async (req,res) => {
    const { name, email, password, dob, gender } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all the respective fields")
    } 

    const isUserPresent = await User.findOne({email})
    if(isUserPresent){
        res.status(400)
        throw new Error("User alread exists")
    } else {
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password,salt)
        const createdUser = await User.create({
            name, email, password: hashedPassword
        })
        res.json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
            token: generateToken(createdUser._id),  
        })
        res.send(createdUser)
    }

})

const loginUser = AsyncHandler (async (req,res) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("Please enter all the fields")
    }
    const checkUser = await User.findOne({email})
    if(!checkUser){
        res.status(404)
        throw new Error("User does not exist")
    } else {
        if(await bcrypt.compare(password, checkUser.password)){
            res.json({
                _id: checkUser._id,
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
                token: generateToken(checkUser._id), 
            })
        } else {
            res.status(401)
            throw new Error("Invalid Password")
        }
    }
})

module.exports = {
    registerUser, loginUser
}