const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '../uploads/' })
const Friends = require('../models/friends');
const User = require('../models/user')
const { restrictToLoggedIn } = require('../middleware/auth')


router.get('/allFriends', restrictToLoggedIn, async (req, res) => {
    try{

        const friend = await Friends.find({ createdBy: req.user.id });
        const users = []
        const f = await Promise.all(friend.map( async (f)=>{

            // console.log(f)
            const user = await User.findOne({ username: f.username })
            return user;
            // // console.log(user)
            // // console.log(users)
            // res.json({users})
            // return users;
        }))
        // console.log(f);
        res.json({ f })
    }catch(err){
          console.log(err)
    }
})

router.post('/addFriend', restrictToLoggedIn, async (req, res) => {
    try {
        
        // if()
        const friend = await Friends.create({
            name: req.body.name,
            email:req.body.email+"_"+Date.now(),
            username: req.body.username,
            dob: req.body.dob,
            gender: req.body.gender,
            profilePic: req.body.profilePic,
            createdBy: req.user.id
        })
        console.log(friend);
        res.status(201).json({ status: 'created' });
    }catch(err){
        res.json(err)
        console.log("Some error occurred "+err)
    }
})

router.delete('/deleteFriend/:id', restrictToLoggedIn, async (req, res) => {
    const friend = await Friends.findByIdAndDelete(req.params.id);
    res.json({ "Status": "Deleted" })
})
module.exports = router;
