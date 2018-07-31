const User  = require('../models/user');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const Fb = require('fb');

class UserController{
    static updateProfile(req,res){
    let {name, email, password} = req.body;
    let image;
    if(req.file){
      image = req.file.cloudStoragePublicUrl; 
    }

    let id = req.decoded._id
    User.findById({_id:id})
    .then(function(user){
      let newData = {}
      if(name){
        newData["name"] = name;
      }
      if(email){
        newData["email"]= email;
      }
      if(password){
        newData["password"] = password;
      }
      if(image){
        newData["profileImg"] = image;
      }
      console.log(newData)
      console.log("Id", user._id)

      User.update({_id: user._id}, {$set: newData}).exec()
      .then(function(updated){
        res.status(200).json({
          message: "updated",
          updated
        })
      })
      .catch(function(err){
        res.status(400).json(err.message)
      })
    })
    .catch(function(err){
      res.status(400).json(err.message)
    })

   }
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
    let {email, password} = req.body;
    User.findOne({ email })
    .then(function(user){
      user.comparePassword(password, function(err, isMatch){
        if(err){
            res.status(401).json(err.message)
        }
        else{
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
        .json(err.message);
    })
  }

   static fbSignIn(req,res){
      console.log("masuk sini hihihihi")
      console.log("cek req headers nih", req.headers.fbToken);
      console.log('headers ', req.headers)
      console.log("body nih", req.body)
      
      let {name, email, id} = req.body;

      User.findOne({ email: email })
      .then(function(user){
        let pass = id + 'a';
        //If user hasn't been saved into db
        if(user === null){
            User.create({
              name: name,
              email: email,
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
        console.log(err.message)
        res
        .status(400)
        .json(err.message)
      }) 
   }

    static user(req,res){
      let id = req.decoded._id;
      User.findById({_id:id})
      .then(function(user){
         res.status(200).json({
            user
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