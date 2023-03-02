const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth.js')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(user);
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res)=>{
    try{
        
        const user = await User.getUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();

        res.send({user, token});
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }

})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter( t => t.token !=req.token )
        
        await req.user.save()
        res.send('Logout Succesful!')
    }catch(e){
        console.log(e);
        res.status(500).send();
    }

})

router.post('/users/logoutAll', auth, async(req, res) =>{
    try{
        req.user.tokens = []

        await req.user.save()
        res.send('Logout All devices Successful!')

    }catch(e){
        console.log(e);
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        if(req.user){
            res.send(req.user)
        }
        else{
            throw new Error('Invalid Auth')
        }

    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router