var express = require('express');
var router = express.Router();
const todoController = require('../controllers/todo')
const auth = require('../middlewares/auth')

/* GET users listing. */
router
  .get('/searchTags', auth, todoController.searchTags)
  .get('/getComplete', auth, todoController.getTasksComplete)
  .get('/getIncomplete', auth, todoController.getTasksIncomplete)
  .get('/details', auth, todoController.getDetails)
  .post('/searchTasks', auth, todoController.searchTasks)  
  .post('/create', auth, todoController.createTask)
  .put('/complete', auth, todoController.completeTask)
  .delete('/delete', auth, todoController.deleteTask);

module.exports = router;
