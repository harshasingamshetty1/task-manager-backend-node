const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(v=>console.log("MongoDB Connection Success!"))
.catch(e=>console.log("MongoDB Conxn Failed"))