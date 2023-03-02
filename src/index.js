const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/userRoutes')
const taskRouter = require('./routers/taskRoutes')

const app = express()
const port = process.env.PORT || 3000 

//Using the express.json() is very important only bcoz of it, we are able to parse the
//req object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})