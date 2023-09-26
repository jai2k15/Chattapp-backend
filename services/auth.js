const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Jai@123';
const setUser = (user)=>{
    return jwt.sign({
        id: user._id,
        email : user.email
    }, JWT_SECRET)
}

const getUser = (token) =>{
    if(!token) return null
    try{
        return jwt.verify(token, JWT_SECRET)
    }catch(error){
        return console.log("Error "+error)
    }
}

module.exports = {
    setUser,
    getUser
};