const jwt = require ('jsonwebtoken');
const User = require('../models/user');

const auth = function(req, res, next){
   let {token, id} = req.headers;
   console.log("----------", id);

   if(token){
      jwt.verify(token, process.env.secretKey, function(err, decoded){
      
         if(decoded){
            let decodedId = decoded._id;

            User.findById(decodedId)
            .then(function(user){
               if(user._id == id){

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
            res.status(403).json("LOGIN DL BRO")
         }
      })
   }
}

module.exports = auth;