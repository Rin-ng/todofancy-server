const jwt = require ('jsonwebtoken');
const User = require('../models/user');

const auth = function(req, res, next){
   let {token} = req.headers;
   console.log("dah d auth")
   if(token){
      jwt.verify(token, process.env.secretKey, function(err, decoded){
         if(decoded){
            console.log("masuk d decoded")
            let decodedId = decoded._id;
            User.findById(decodedId)
            .then(function(user){
               if(user){
                  //same id
                  req.decoded = decoded;
                  next();
               }
               else{
                  res.status(403)
                  .json("UNAUTHORIZED")
               }
            })
            .catch(function(err){
               res.status(401)
               .json(err.message)
            })
         }
         else{
            console.log("ga masuk decoded");
            res.status(403).json("LOGIN DL BRO")
         }
      })
   }
}

module.exports = auth;