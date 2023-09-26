const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '../uploads/' })
const Friends = require('../models/friends');
const { restrictToLoggedIn } = require('../middleware/auth')


router.get('/allFriends', restrictToLoggedIn, async (req, res) => {
    try{

        const friend = await Friends.find({ createdBy: req.user.id });
        res.json({ friend })
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
