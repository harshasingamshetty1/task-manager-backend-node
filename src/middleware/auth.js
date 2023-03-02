const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

module.exports = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token);

        //we have signed the token, using the _id as the payload, therfore we have _id 
        const decoded = jwt.verify(token, 'SingamNodeJs');
        const user = await User.findOne({'_id': decoded._id, 'tokens.token': token})
        console.log(user);
        
        //this can be used later in route handler instead of re executing and wasting resources 
        req.user = user
        //this is to know, while logging out, which particular token to delete.
        //i.e to understand which device to logout, instead of logginout of all devices!
        req.token = token
        next()
    }catch(e){
        console.log('Here!');
        res.status(401).send('Authentication Failed!')
    }
}