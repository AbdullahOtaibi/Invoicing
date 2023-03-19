const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
   

}, { collection: 'Todos' });

module.exports = ToDo = mongoose.model("ToDo", ToDoSchema);