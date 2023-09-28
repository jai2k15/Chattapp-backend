const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    email:{
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
        required:true
    },
    onlineStatus:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        
    }

},{
    timestamps: true
});
const Friends = mongoose.model('friend', friendSchema);

module.exports = Friends;