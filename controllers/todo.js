const User  = require('../models/user');
const Todo = require('../models/todo');

class ToDoController{
   static createTask(req,res){
      let {name, description} = req.body;
      let tags = req.body.tags.split(" ");
      let user = req.decoded._id;
      console.log(name);
      console.log(tags);
      Todo.create({
         name,
         description,
         tags,
         user
      })
      .then(function(created){
         res.status(200).json({
            message: "created new task",
            created
         });
      })
      .catch(function(err){
         res.status(500).json(err.message);
      })
   }

   static getTasksComplete(req,res){
      Todo.find({user: req.decoded._id, completed: true})
      .populate('users')
      .then(function(list){
         res.status(200).json({
            message: "Here's a list of all completed tasks",
            list
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static getTasksIncomplete(req,res){

      Todo.find({user: req.decoded._id , completed: false})
      .populate('users')
      .then(function(list){
         res.status(200).json({
            message: "Here's a list of all incomplete tasks",
            list
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static getDetails(req,res){
      let taskid = req.headers.taskid;
      
      Todo.find({_id: taskid})
      .then(function(task){
         res.status(200).json({
            message: "Here's the task's details",
            task
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static completeTask(req,res){
      let taskid = req.headers.taskid;
      let userId = req.decoded._id;
      // let password = req.body.password;

      Todo.findById({_id: taskid})
      .then(function(task){
         task.completed = true;
         task.save()
         .then(function(completed){

            User.findById({_id: completed.user})
            .then(function(user){
               let currentProgress = user.progress;
               console.log("before add", currentProgress)
               if((currentProgress += 10) < 100){
                  console.log(currentProgress)
                  User.update({_id:user._id}, {$set:{progress: user.progress+=10}})
                  .then(function(updated){
                     console.log("---", updated)
                     res.status(200).json({
                        completed
                     })
                  })
                  .catch(function(err){
                     res.status(400).json(err.message);
                  })
               }
               else{
                  user.progress = 0;
                  user.level++;

                  user.password = password;
                  console.log("====>", user)
                  user.save()
                  .then(function(updated){
                     res.status(200).json({
                        updated,
                        completed
                     })
                  })
                  .catch(function(err){
                     res.status(400).json(err.message);
                  })
               }
            })
            .catch(function(err){
               console.log("error pas d user ish")
               res.status(400).json(err.message);
            })
         })
         .catch(function(err){
            console.log("Error d saving task")
            res.status(400).json(err.message)
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static searchTasks(req,res){
      let {query} = req.body;
      let id = req.decoded._id;

      Todo.find({user:id, $or: [{name : { $regex: query, $options: 'i'}}, {description: {$regex: query , $options: 'i'}}, {tags: {$regex: query , $options: 'i'}}]})
      .populate('users')
      .then(function(tasks){
        
         res.status(200).json({
            message: `Here's a list of tasks containing the word ${query}`,
            tasks
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static searchTags(req,res){
      let {query} = req.headers;

      Todo.find({user: req.decoded._id, tags: {"$in": [query]}})
      .populate('users')
      .then(function(tasks){
         res.status(200).json({
            message: "here are the tasks with this tag",
            tasks
         })
      })
      .catch(function(err){
         res.status(400).json(err.message)
      })
   }

   static deleteTask(req,res){
      let taskid = req.headers.taskid;

      Todo.deleteOne({_id: taskid})
      .then(function(){
         res.status(200).json("Task deleted")
      })
      .catch(function(err){
         res.status(400).json(err.message);
      })
   }
}

module.exports = ToDoController;