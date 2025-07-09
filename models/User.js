const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email:{
        type: String,
        required: [true, 'Please add your email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true, 'Please enter your password']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)