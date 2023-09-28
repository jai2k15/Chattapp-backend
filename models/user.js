const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:String,

    },
    gender:{
        type:String,

    },
    profilePic:{
        type:String,
        default: null
    },
    username:{
        type:String,
        unique:true
    }

},{
    timestamps: true
});
const User = mongoose.model('user', userSchema);

module.exports = User;