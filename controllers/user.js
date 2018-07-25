const User  = require('../models/user');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const Fb = require('fb');

class UserController{

   static signUp(req,res){
      let {name, email, password} = req.body;

      User.create({
         name,
         email,
         password,
      })
      .then(function(){
         res
         .status(201)
         .json({
            message: "Successfully created new user",
         })
      })
      .catch(function(err){
         res
         .status(401)
         .json({
            message: err.message
         })
      })
   }

   static signIn(req,res){

      console.log("cek req headers nih", req.headers);

      //FACEBOOK LOGIN
      if(req.headers.fbid){
         FB.api('me', { fields: ['email', 'name'], access_token: req.headers.fbtoken }, function (response) {

            User.findOne({ email: response.email })
               .then(function(user){
                  let pass = response.id + 'a';
                  //If user hasn't been saved into db
                  if(user === null){
                     User.create({
                        name: response.name,
                        email: response.email,
                        password : pass
                     })
                     .then(function(newUser){
                      console.log(newUser);
                      let token = jwt.sign({_id: newUser._id}, process.env.secretKey)
                      console.log("tokennn", token);
                        res
                        .status(201)
                        .json({
                           newUser,
                           token, 
                           message: "Created new user"
                        })
                     })
                     .catch(function(err){
                        res
                        .status(400)
                        .json(err.message);
                     })
                  }
                  //If user is ALREADY in DB
                  else{ 
                     console.log("masuk else FB login");
                     user.comparePassword(pass, function(err, isMatch){  
                        if(err){
                           console.log("else err fB login")
                           res
                           .status(401)
                           .json({
                              message: err.message
                           })
                        }
                        else{
                           console.log("no err @fb login");
                           if(isMatch){
                              let token = jwt.sign({_id: user.id}, process.env.secretKey)
                              res
                              .status(200)
                              .json({
                                 user, 
                                 token, 
                                 message: "Token generated"
                              });
                           }
                           else{
                              console.log("no match")
                              res
                              .status(400)
                              .json({
                                 message: "Password is wrong!"
                              })
                           }
                        }
                     })
                  }
               })
               .catch(function(err){
                  console.log("error @ find one");
                  res
                  .status(400)
                  .json(err.message)
               }) 
            });
         }
      //No FB signin 
      else{
         //Normal Sign In
         let {email, password} = req.body;
         User.findOne({ email })
         .then(function(user){
            user.comparePassword(password, function(err, isMatch){
               if(err){
                  res
                  .status(401)
                  .json({
                     message: err.message
                  })
               }
               else{
                  if(isMatch){
                     let token = jwt.sign({_id: user.id, position: user.position}, process.env.secretKey)
                     res
                     .status(200)
                     .json({
                        user, 
                        token, 
                        message: "Token generated"
                     });
                  }
                  else{
                     res
                     .status(400)
                     .json({
                        message: "Password is wrong!"
                     })
                  }
               }
            })
         })
         .catch(function(err){
            res
            .status(400)
            .json("User is not found!");
         })
      }
   } 

   static getExp(req,res){

      let id = req.decoded._id;
      User.findById({_id:id})
      .then(function(user){
         let currentProgress = user.progress;
         res.status(200).json({
            message:"This is the user's current progress",
            currentProgress
         })
      })
      .catch(function(err){
         res.status(500).json(err.message);
      })
   }

   static getLevel(req,res){
      let id = req.decoded._id;
      User.findById({_id:id})
      .then(function(user){
         let level = user.level;
         let status = ''
         
         switch(level) {
            case 1:
               status = "Noob"
               break;
            case 3:
               status = "Casual"
               break;
            case 5:
               status = "Hardcore"
               break;
            case 7:
               status = "Pro"
               break;
            case 9:
               status = "Try Hard"
               break;
            case 10:
               status = "Forever Alone God"
               break;
            default:
               status = "noob"
               break;
         }

         res.status(200).json({
            message: "Here's the user's level status",
            level,
            status
         })
      })
      .catch(function(err){
         res
         .status(400)
         .json(err.message);
      })
   }
}

module.exports = UserController;