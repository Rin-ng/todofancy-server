const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ToDoSchema = new Schema({
    name: {
        type: String,
        required: "Please input task name"
    },
    description:{
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    completed:{
       type: Boolean,
       required: true,
       default: false,
    },
    tags:{
        type: Array,
        default: []
    },
    points: {
        type: Number,
        default: 10,
    }
}, {timestamps:true});


const ToDo = mongoose.model("ToDo", ToDoSchema);
module.exports = ToDo;