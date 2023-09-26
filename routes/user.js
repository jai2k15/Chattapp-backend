const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {setUser, getUser} = require('../services/auth')
const { restrictToLoggedIn } = require('../middleware/auth')

router.get('/allusers', async (req, res)=>{
    const user = await User.find({});
    if(!user) return res.json({msg:'cannot find any user'})
    res.json({user});
})



router.post('/signin', async (req, res)=>{
    try{

        if(await User.findOne({email:req.body.email})){
            console.log('user exist')
            return res.json({"status":"user already exist"})
        }
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            dob:req.body.dob,
            gender:req.body.gender,
            username: req.body.username
        });
        console.log(user);
        return res.status(201).json({status: 'created', user: user});
    }catch(err){
        console.log(err)
    }

})

router.post('/login', async (req, res)=>{
    const user = await User.findOne({username:req.body.username, password:req.body.password});
    if(!user) return res.status(400).json({status: "incorrect Credentials"});
    
    const token = setUser(user);
    // console.log(token)
    res.json({token:token, user:user})
})

router.patch('/updateUser/:id',restrictToLoggedIn, async (req, res)=>{
    try{
        if(await User.findOne({username:req.body.username})){
            return res.json("username already exist")
        }
        const user = await User.findByIdAndUpdate(req.params.id, {username:req.body.username })
        return res.json({ "status": "success" })
    }catch(err){
        return res.send(400).json("error", err)
    }
})
router.patch('/updateUsername/:id', async (req, res)=>{
    try{
        if(await User.findOne({username:req.body.username})){
            return res.json({"status":"username already exist"})
        }
        const user = await User.findByIdAndUpdate(req.params.id, {username:req.body.username })
        return res.json({ "status": "success" })
    }catch(err){
        return res.status(400).json({"error": err})
    }
})
router.patch('/updateProfilePic/:id', async (req, res)=>{
    
})

router.delete('/deleteUser/:id', restrictToLoggedIn, async (req, res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    return res.json({"Status": "Deleted"})
})

router.post('/searchUser/', restrictToLoggedIn, async(req, res)=>{
    const user = await User.findOne({username: req.body.username});
    res.json(user);
})
module.exports = router;