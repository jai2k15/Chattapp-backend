const {getUser} = require('../services/auth')
const restrictToLoggedIn = async (req, res, next )=>{
    const userId = req.headers["authorization"];
    
    if(!userId) return res.json("Unauthorized");
    // const token = userId.split('Bearer ')[0];
    const token = userId;
    const user = getUser(token);

    if(!user) return res.json("Unauthorized user not exist");

    req.user = user;
    next();
}

const checkAuth = async (req, res, next)=>{
    const userId = req.headers["authorization"];
    
    const token = userId;
    const user = getUser(token);

    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedIn,
    checkAuth
};